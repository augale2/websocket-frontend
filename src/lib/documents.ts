import { Document } from '@/types/document';

const STORAGE_KEY = 'documents';

// Get documents from localStorage or initialize with welcome document
function getStoredDocuments(): Document[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const initialDocs = [{
      id: '1',
      name: 'Welcome',
      content: 'Welcome to your new document! Start typing to begin.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDocs));
    return initialDocs;
  }
  return JSON.parse(stored);
}

// Save documents to localStorage
function saveDocuments(docs: Document[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

// Get all documents
export async function getDocuments(): Promise<Document[]> {
  return getStoredDocuments();
}

// Get a single document by ID
export async function getDocument(id: string): Promise<Document | null> {
  return getStoredDocuments().find(doc => doc.id === id) || null;
}

// Create a new document
export async function createDocument(name: string): Promise<Document> {
  const documents = getStoredDocuments();
  const now = new Date().toISOString();
  const newDoc: Document = {
    id: crypto.randomUUID(),
    name,
    content: '',
    createdAt: now,
    updatedAt: now,
  };
  documents.push(newDoc);
  saveDocuments(documents);
  return newDoc;
}

// Update a document
export async function updateDocument(
  id: string,
  content: string,
  name?: string
): Promise<Document> {
  const documents = getStoredDocuments();
  const docIndex = documents.findIndex(doc => doc.id === id);
  if (docIndex === -1) throw new Error('Document not found');

  documents[docIndex] = {
    ...documents[docIndex],
    content,
    name: name || documents[docIndex].name,
    updatedAt: new Date().toISOString(),
  };
  saveDocuments(documents);
  return documents[docIndex];
}

// Delete a document
export async function deleteDocument(id: string): Promise<void> {
  const documents = getStoredDocuments().filter(doc => doc.id !== id);
  saveDocuments(documents);
} 