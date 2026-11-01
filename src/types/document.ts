export interface DocumentChunk {
  id: string;
  pageNumber: number;
  text: string;
  chunkIndex: number;
  embedding?: number[];
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  wordCount: number;
}

export interface DocumentItem {
  id: string;
  name: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  wordCount: number;
  createdAt: string;
  status: 'uploading' | 'extracting' | 'indexing' | 'ready' | 'failed';
  errorMessage?: string;
  pages: DocumentPage[];
  chunks: DocumentChunk[];
}

export interface GroundedSource {
  pageNumber: number;
  excerpt: string;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: GroundedSource[];
  isStreaming?: boolean;
}

export interface GeneratedSummary {
  id: string;
  documentId: string;
  type: 'quick' | 'detailed' | 'executive';
  content: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  pageNumber: number;
  tag?: string;
  mastered?: boolean;
}

export interface FlashcardSet {
  id: string;
  documentId: string;
  createdAt: string;
  cards: Flashcard[];
}

export interface AppStats {
  totalDocuments: number;
  processedDocuments: number;
  totalSummaries: number;
  totalFlashcards: number;
  totalPages: number;
}
