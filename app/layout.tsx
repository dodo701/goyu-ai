import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "GOYU AI — 말하면 실행하고, 실행하면 검증한다", description: "GOYU AI 작업 플랫폼" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}
