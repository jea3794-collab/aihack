const STORAGE_KEY = "logimentor_user_id";

export function getUserId(): string {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = `guest-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
