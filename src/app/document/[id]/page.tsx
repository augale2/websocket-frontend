'use client';

import { useEffect, useState } from 'react';
import { Document } from '@/types/document';
import { getDocument, updateDocument } from '@/lib/documents';
import { isAuthenticated } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function DocumentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchDocument = async () => {
      try {
        const doc = await getDocument(params.id);
        if (!doc) {
          router.push('/');
          return;
        }
        setDocument(doc);
        setContent(doc.content);
        setTitle(doc.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [params.id, router]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const newContent = e.target.value;
      setContent(newContent);
      if (document) {
        updateDocument(document.id, newContent);
      }
    } catch (err) {
      setError('Failed to save changes');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = async () => {
    if (!document || title === document.name) {
      setIsEditingTitle(false);
      return;
    }

    try {
      const updatedDoc = await updateDocument(document.id, content, title);
      setDocument(updatedDoc);
      setIsEditingTitle(false);
    } catch (err) {
      setError('Failed to update title');
      setTitle(document.name);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setTitle(document?.name || '');
      setIsEditingTitle(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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

  if (!document) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-gray-500">Document not found</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push('/')}
          className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
        >
          ← Back
        </button>
        {isEditingTitle ? (
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleTitleKeyDown}
            className="text-2xl font-normal text-gray-900 bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500 px-1"
            autoFocus
          />
        ) : (
          <h1 
            className="text-2xl font-normal text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h1>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full h-[calc(100vh-200px)] p-4 bg-white border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-sm"
        placeholder="Start typing..."
      />
    </main>
  );
} 