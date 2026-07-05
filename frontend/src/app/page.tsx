"use client";

// 담당: 장민준 — Home
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDashboardSummary, fetchWrongNotes, type SubjectSummary } from "@/lib/api";
import { getUserId } from "@/lib/user";
import type { WrongNote } from "@/types";

export default function HomePage() {
  const [subjects, setSubjects] = useState<SubjectSummary[] | null>(null);
  const [wrongNotes, setWrongNotes] = useState<WrongNote[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const userId = getUserId();
    Promise.all([
      fetchDashboardSummary(userId).catch(() => ({ subjects: [] })),
      fetchWrongNotes(userId).catch(() => []),
    ]).then(([summary, notes]) => {
      if (cancelled) return;
      setSubjects(summary.subjects);
      setWrongNotes(notes.slice(0, 3));
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="card bg-primary p-6 text-white">
        <h1 className="text-lg font-semibold">안녕하세요 👋</h1>
        <p className="mt-1 text-sm text-white/80">
          PassMate와 함께 물류관리사 합격을 향해 나아가요!
        </p>
        <Link
          href="/quiz"
          className="mt-4 inline-block rounded-2xl bg-white px-4 py-2 text-sm font-medium text-primary transition hover:scale-[1.02]"
        >
          오늘의 학습 시작
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="card p-4 transition hover:scale-[1.02]">
          <h2 className="text-sm font-semibold">오늘의 학습 요약</h2>
          {loading ? (
            <SummarySkeleton />
          ) : subjects && subjects.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {subjects.map((s) => (
                <li key={s.subject} className="flex items-center justify-between text-sm">
                  <span>{s.subject}</span>
                  <span className="text-muted">
                    {s.accuracy}% ({s.total}문제)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted">
              아직 학습 기록이 없습니다.{" "}
              <Link href="/quiz" className="text-primary underline">
                문제풀이
              </Link>
              를 시작해보세요.
            </p>
          )}
        </div>

        <div className="card p-4 transition hover:scale-[1.02]">
          <h2 className="text-sm font-semibold">최근 오답 하이라이트</h2>
          {loading ? (
            <SummarySkeleton />
          ) : wrongNotes && wrongNotes.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {wrongNotes.map((note) => (
                <li key={note.id} className="text-sm">
                  <span className="text-xs text-muted">{note.subject}</span>
                  <p className="line-clamp-1">{note.question}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted">아직 오답 기록이 없습니다.</p>
          )}
          {!loading && wrongNotes && wrongNotes.length > 0 && (
            <Link href="/wrong-notes" className="mt-3 inline-block text-xs text-primary underline">
              오답노트 전체 보기
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div className="mt-3 animate-pulse space-y-2">
      <div className="h-3 w-3/4 rounded bg-black/10 dark:bg-white/10" />
      <div className="h-3 w-1/2 rounded bg-black/10 dark:bg-white/10" />
    </div>
  );
}
