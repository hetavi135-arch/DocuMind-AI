import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { DocumentChunk, DocumentPage } from '../src/types/document.js';
import { generateEmbedding } from './gemini.js';

export interface ExtractedPdfResult {
  pages: DocumentPage[];
  chunks: DocumentChunk[];
  totalPages: number;
  totalWords: number;
  hasText: boolean;
  sampleExcerpts: string[];
}

/**
 * Extract text from PDF buffer page-by-page using pdfjs-dist
 */
export async function extractPdfData(buffer: Buffer): Promise<ExtractedPdfResult> {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const doc = await loadingTask.promise;
  const totalPages = doc.numPages;
  const pages: DocumentPage[] = [];
  let totalWords = 0;
  const sampleExcerpts: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Join items preserving spacing
    const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>;
    const pageStrings: string[] = [];
    for (const item of items) {
      if (item.str !== undefined) {
        pageStrings.push(item.str);
        if (item.hasEOL) {
          pageStrings.push('\n');
        }
      }
    }

    const rawText = pageStrings.join(' ').replace(/\s{2,}/g, ' ').trim();
    const words = rawText.length > 0 ? rawText.split(/\s+/).filter(Boolean).length : 0;
    totalWords += words;

    pages.push({
      pageNumber: pageNum,
      text: rawText,
      wordCount: words,
    });

    if (rawText.length > 30 && sampleExcerpts.length < 3) {
      sampleExcerpts.push(rawText.slice(0, 180) + '...');
    }
  }

  const hasText = totalWords > 15; // Scanned PDF check

  // Generate chunks (approx 600-900 chars or paragraph bounds)
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 0;

  for (const page of pages) {
    if (!page.text || page.text.trim().length === 0) continue;

    // Split page text into sentences/paragraphs
    const paragraphs = page.text.split(/(?<=\.\s+)|(?<=\n\n+)/).map(p => p.trim()).filter(Boolean);
    
    let currentChunk = '';
    for (const para of paragraphs) {
      if ((currentChunk + ' ' + para).length > 750 && currentChunk.length > 200) {
        chunks.push({
          id: `chunk-${page.pageNumber}-${chunkCounter++}`,
          pageNumber: page.pageNumber,
          text: currentChunk.trim(),
          chunkIndex: chunkCounter,
        });
        currentChunk = para;
      } else {
        currentChunk = currentChunk ? `${currentChunk} ${para}` : para;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push({
        id: `chunk-${page.pageNumber}-${chunkCounter++}`,
        pageNumber: page.pageNumber,
        text: currentChunk.trim(),
        chunkIndex: chunkCounter,
      });
    }
  }

  return {
    pages,
    chunks,
    totalPages,
    totalWords,
    hasText,
    sampleExcerpts,
  };
}

/**
 * Embed document chunks (with batching and safety fallbacks)
 */
export async function embedChunks(chunks: DocumentChunk[]): Promise<DocumentChunk[]> {
  const embeddedChunks: DocumentChunk[] = [];
  
  // We can embed in batches or parallel chunks up to a limit
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    try {
      const embedding = await generateEmbedding(chunk.text);
      embeddedChunks.push({
        ...chunk,
        embedding: embedding || undefined,
      });
    } catch {
      embeddedChunks.push(chunk);
    }
  }

  return embeddedChunks;
}
