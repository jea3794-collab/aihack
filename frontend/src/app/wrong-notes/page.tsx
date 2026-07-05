// 담당: 정윤비 — 오답노트
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getUserId } from "@/lib/user";
import { fetchWrongNotes, submitQuizAnswer, type SubmitResult } from "@/lib/api";
import type { WrongNote } from "@/types";

export default function WrongNotesPage() {
  const [notes, setNotes] = useState<WrongNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [retryPicks, setRetryPicks] = useState<Record<number, number>>({});
  const [retryResults, setRetryResults] = useState<Record<number, SubmitResult>>({});
  const [retrying, setRetrying] = useState<number | null>(null);

  function load() {
    setLoading(true);
    setError(null);
    fetchWrongNotes(getUserId())
      .then(setNotes)
      .catch(() => setError("오답노트를 불러오지 못했습니다. 백엔드 연결을 확인해주세요."))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleRetry(note: WrongNote) {
    const pick = retryPicks[note.id];
    if (pick === undefined) return;
    setRetrying(note.id);
    try {
      const res = await submitQuizAnswer(note.questionId, getUserId(), pick);
      setRetryResults((prev) => ({ ...prev, [note.id]: res }));
    } catch {
      setError("재출제 채점에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setRetrying(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">오답노트</h1>

      {error && (
        <p className="mt-6 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {loading && <p className="mt-6 text-sm text-gray-500">불러오는 중...</p>}

      {!loading && !error && notes.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">
          아직 틀린 문제가 없습니다. 문제풀이에서 문제를 풀어보세요.
        </p>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {notes.map((note) => {
          const retryResult = retryResults[note.id];
          const solved = retryResult?.correct;

          return (
            <div key={note.id} className="glass-panel rounded-xl p-6">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="rounded-full bg-black/5 px-2 py-0.5 dark:bg-white/10">
                  {note.subject}
                </span>
                <span>{new Date(note.createdAt).toLocaleString("ko-KR")}</span>
              </div>

              <p className="mt-3 text-base font-medium">{note.question}</p>

              <div className="mt-4 flex flex-col gap-2">
                {note.choices.map((choice, i) => {
                  const wasSubmitted = i === note.submittedIndex;
                  const isCorrectAnswer = i === note.correctIndex;
                  const isRetryPick = retryPicks[note.id] === i;

                  return (
                    <button
                      key={i}
                      disabled={solved !== undefined}
                      onClick={() =>
                        setRetryPicks((prev) => ({ ...prev, [note.id]: i }))
                      }
                      className={cn(
                        "rounded-lg border px-4 py-2 text-left text-sm transition",
                        "border-black/10 dark:border-white/10",
                        isCorrectAnswer &&
                          "border-brand-green bg-brand-green/10 text-brand-green",
                        wasSubmitted && !isCorrectAnswer && "border-red-500/60",
                        isRetryPick && solved === undefined &&
                          "border-brand-green bg-brand-green/10",
                        !solved && "hover:bg-black/5 dark:hover:bg-white/5",
                      )}
                    >
                      {choice}
                      {wasSubmitted && (
                        <span className="ml-2 text-xs text-gray-500">(제출한 답)</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {note.explanation && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {note.explanation}
                </p>
              )}

              <div className="mt-4 flex items-center justify-end gap-3">
                {retryResult && (
                  <span className={solved ? "text-sm text-brand-green" : "text-sm text-red-600"}>
                    {solved ? "재출제 정답!" : "다시 틀렸습니다."}
                  </span>
                )}
                {solved === undefined && (
                  <button
                    onClick={() => handleRetry(note)}
                    disabled={retryPicks[note.id] === undefined || retrying === note.id}
                    className="rounded-md bg-brand-gradient px-4 py-2 text-sm text-white disabled:opacity-40"
                  >
                    재출제
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
