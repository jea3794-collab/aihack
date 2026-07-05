import type { WrongNote } from "@/types";

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

export type SubmitResult = {
  questionId: number;
  correct: boolean;
  correctIndex: number;
  explanation: string | null;
};

export async function submitQuizAnswer(
  questionId: number,
  userId: string,
  selectedIndex: number,
): Promise<SubmitResult> {
  const res = await fetch(`${API_BASE_URL}/api/quiz/${questionId}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, selected_index: selectedIndex }),
  });
  if (!res.ok) throw new Error("Failed to submit answer");
  return res.json();
}

export async function fetchWrongNotes(userId: string): Promise<WrongNote[]> {
  const url = new URL(`${API_BASE_URL}/api/wrong-notes`);
  url.searchParams.set("user_id", userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch wrong notes");
  return res.json();
}

export type SubjectSummary = {
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
};

export type DashboardSummary = {
  subjects: SubjectSummary[];
};

export async function fetchDashboardSummary(userId: string): Promise<DashboardSummary> {
  const url = new URL(`${API_BASE_URL}/api/dashboard/summary`);
  url.searchParams.set("user_id", userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch dashboard summary");
  return res.json();
}
