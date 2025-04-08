'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { getDocuments, createDocument, deleteDocument } from '@/lib/documents';
import { getUser, logout, isAuthenticated } from '@/lib/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    setUser(getUser());
    const fetchDocuments = async () => {
      try {
        const docs = await getDocuments();
        setDocuments(docs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load documents');
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [router]);

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument('Untitled Document');
      setDocuments([...documents, newDoc]);
    } catch (err) {
      setError('Failed to create document');
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      setError('Failed to delete document');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-normal text-gray-900">Documents</h1>
            <span className="text-sm text-gray-500">Welcome, {user?.username}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCreateDocument}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              New Document
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No documents yet</p>
            <button
              onClick={handleCreateDocument}
              className="text-blue-500 hover:text-blue-600 text-sm"
            >
              Create your first document
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md hover:border-gray-300"
              >
                <Link
                  href={`/document/${doc.id}`}
                  className="flex-1 text-gray-900 hover:text-blue-600"
                >
                  {doc.name}
                </Link>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
