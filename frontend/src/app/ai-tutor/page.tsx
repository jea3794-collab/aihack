"use client";

// 담당: 장민준 — AI Q&A 화면 (질문 입력 + 근거 원문 표시)
import { useState } from "react";
import { askQuestion, type AskResponse } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Subject } from "@/types";

const SUBJECTS: Subject[] = [
  "물류관리론",
  "화물운송론",
  "보관하역론",
  "국제물류론",
  "물류관련법규",
];

export default function AiTutorPage() {
  const [question, setQuestion] = useState("");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = question.trim().length > 0 && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const result = await askQuestion(question.trim(), subject ?? undefined);
      setAnswer(result);
    } catch {
      setError("답변을 가져오지 못했습니다. 잠시 후 다시 시도해주세요.");
      setAnswer(null);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">AI 자료 검색</h1>
        <p className="mt-1 text-sm text-muted">
          법령·개념에 대해 질문하면 문서 근거와 함께 답변합니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSubject(null)}
          className={cn(
            "rounded-2xl px-4 py-1.5 text-sm transition",
            subject === null
              ? "bg-primary text-white"
              : "text-muted hover:bg-black/5 dark:hover:bg-white/5",
          )}
        >
          전체
        </button>
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={cn(
              "rounded-2xl px-4 py-1.5 text-sm transition",
              subject === s
                ? "bg-primary text-white"
                : "text-muted hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="card flex-1 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="예: 보세구역과 자유무역지역의 차이는?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button
          className="rounded-2xl bg-primary px-4 py-2 text-sm text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? "답변 생성 중..." : "질문하기"}
        </button>
      </div>

      {loading && (
        <div className="card animate-pulse p-4">
          <div className="h-3 w-3/4 rounded bg-black/10 dark:bg-white/10" />
          <div className="mt-2 h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" />
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && answer && (
        <div className="card animate-fade-in p-4">
          <p className="text-sm">{answer.answer}</p>
          {answer.sources.length > 0 ? (
            <div className="mt-3 flex flex-col gap-2">
              <p className="text-xs font-medium text-muted">근거 원문</p>
              {answer.sources.map((source, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-3 text-xs leading-relaxed dark:border-white/10 dark:bg-white/[0.03]"
                >
                  {source}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted">
              근거 문서를 찾지 못했습니다. 확인이 필요한 답변입니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
