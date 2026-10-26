import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalLayout({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[#fbfcff] px-5 py-8 text-ink sm:px-8 lg:px-16"><div className="mx-auto max-w-4xl"><header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6"><Link href="/" className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ink font-bold text-white">G</span><span><span className="block font-extrabold tracking-tight">GOYU AI</span><span className="block text-[10px] font-bold tracking-widest text-lavender">LEGAL</span></span></Link><nav className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-muted"><Link href="/legal/terms" className="hover:text-lavender">이용약관</Link><Link href="/legal/privacy" className="hover:text-lavender">개인정보처리방침</Link><Link href="/legal/cookies" className="hover:text-lavender">쿠키 안내</Link><Link href="/legal/acceptable-use" className="hover:text-lavender">이용 제한</Link></nav></header><article className="mt-10 rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-lavender">GOYU AI DOCUMENT</p><h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>{updated && <p className="mt-3 text-xs text-muted">시행일: {updated}</p>}<div className="legal-copy mt-10">{children}</div></article><div className="mt-6 rounded-2xl border border-[#f2cf9c] bg-[#fffaf2] p-5 text-xs leading-5 text-[#93601f]">이 문서는 GOYU AI 초기 웹사이트용 검토 템플릿입니다. 서비스 운영자 정보, 실제 처리 위탁사, 보관기간, 요금·환불 정책을 확정한 뒤 법률 전문가의 검토를 거쳐 시행하세요.</div><footer className="py-8 text-center text-xs text-muted">© GOYU AI · <Link href="/auth" className="hover:text-lavender">로그인</Link></footer></div></main>;
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2>{title}</h2>{children}</section>;
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul>{children}</ul>;
}
