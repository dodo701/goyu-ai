"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password || (signup && !name)) { setMessage("필수 항목을 입력해 주세요."); return; }
    if (signup && !accepted) { setMessage("이용약관과 개인정보처리방침에 동의해 주세요."); return; }
    setMessage("인증 서버를 확인하는 중입니다...");
    try {
      const response = await fetch(signup ? "/api/auth/register" : "/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name, email, password }) });
      const payload = await response.json().catch(() => ({}));
      setMessage(payload.message ?? (response.ok ? "인증 요청이 접수되었습니다." : "인증 서버에 연결할 수 없습니다."));
    } catch {
      setMessage("인증 서버가 아직 연결되지 않았습니다. 아래의 미리보기로 화면을 확인할 수 있습니다.");
    }
  };

  return <main className="grid min-h-screen place-items-center bg-[#fbfcff] px-5 py-10 grid-bg"><div className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-soft"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-ink font-bold text-white">G</div><div><p className="font-extrabold">GOYU AI</p><p className="text-[10px] font-bold tracking-widest text-lavender">WORKSPACE</p></div></div><div className="mt-8 rounded-xl bg-[#fffaf2] px-4 py-3 text-xs leading-5 text-[#93601f]"><b>인증 API 연결 전</b><br/>현재는 로그인 화면과 동의 흐름만 준비되어 있습니다. 실제 계정 생성·로그인은 백엔드 인증 연결 후 활성화됩니다.</div><h1 className="mt-8 text-2xl font-extrabold">{signup ? "GOYU AI 시작하기" : "다시 만나서 반가워요"}</h1><p className="mt-2 text-sm text-muted">{signup ? "나만의 AI 작업 공간을 만들어 보세요." : "워크스페이스에 로그인하세요."}</p><form onSubmit={submit} className="mt-7 space-y-3">{signup && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="이름" className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-lavender"/>}<input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="이메일" type="email" autoComplete="email" className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-lavender"/><input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호" type="password" autoComplete={signup ? "new-password" : "current-password"} className="w-full rounded-xl border border-line px-4 py-3 text-sm outline-none focus:border-lavender"/>{signup && <label className="flex items-start gap-2 pt-2 text-xs leading-5 text-muted"><input checked={accepted} onChange={(event) => setAccepted(event.target.checked)} type="checkbox" className="mt-1 accent-[#7568f5]"/><span><Link href="/legal/terms" className="font-bold text-lavender hover:underline">이용약관</Link>과 <Link href="/legal/privacy" className="font-bold text-lavender hover:underline">개인정보처리방침</Link>을 읽고 동의합니다.</span></label>}<button className="w-full rounded-xl bg-ink py-3 text-sm font-bold text-white transition hover:bg-lavender">{signup ? "회원가입 요청" : "로그인 요청"}</button></form>{message && <p className="mt-4 rounded-xl bg-[#f7f8fc] p-3 text-xs leading-5 text-muted">{message}</p>}<button onClick={() => { setSignup(!signup); setMessage(""); }} className="mt-5 w-full text-sm font-bold text-lavender">{signup ? "이미 계정이 있어요 · 로그인" : "처음이신가요 · 회원가입"}</button><button onClick={() => router.push("/")} className="mt-3 w-full rounded-xl border border-line py-3 text-sm font-bold text-ink hover:border-lavender">로그인 없이 데모 보기</button><div className="mt-7 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted"><Link href="/legal/terms" className="hover:text-lavender">이용약관</Link><Link href="/legal/privacy" className="hover:text-lavender">개인정보처리방침</Link><Link href="/legal/cookies" className="hover:text-lavender">쿠키 안내</Link><Link href="/legal/acceptable-use" className="hover:text-lavender">이용 제한</Link></div></div></main>;
}
