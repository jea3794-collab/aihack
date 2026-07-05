"use client";

// 자료 업로드 — PDF 법령/개념 문서를 업로드해 AI 튜터의 근거 문서로 등록
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchDocuments, uploadDocumentPdf, type DocumentItem } from "@/lib/api";
import type { Subject } from "@/types";

const SUBJECTS: Subject[] = [
  "물류관리론",
  "화물운송론",
  "보관하역론",
  "국제물류론",
  "물류관련법규",
];

export default function DocumentsPage() {
  const [subject, setSubject] = useState<Subject>(SUBJECTS[0]);
  const [title, setTitle] = useState("");
  const [source, setSource] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function loadDocuments() {
    setLoading(true);
    fetchDocuments()
      .then(setDocuments)
      .catch(() => setError("문서 목록을 불러오지 못했습니다. 백엔드 연결을 확인해주세요."))
      .finally(() => setLoading(false));
  }

  useEffect(loadDocuments, []);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await uploadDocumentPdf({
        file,
        subject,
        title: title.trim() || undefined,
        source: source.trim() || undefined,
      });
      setTitle("");
      setSource("");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">자료 업로드</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        법령·개념 PDF를 업로드하면 텍스트를 추출해 저장하고, AI 튜터가 근거 문서로 활용합니다.
      </p>

      <div className="glass-panel mt-6 rounded-xl p-6">
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm transition",
                subject === s
                  ? "bg-brand-gradient text-white"
                  : "hover:bg-black/5 dark:hover:bg-white/5",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <input
            type="file"
            accept="application/pdf"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <input
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-green dark:border-white/10"
            placeholder="제목 (비워두면 파일명 사용)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-green dark:border-white/10"
            placeholder="근거(조항 등, 선택)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="self-end rounded-md bg-brand-gradient px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "업로드 중..." : "업로드"}
          </button>
        </div>

        {error && (
          <p className="mt-3 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>

      <h2 className="mt-8 text-lg font-semibold">저장된 문서</h2>
      {loading && <p className="mt-3 text-sm text-gray-500">불러오는 중...</p>}
      {!loading && documents.length === 0 && (
        <p className="mt-3 text-sm text-gray-500">아직 업로드된 문서가 없습니다.</p>
      )}
      <div className="mt-3 flex flex-col gap-2">
        {documents.map((doc) => (
          <div key={doc.id} className="glass-panel rounded-lg p-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
                {doc.subject}
              </span>
              {doc.source && <span>{doc.source}</span>}
            </div>
            <p className="mt-2 text-sm font-medium">{doc.title}</p>
            <p className="mt-1 line-clamp-2 text-xs text-gray-500">{doc.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
