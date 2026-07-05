"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bot,
  BookOpen,
  Home,
  NotebookPen,
  ShieldCheck,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ai-tutor", label: "AI 자료 검색", icon: Bot },
  { href: "/quiz", label: "문제풀이", icon: BookOpen },
  { href: "/wrong-notes", label: "오답노트", icon: NotebookPen },
  { href: "/dashboard", label: "취약점 비교분석", icon: BarChart3 },
  { href: "/documents", label: "자료 업로드", icon: Upload },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden h-screen w-64 flex-col gap-1 border-r border-gray-200 bg-card p-4 dark:border-white/10 dark:bg-[#0f1729] md:flex">
        <div className="mb-6 px-2">
          <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-primary text-white">
            <ShieldCheck size={18} />
          </span>
          <span className="mt-2 block text-[2.8rem] font-bold leading-none text-gray-900 dark:text-white">
            PassMate
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                  active
                    ? "bg-primary-light font-medium text-primary-dark"
                    : "text-muted hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-black/5 bg-card/95 px-1 py-2 backdrop-blur dark:border-white/10 dark:bg-[#0f1729]/95 md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 text-[10px] transition",
                active ? "text-primary-dark" : "text-muted",
              )}
            >
              <Icon size={18} />
              <span className="leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
