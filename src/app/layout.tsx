import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DaVal Portfolio & AI Application",
  description: "Automated Portrait & Proposal Suite for DaVal AI SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-64 glass border-r border-zinc-800 flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold tracking-tighter text-blue-500">DaVal</h1>
              <p className="text-xs text-zinc-500">AI Automation SaaS</p>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-2">
              <Link href="/" className="block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">대시보드</Link>
              <Link href="/portfolio" className="block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">포트폴리오 관리</Link>
              <Link href="/company" className="block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">회사 정보</Link>
              <Link href="/awards" className="block px-4 py-2 rounded-lg hover:bg-zinc-800 transition-colors">수상이력</Link>
              <div className="pt-4 mt-4 border-t border-zinc-800">
                <Link href="/generate" className="block px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-center font-semibold">지원서 생성기</Link>
              </div>
            </nav>
            
            <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500 text-center">
              © 2026 DaVal Co., Ltd.
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-[#0a0a0c]/50">
            <header className="h-16 glass sticky top-0 z-10 flex items-center justify-between px-8 border-b border-zinc-800">
              <div className="text-sm font-medium text-zinc-400">Welcome, Administrator</div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 animate-pulse"></div>
              </div>
            </header>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
