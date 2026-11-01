/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar.js';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './components/LandingPage.js';
import { DashboardView } from './components/DashboardView.js';
import { UploadView } from './components/UploadView.js';
import { MyDocumentsView } from './components/MyDocumentsView.js';
import { DocumentWorkspace } from './components/DocumentWorkspace.js';
import { HistoryView } from './components/HistoryView.js';
import { SettingsView } from './components/SettingsView.js';
import { fetchDocuments, fetchStats, deleteDocument, fetchDocumentById } from './api/client.js';
import { DocumentItem, AppStats } from './types/document.js';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [stats, setStats] = useState<AppStats | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [docs, appStats] = await Promise.all([fetchDocuments(), fetchStats()]);
      setDocuments(docs);
      setStats(appStats);
      if (docs.length > 0 && !selectedDoc) {
        // Fetch full document with chunks
        const fullDoc = await fetchDocumentById(docs[0].id);
        setSelectedDoc(fullDoc);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoadingInitial(false);
    }
  };

  const handleSelectDocument = async (doc: DocumentItem, targetTab?: NavTab) => {
    try {
      const fullDoc = await fetchDocumentById(doc.id);
      setSelectedDoc(fullDoc);
      if (targetTab) {
        setCurrentTab(targetTab);
      }
    } catch {
      setSelectedDoc(doc);
      if (targetTab) {
        setCurrentTab(targetTab);
      }
    }
  };

  const handleUploadSuccess = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
    setSelectedDoc(newDoc);
    fetchStats().then(setStats).catch(() => {});
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      if (selectedDoc?.id === id) {
        const remaining = documents.filter((d) => d.id !== id);
        if (remaining.length > 0) {
          handleSelectDocument(remaining[0]);
        } else {
          setSelectedDoc(null);
        }
      }
      fetchStats().then(setStats).catch(() => {});
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSelectSample = () => {
    const sample = documents.find((d) => d.id === 'doc-sample-transformers') || documents[0];
    if (sample) {
      handleSelectDocument(sample, 'assistant');
    } else {
      setCurrentTab('upload');
    }
  };

  // If on Landing Page, render landing page layout
  if (currentTab === 'landing') {
    return (
      <LandingPage
        onNavigate={(tab) => setCurrentTab(tab)}
        onSelectSampleDoc={handleSelectSample}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#192A43] flex flex-col lg:flex-row antialiased selection:bg-[#4779E8]/20">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        selectedDocName={selectedDoc?.name}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          documents={documents}
          selectedDoc={selectedDoc}
          onSelectDocument={(doc) => handleSelectDocument(doc)}
          onUploadClick={() => setCurrentTab('upload')}
        />

        <main className="flex-1 pb-16">
          {isLoadingInitial ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#4779E8]" />
              <p className="text-xs text-slate-500 font-medium">Initializing DocuMind AI Engine...</p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  documents={documents}
                  onNavigate={(tab) => setCurrentTab(tab)}
                  onSelectDocument={handleSelectDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onResetSamples={loadInitialData}
                />
              )}

              {currentTab === 'upload' && (
                <UploadView
                  onUploadSuccess={handleUploadSuccess}
                  onNavigateToWorkspace={(doc) => handleSelectDocument(doc, 'assistant')}
                  onSelectSampleDoc={handleSelectSample}
                />
              )}

              {currentTab === 'documents' && (
                <MyDocumentsView
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
                  onDeleteDocument={handleDeleteDocument}
                  onNavigateToUpload={() => setCurrentTab('upload')}
                />
              )}

              {(currentTab === 'assistant' || currentTab === 'summaries' || currentTab === 'flashcards') && (
                <>
                  {selectedDoc ? (
                    <DocumentWorkspace
                      key={selectedDoc.id}
                      document={selectedDoc}
                      initialTab={
                        currentTab === 'summaries'
                          ? 'summaries'
                          : currentTab === 'flashcards'
                          ? 'flashcards'
                          : 'assistant'
                      }
                      onBackToDocuments={() => setCurrentTab('documents')}
                    />
                  ) : (
                    <div className="p-8 max-w-xl mx-auto text-center space-y-4">
                      <p className="text-sm text-slate-600">No document selected.</p>
                      <button
                        onClick={() => setCurrentTab('upload')}
                        className="bg-[#192A43] text-white px-4 py-2 rounded-xl text-xs font-semibold"
                      >
                        Upload a PDF
                      </button>
                    </div>
                  )}
                </>
              )}

              {currentTab === 'history' && (
                <HistoryView
                  documents={documents}
                  onSelectDocument={handleSelectDocument}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView onRefreshData={loadInitialData} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
