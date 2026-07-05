import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/ai-tutor", label: "AI 튜터" },
  { href: "/quiz", label: "문제풀이" },
  { href: "/wrong-notes", label: "오답노트" },
  { href: "/dashboard", label: "사용자 취약점 분석" },
  { href: "/documents", label: "자료 업로드" },
];

export function Sidebar() {
  return (
    <aside className="glass-panel flex h-screen w-56 flex-col gap-2 p-4">
      <div className="mb-4 bg-brand-gradient bg-clip-text text-lg font-bold text-transparent">
        PassMate
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
