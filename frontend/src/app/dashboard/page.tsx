// 담당: 정윤비 — 취약과목 대시보드
"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/user";
import { fetchDashboardSummary, type SubjectSummary } from "@/lib/api";

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardSummary(getUserId())
      .then((data) => setSubjects(data.subjects))
      .catch(() => setError("대시보드를 불러오지 못했습니다. 백엔드 연결을 확인해주세요."))
      .finally(() => setLoading(false));
  }, []);

  const weakest = subjects.length
    ? [...subjects].sort((a, b) => a.accuracy - b.accuracy)[0]
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">취약과목 대시보드</h1>

      {error && (
        <p className="mt-6 rounded-md bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {loading && <p className="mt-6 text-sm text-gray-500">불러오는 중...</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="mt-6 text-sm text-gray-500">
          아직 풀이 기록이 없습니다. 문제풀이를 먼저 진행해보세요.
        </p>
      )}

      {weakest && (
        <div className="glass-panel mt-6 rounded-xl p-6">
          <p className="text-sm text-gray-500">가장 취약한 과목</p>
          <p className="mt-1 text-xl font-bold">
            {weakest.subject}{" "}
            <span className="text-brand-orange">{weakest.accuracy}%</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {weakest.correct} / {weakest.total} 문제 정답
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {subjects.map((s) => (
          <div key={s.subject} className="glass-panel rounded-xl p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{s.subject}</span>
              <span className="text-gray-500">
                {s.correct} / {s.total} ({s.accuracy}%)
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
              <div
                className="h-full bg-brand-gradient"
                style={{ width: `${s.accuracy}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
