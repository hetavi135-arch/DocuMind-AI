import {
  DocumentItem,
  GeneratedSummary,
  FlashcardSet,
  ChatMessage,
  AppStats,
} from '../types/document.js';

export async function fetchStats(): Promise<AppStats> {
  const res = await fetch('/api/stats');
  if (!res.ok) throw new Error('Failed to fetch statistics');
  return res.json();
}

export async function fetchDocuments(): Promise<DocumentItem[]> {
  const res = await fetch('/api/documents');
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchDocumentById(id: string): Promise<DocumentItem> {
  const res = await fetch(`/api/documents/${id}`);
  if (!res.ok) throw new Error('Failed to fetch document');
  return res.json();
}

export async function uploadPdfDocument(file: File): Promise<{ message: string; document: DocumentItem }> {
  const formData = new FormData();
  formData.append('pdf', file);

  const res = await fetch('/api/documents/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to upload PDF');
  }
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`/api/documents/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete document');
}

export async function sendChatMessage(
  documentId: string,
  question: string
): Promise<{
  answer: string;
  sources: any[];
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, question }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Chat request failed');
  return data;
}

export async function fetchChatHistory(documentId: string): Promise<ChatMessage[]> {
  const res = await fetch(`/api/chat/${documentId}`);
  if (!res.ok) throw new Error('Failed to fetch chat history');
  return res.json();
}

export async function clearChatHistory(documentId: string): Promise<void> {
  const res = await fetch(`/api/chat/${documentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear chat');
}

export async function generateDocumentSummary(
  documentId: string,
  type: 'quick' | 'detailed' | 'executive'
): Promise<GeneratedSummary> {
  const res = await fetch('/api/summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, type }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate summary');
  return data;
}

export async function fetchDocumentSummaries(documentId: string): Promise<GeneratedSummary[]> {
  const res = await fetch(`/api/summary/${documentId}`);
  if (!res.ok) throw new Error('Failed to fetch summaries');
  return res.json();
}

export async function generateFlashcards(
  documentId: string,
  count: number = 10
): Promise<FlashcardSet> {
  const res = await fetch('/api/flashcards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentId, count }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to generate flashcards');
  return data;
}

export async function fetchFlashcardSet(documentId: string): Promise<FlashcardSet | null> {
  const res = await fetch(`/api/flashcards/${documentId}`);
  if (!res.ok) throw new Error('Failed to fetch flashcards');
  return res.json();
}

export async function updateCardMastery(
  documentId: string,
  cardId: string,
  mastered: boolean
): Promise<void> {
  const res = await fetch(`/api/flashcards/${documentId}/mastery`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardId, mastered }),
  });
  if (!res.ok) throw new Error('Failed to update card mastery');
}

export async function resetSampleDocs(): Promise<void> {
  const res = await fetch('/api/documents/reset-samples', { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset samples');
}
