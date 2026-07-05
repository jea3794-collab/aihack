// 담당: 정윤비 — 문제풀이 UI
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getUserId } from "@/lib/user";
import {
  fetchQuizQuestions,
  submitQuizAnswer,
  type QuizQuestion,
  type SubmitResult,
} from "@/lib/api";

const SUBJECTS = ["물류관리론", "물류관련법규"] as const;

export default function QuizPage() {
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchQuizQuestions(subject)
      .then((data) => {
        setQuestions(data);
        setIndex(0);
        setSelected(null);
        setResult(null);
        setScore({ correct: 0, total: 0 });
      })
      .catch(() => setError("문제를 불러오지 못했습니다. 백엔드 연결을 확인해주세요."))
      .finally(() => setLoading(false));
  }, [subject]);

  const question = questions[index];

  async function handleSubmit() {
    if (!question || selected === null) return;
    setSubmitting(true);
    try {
      const res = await submitQuizAnswer(question.id, getUserId(), selected);
      setResult(res);
      setScore((s) => ({
        correct: s.correct + (res.correct ? 1 : 0),
        total: s.total + 1,
      }));
    } catch {
      setError("채점에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    setIndex((i) => i + 1);
    setSelected(null);
    setResult(null);
  }

  function handleRestart() {
    setIndex(0);
    setSelected(null);
    setResult(null);
    setScore({ correct: 0, total: 0 });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">문제풀이</h1>

      <div className="mt-4 flex gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            onClick={() => setSubject(s)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm transition",
              subject === s
                ? "bg-brand-gradient text-white"
                : "glass-panel hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {loading && <p className="mt-6 text-sm text-gray-500">문제를 불러오는 중...</p>}

      {!loading && !error && questions.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">
          아직 등록된 문제가 없습니다.
        </p>
      )}

      {!loading && question && index < questions.length && (
        <div className="glass-panel mt-6 rounded-xl p-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {index + 1} / {questions.length}
            </span>
            <span>
              맞은 개수 {score.correct} / {score.total}
            </span>
          </div>

          <p className="mt-3 text-base font-medium">{question.question}</p>

          <div className="mt-4 flex flex-col gap-2">
            {question.choices.map((choice, i) => {
              const isSelected = selected === i;
              const isAnswer = result && i === result.correctIndex;
              const isWrongPick = result && isSelected && !result.correct;

              return (
                <button
                  key={i}
                  disabled={!!result}
                  onClick={() => setSelected(i)}
                  className={cn(
                    "rounded-lg border px-4 py-2 text-left text-sm transition",
                    "border-black/10 dark:border-white/10",
                    isSelected && !result && "border-brand-green bg-brand-green/10",
                    isAnswer && "border-brand-green bg-brand-green/10 text-brand-green",
                    isWrongPick && "border-red-500 bg-red-500/10 text-red-600",
                    !result && "hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          {result && (
            <div className="mt-4 rounded-lg bg-black/5 p-3 text-sm dark:bg-white/5">
              <p className={result.correct ? "text-brand-green" : "text-red-600"}>
                {result.correct ? "정답입니다!" : "오답입니다."}
              </p>
              {result.explanation && (
                <p className="mt-1 text-gray-600 dark:text-gray-400">{result.explanation}</p>
              )}
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2">
            {!result ? (
              <button
                onClick={handleSubmit}
                disabled={selected === null || submitting}
                className="rounded-md bg-brand-gradient px-4 py-2 text-sm text-white disabled:opacity-40"
              >
                제출
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="rounded-md bg-brand-gradient px-4 py-2 text-sm text-white"
              >
                {index + 1 < questions.length ? "다음 문제" : "결과 보기"}
              </button>
            )}
          </div>
        </div>
      )}

      {!loading && questions.length > 0 && index >= questions.length && (
        <div className="glass-panel mt-6 rounded-xl p-6 text-center">
          <p className="text-lg font-semibold">
            {score.correct} / {score.total} 문제를 맞혔습니다.
          </p>
          <button
            onClick={handleRestart}
            className="mt-4 rounded-md bg-brand-gradient px-4 py-2 text-sm text-white"
          >
            다시 풀기
          </button>
        </div>
      )}
    </div>
  );
}
