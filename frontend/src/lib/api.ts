const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type AskResponse = {
  answer: string;
  sources: string[];
};

export async function askQuestion(question: string): Promise<AskResponse> {
  const res = await fetch(`${API_BASE_URL}/api/qa/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) throw new Error("Failed to fetch answer");
  return res.json();
}

export type QuizQuestion = {
  id: number;
  subject: string;
  question: string;
  choices: string[];
};

export async function fetchQuizQuestions(subject?: string): Promise<QuizQuestion[]> {
  const url = new URL(`${API_BASE_URL}/api/quiz`);
  if (subject) url.searchParams.set("subject", subject);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch quiz questions");
  return res.json();
}

export async function fetchDashboardSummary(userId: string) {
  const url = new URL(`${API_BASE_URL}/api/dashboard/summary`);
  url.searchParams.set("user_id", userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}
