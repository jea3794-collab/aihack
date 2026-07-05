import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/ai-tutor", label: "AI 자료 검색" },
  { href: "/quiz", label: "문제풀이" },
  { href: "/wrong-notes", label: "오답노트" },
  { href: "/dashboard", label: "취약점 비교분석" },
  { href: "/documents", label: "자료 업로드" },
];

export function Sidebar() {
  return (
    <aside className="glass-panel flex h-screen w-64 flex-col gap-2 p-4">
      <div className="mb-6 whitespace-nowrap bg-brand-gradient bg-clip-text text-[2.8rem] font-bold leading-none text-transparent">
        PassMate
      </div>
      <nav className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
