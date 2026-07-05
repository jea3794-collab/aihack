import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassMate — 물류관리사 합격 전략 엔진",
  description: "AI 기반 물류관리사 학습 도우미",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="flex min-h-screen bg-background font-sans text-gray-900 dark:bg-[#0b1220] dark:text-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 pb-24 md:pb-8">{children}</main>
      </body>
    </html>
  );
}
