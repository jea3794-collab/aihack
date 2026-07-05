"use client";

// 담당: 장민준 — Home
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DEMO_USER_ID,
  fetchDashboardSummary,
  fetchWrongNotes,
  type SubjectSummary,
} from "@/lib/api";
import type { WrongNote } from "@/types";

export default function HomePage() {
  const [subjects, setSubjects] = useState<SubjectSummary[] | null>(null);
  const [wrongNotes, setWrongNotes] = useState<WrongNote[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchDashboardSummary(DEMO_USER_ID).catch(() => ({ subjects: [] })),
      fetchWrongNotes(DEMO_USER_ID).catch(() => []),
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
      <div>
        <h1 className="text-2xl font-bold">LogiMentor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          AI 기반 물류관리사 합격 전략 엔진. 왼쪽 메뉴에서 시작하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-md p-4">
          <h2 className="text-sm font-medium">오늘의 학습 요약</h2>
          {loading ? (
            <SummarySkeleton />
          ) : subjects && subjects.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {subjects.map((s) => (
                <li key={s.subject} className="flex items-center justify-between text-sm">
                  <span>{s.subject}</span>
                  <span className="text-muted-foreground">
                    {s.accuracy}% ({s.total}문제)
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">
              아직 학습 기록이 없습니다.{" "}
              <Link href="/quiz" className="underline">
                문제풀이
              </Link>
              를 시작해보세요.
            </p>
          )}
        </div>

        <div className="glass-panel rounded-md p-4">
          <h2 className="text-sm font-medium">최근 오답 하이라이트</h2>
          {loading ? (
            <SummarySkeleton />
          ) : wrongNotes && wrongNotes.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-2">
              {wrongNotes.map((note) => (
                <li key={note.id} className="text-sm">
                  <span className="text-xs text-muted-foreground">{note.subject}</span>
                  <p className="line-clamp-1">{note.question}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-xs text-muted-foreground">아직 오답 기록이 없습니다.</p>
          )}
          {!loading && wrongNotes && wrongNotes.length > 0 && (
            <Link href="/wrong-notes" className="mt-3 inline-block text-xs underline">
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
