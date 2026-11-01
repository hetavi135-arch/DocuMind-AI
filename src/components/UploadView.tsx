import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { uploadPdfDocument } from '../api/client.js';
import { DocumentItem } from '../types/document.js';
import { NavTab } from './Sidebar.js';

interface UploadViewProps {
  onUploadSuccess: (doc: DocumentItem) => void;
  onNavigateToWorkspace: (doc: DocumentItem) => void;
  onSelectSampleDoc?: () => void;
}

type UploadStep = 'idle' | 'uploading' | 'extracting' | 'indexing' | 'ready' | 'failed';

export const UploadView: React.FC<UploadViewProps> = ({
  onUploadSuccess,
  onNavigateToWorkspace,
  onSelectSampleDoc,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<UploadStep>('idle');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [processedDoc, setProcessedDoc] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    // 1. Validation
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage('Invalid file type. Only PDF documents (.pdf) are supported.');
      setStep('failed');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 25 MB limit. Please select a smaller PDF.');
      setStep('failed');
      return;
    }

    setSelectedFile(file);
    setErrorMessage(null);
    setProcessedDoc(null);

    // 2. State simulation & actual upload
    try {
      setStep('uploading');
      setProgressPercent(20);

      const progressInterval = setInterval(() => {
        setProgressPercent((prev) => {
          if (prev >= 40 && step === 'uploading') {
            setStep('extracting');
            return 55;
          }
          if (prev >= 70 && step === 'extracting') {
            setStep('indexing');
            return 85;
          }
          return Math.min(prev + 5, 92);
        });
      }, 300);

      const result = await uploadPdfDocument(file);
      clearInterval(progressInterval);

      setProgressPercent(100);
      setStep('ready');
      setProcessedDoc(result.document);
      onUploadSuccess(result.document);
    } catch (err: any) {
      setStep('failed');
      setErrorMessage(
        err.message || 'An error occurred during PDF text extraction and indexing.'
      );
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setStep('idle');
    setProgressPercent(0);
    setErrorMessage(null);
    setProcessedDoc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#192A43] tracking-tight">
          Upload Document
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload any PDF document. Our engine extracts page-by-page text, indexes semantic vectors, and prepares your intelligent workspace.
        </p>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          id="pdf-upload-input"
        />

        {step === 'idle' && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#4779E8] bg-[#4779E8]/5 scale-[1.01]'
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-[#192A43]">
              Drag and drop your PDF here
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              or <span className="text-[#4779E8] font-semibold underline underline-offset-2">browse files</span> from your computer
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 font-medium text-slate-600">
                PDF only
              </span>
              <span>•</span>
              <span>Max file size: 25 MB</span>
              <span>•</span>
              <span>Preserves page-level text</span>
            </div>
          </div>
        )}

        {/* Processing and Progress State */}
        {(step === 'uploading' || step === 'extracting' || step === 'indexing') && (
          <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#4779E8]/10 text-[#4779E8] flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#192A43] truncate max-w-md mx-auto">
                {selectedFile?.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {selectedFile ? formatFileSize(selectedFile.size) : ''}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#4779E8] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4779E8] animate-ping" />
                  <span>
                    {step === 'uploading' && '1. Uploading PDF to server...'}
                    {step === 'extracting' && '2. Extracting text page-by-page...'}
                    {step === 'indexing' && '3. Indexing semantic embeddings...'}
                  </span>
                </span>
                <span className="text-slate-400">{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#4779E8] to-[#7657D5] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-medium text-slate-400">
                <div className={step === 'uploading' ? 'text-[#4779E8] font-bold' : 'text-slate-500'}>
                  1. Upload
                </div>
                <div className={step === 'extracting' ? 'text-[#4779E8] font-bold' : 'text-slate-500'}>
                  2. Extract Text
                </div>
                <div className={step === 'indexing' ? 'text-[#7657D5] font-bold' : 'text-slate-500'}>
                  3. Vector Index
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ready / Success State */}
        {step === 'ready' && processedDoc && (
          <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#23865B] flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#23865B]">
                Processing Complete
              </span>
              <h3 className="text-xl font-extrabold text-[#192A43] mt-1">
                Your document is ready!
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Your document is ready! You can now ask questions, generate summaries and create flashcards.
              </p>
            </div>

            {/* Document Details Card */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between font-semibold text-[#192A43]">
                <span className="truncate max-w-[280px]">{processedDoc.name}</span>
                <span className="text-emerald-700 font-bold">Ready</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Total Pages: {processedDoc.pageCount}</span>
                <span>Word Count: {processedDoc.wordCount.toLocaleString()} words</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Chunks Indexed: {processedDoc.chunks?.length || 0}</span>
                <span>Size: {formatFileSize(processedDoc.fileSize)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigateToWorkspace(processedDoc)}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-[#4779E8] to-[#7657D5] text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-[#4779E8]/20 hover:opacity-95 transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <span>Open Document</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={resetUpload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                Upload Another PDF
              </button>
            </div>
          </div>
        )}

        {/* Failed / OCR Warning State */}
        {step === 'failed' && (
          <div className="py-8 px-4 text-center max-w-lg mx-auto space-y-5 animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-[#D9534F] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#192A43]">
                Processing Failed
              </h3>
              <div className="mt-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 text-left leading-relaxed">
                <div className="flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-[#D9534F] shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={resetUpload}
                className="flex items-center space-x-2 bg-[#192A43] hover:bg-[#192A43]/90 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Another PDF</span>
              </button>

              {onSelectSampleDoc && (
                <button
                  onClick={onSelectSampleDoc}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  Use Sample Research Paper
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Instant Sample Document Option */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50/60 rounded-3xl border border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#4779E8]" />
            <h4 className="text-sm font-bold text-[#192A43]">
              Need a test document right now?
            </h4>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Test instant Q&A, executive summaries, and flashcards using our pre-indexed 6-page Transformer Architecture research paper.
          </p>
        </div>

        <button
          onClick={onSelectSampleDoc}
          className="shrink-0 flex items-center space-x-1.5 bg-white text-[#4779E8] hover:bg-[#4779E8] hover:text-white border border-[#4779E8]/30 font-semibold px-4 py-2 rounded-xl text-xs shadow-xs transition-all hover:scale-105"
        >
          <span>Load Transformer Paper</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
