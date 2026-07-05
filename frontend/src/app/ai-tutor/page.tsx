"use client";

// 담당: 장민준 — AI Q&A 화면 (질문 입력 + 근거 원문 표시)
import { useState } from "react";
import { askQuestion } from "@/lib/api";

export default function AiTutorPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ answer: string; sources: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const result = await askQuestion(question);
      setAnswer(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">AI 튜터</h1>
      {/* TODO: 실제 입력 컴포넌트(shadcn Input/Button)로 교체 */}
      <div className="flex gap-2">
        <input
          className="glass-panel flex-1 rounded-md px-3 py-2 text-sm"
          placeholder="예: 보세구역과 자유무역지역의 차이는?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="rounded-md bg-brand-gradient px-4 py-2 text-sm text-white"
          onClick={handleSubmit}
          disabled={loading}
        >
          질문하기
        </button>
      </div>
      {answer && (
        <div className="glass-panel rounded-md p-4">
          <p className="text-sm">{answer.answer}</p>
          {/* TODO: 근거 원문 카드 UI로 개선 */}
          {answer.sources.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-xs text-muted-foreground">
              {answer.sources.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
