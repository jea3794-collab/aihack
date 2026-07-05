// 담당: 정윤비 — 취약과목 대시보드
"use client";

import { useEffect, useState } from "react";
import { getUserId } from "@/lib/user";
import {
  fetchDashboardComparison,
  fetchDashboardSummary,
  fetchExamReference,
  type ExamReference,
  type SubjectComparison,
  type SubjectSummary,
} from "@/lib/api";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function DashboardPage() {
  const [subjects, setSubjects] = useState<SubjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comparison, setComparison] = useState<SubjectComparison[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [comparisonLoading, setComparisonLoading] = useState(true);

  const [examReference, setExamReference] = useState<ExamReference | null>(null);

  useEffect(() => {
    fetchDashboardSummary(getUserId())
      .then((data) => setSubjects(data.subjects))
      .catch(() => setError("대시보드를 불러오지 못했습니다. 백엔드 연결을 확인해주세요."))
      .finally(() => setLoading(false));

    fetchDashboardComparison(getUserId())
      .then((data) => {
        setComparison(data.subjects);
        setTotalUsers(data.totalUsers);
      })
      .catch(() => {})
      .finally(() => setComparisonLoading(false));

    fetchExamReference()
      .then(setExamReference)
      .catch(() => {});
  }, []);

  const weakest = subjects.length
    ? [...subjects].sort((a, b) => a.accuracy - b.accuracy)[0]
    : null;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">취약점 비교분석</h1>

      {error && (
        <p className="mt-6 rounded-2xl bg-red-500/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      {loading && <p className="mt-6 text-sm text-muted">불러오는 중...</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          아직 풀이 기록이 없습니다. 문제풀이를 먼저 진행해보세요.
        </p>
      )}

      {weakest && (
        <div className="card mt-6 p-6">
          <p className="text-sm text-muted">가장 취약한 과목</p>
          <p className="mt-1 text-xl font-bold">
            {weakest.subject}{" "}
            <span className="text-warning">{weakest.accuracy}%</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {weakest.correct} / {weakest.total} 문제 정답
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3">
        {subjects.map((s) => (
          <div key={s.subject} className="card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{s.subject}</span>
              <span className="text-muted">
                {s.correct} / {s.total} ({s.accuracy}%)
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={s.accuracy} />
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg font-semibold">다른 사용자와 비교</h2>
      <p className="mt-1 text-xs text-muted">
        {comparisonLoading
          ? "불러오는 중..."
          : `전체 이용자 ${totalUsers}명의 데이터 기준`}
      </p>

      {!comparisonLoading && comparison.length === 0 && (
        <p className="mt-3 text-sm text-muted">비교할 데이터가 아직 없습니다.</p>
      )}

      <div className="mt-3 flex flex-col gap-3">
        {comparison.map((s) => (
          <div key={s.subject} className="card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{s.subject}</span>
              <span className="text-muted">
                나 {s.myAccuracy}% · 전체 평균 {s.overallAccuracy}%
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={s.myAccuracy} markerValue={s.overallAccuracy} />
            </div>
          </div>
        ))}
      </div>

      {examReference && (
        <>
          <h2 className="mt-10 text-lg font-semibold">실제 시험 결과 참고</h2>
          <p className="mt-1 text-xs text-muted">
            제{examReference.round}회({examReference.year}년) · 시행일{" "}
            {examReference.examDate} · 발표일 {examReference.resultDate}
          </p>

          <div className="card mt-3 p-4">
            <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted">접수인원</p>
                <p className="mt-1 font-semibold">
                  {examReference.applicants.toLocaleString()}명
                </p>
              </div>
              <div>
                <p className="text-muted">응시인원</p>
                <p className="mt-1 font-semibold">
                  {examReference.examinees.toLocaleString()}명
                </p>
              </div>
              <div>
                <p className="text-muted">합격인원</p>
                <p className="mt-1 font-semibold">
                  {examReference.passed.toLocaleString()}명
                </p>
              </div>
              <div>
                <p className="text-muted">응시율</p>
                <p className="mt-1 font-semibold">{examReference.attendanceRate}%</p>
              </div>
              <div>
                <p className="text-muted">합격률</p>
                <p className="mt-1 font-semibold text-success">
                  {examReference.passRate}%
                </p>
              </div>
              <div>
                <p className="text-muted">불합격률</p>
                <p className="mt-1 font-semibold text-warning">
                  {examReference.failRate}%
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              {examReference.failRateNote}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
