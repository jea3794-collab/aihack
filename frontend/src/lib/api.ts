import type { WrongNote } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type AskResponse = {
  answer: string;
  sources: string[];
};

export async function askQuestion(question: string, subject?: string): Promise<AskResponse> {
  const res = await fetch(`${API_BASE_URL}/api/qa/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, subject }),
  });
  if (!res.ok) throw new Error("Failed to fetch answer");
  return res.json();
}

export type DocumentItem = {
  id: number;
  subject: string;
  title: string;
  content: string;
  source: string | null;
};

export async function fetchDocuments(subject?: string): Promise<DocumentItem[]> {
  const url = new URL(`${API_BASE_URL}/api/documents`);
  if (subject) url.searchParams.set("subject", subject);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function uploadDocumentFile(params: {
  file: File;
  subject: string;
  title?: string;
  source?: string;
}): Promise<DocumentItem[]> {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("subject", params.subject);
  if (params.title) formData.append("title", params.title);
  if (params.source) formData.append("source", params.source);

  const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? "Failed to upload document");
  }
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

export type SubjectComparison = {
  subject: string;
  myTotal: number;
  myCorrect: number;
  myAccuracy: number;
  overallTotal: number;
  overallCorrect: number;
  overallAccuracy: number;
};

export type DashboardComparison = {
  subjects: SubjectComparison[];
  totalUsers: number;
};

export async function fetchDashboardComparison(userId: string): Promise<DashboardComparison> {
  const url = new URL(`${API_BASE_URL}/api/dashboard/comparison`);
  url.searchParams.set("user_id", userId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch dashboard comparison");
  const data = await res.json();
  return {
    totalUsers: data.total_users,
    subjects: data.subjects.map((s: Record<string, number | string>) => ({
      subject: s.subject,
      myTotal: s.my_total,
      myCorrect: s.my_correct,
      myAccuracy: s.my_accuracy,
      overallTotal: s.overall_total,
      overallCorrect: s.overall_correct,
      overallAccuracy: s.overall_accuracy,
    })),
  };
}
