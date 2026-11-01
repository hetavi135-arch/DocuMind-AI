import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  DocumentItem,
  GeneratedSummary,
  FlashcardSet,
  ChatMessage,
  AppStats,
} from '../src/types/document.js';
import { SAMPLE_DOCUMENTS } from './samples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const DOCS_FILE = path.join(DATA_DIR, 'documents.json');
const SUMMARIES_FILE = path.join(DATA_DIR, 'summaries.json');
const FLASHCARDS_FILE = path.join(DATA_DIR, 'flashcards.json');
const CHATS_FILE = path.join(DATA_DIR, 'chats.json');

async function ensureDir(dirPath: string) {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {
    // Already exists
  }
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function initStorage() {
  await ensureDir(DATA_DIR);
  await ensureDir(UPLOADS_DIR);

  const docs = await readJsonFile<DocumentItem[]>(DOCS_FILE, []);
  if (docs.length === 0) {
    // Seed with sample documents
    await writeJsonFile(DOCS_FILE, SAMPLE_DOCUMENTS);
  }
}

export async function getDocuments(): Promise<DocumentItem[]> {
  await initStorage();
  return readJsonFile<DocumentItem[]>(DOCS_FILE, []);
}

export async function getDocumentById(id: string): Promise<DocumentItem | undefined> {
  const docs = await getDocuments();
  return docs.find((d) => d.id === id);
}

export async function saveDocument(document: DocumentItem): Promise<void> {
  await initStorage();
  const docs = await getDocuments();
  const index = docs.findIndex((d) => d.id === document.id);
  if (index >= 0) {
    docs[index] = document;
  } else {
    docs.unshift(document);
  }
  await writeJsonFile(DOCS_FILE, docs);
}

export async function deleteDocument(id: string): Promise<boolean> {
  await initStorage();
  const docs = await getDocuments();
  const filtered = docs.filter((d) => d.id !== id);
  if (filtered.length !== docs.length) {
    await writeJsonFile(DOCS_FILE, filtered);
    // Also remove summaries and flashcards
    const summaries = await getSummaries();
    await writeJsonFile(
      SUMMARIES_FILE,
      summaries.filter((s) => s.documentId !== id)
    );
    const flashcards = await getFlashcardSets();
    await writeJsonFile(
      FLASHCARDS_FILE,
      flashcards.filter((f) => f.documentId !== id)
    );
    return true;
  }
  return false;
}

export async function getSummaries(documentId?: string): Promise<GeneratedSummary[]> {
  await initStorage();
  const list = await readJsonFile<GeneratedSummary[]>(SUMMARIES_FILE, []);
  if (documentId) {
    return list.filter((s) => s.documentId === documentId);
  }
  return list;
}

export async function saveSummary(summary: GeneratedSummary): Promise<void> {
  await initStorage();
  const list = await getSummaries();
  list.unshift(summary);
  await writeJsonFile(SUMMARIES_FILE, list);
}

export async function getFlashcardSets(documentId?: string): Promise<FlashcardSet[]> {
  await initStorage();
  const sets = await readJsonFile<FlashcardSet[]>(FLASHCARDS_FILE, []);
  if (documentId) {
    return sets.filter((f) => f.documentId === documentId);
  }
  return sets;
}

export async function saveFlashcardSet(set: FlashcardSet): Promise<void> {
  await initStorage();
  const sets = await getFlashcardSets();
  const index = sets.findIndex((s) => s.documentId === set.documentId);
  if (index >= 0) {
    sets[index] = set;
  } else {
    sets.unshift(set);
  }
  await writeJsonFile(FLASHCARDS_FILE, sets);
}

export async function getChatHistory(documentId: string): Promise<ChatMessage[]> {
  await initStorage();
  const allChats = await readJsonFile<Record<string, ChatMessage[]>>(CHATS_FILE, {});
  return allChats[documentId] || [];
}

export async function addChatMessage(documentId: string, message: ChatMessage): Promise<void> {
  await initStorage();
  const allChats = await readJsonFile<Record<string, ChatMessage[]>>(CHATS_FILE, {});
  if (!allChats[documentId]) {
    allChats[documentId] = [];
  }
  allChats[documentId].push(message);
  await writeJsonFile(CHATS_FILE, allChats);
}

export async function clearChatHistory(documentId: string): Promise<void> {
  await initStorage();
  const allChats = await readJsonFile<Record<string, ChatMessage[]>>(CHATS_FILE, {});
  delete allChats[documentId];
  await writeJsonFile(CHATS_FILE, allChats);
}

export async function getAppStats(): Promise<AppStats> {
  const docs = await getDocuments();
  const summaries = await getSummaries();
  const flashcardSets = await getFlashcardSets();

  const totalCards = flashcardSets.reduce((acc, curr) => acc + (curr.cards?.length || 0), 0);
  const totalPages = docs.reduce((acc, curr) => acc + (curr.pageCount || 0), 0);
  const processedDocs = docs.filter((d) => d.status === 'ready').length;

  return {
    totalDocuments: docs.length,
    processedDocuments: processedDocs,
    totalSummaries: summaries.length,
    totalFlashcards: totalCards,
    totalPages,
  };
}
