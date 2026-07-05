export type Subject =
  | "물류관리론"
  | "화물운송론"
  | "보관하역론"
  | "국제물류론"
  | "물류관련법규";

export type WrongNote = {
  id: number;
  questionId: number;
  subject: Subject;
  question: string;
  submittedIndex: number;
  correctIndex: number;
  createdAt: string;
};
