"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Section = "home" | "chat" | "agent" | "web" | "work" | "proof" | "memory" | "studio" | "desktop" | "settings";
type Conversation = { id: string; title: string; preview: string; updated: string };

const nav: { id: Section; label: string; icon: string; group?: string }[] = [
  { id: "home", label: "홈", icon: "⌂" },
  { id: "chat", label: "Chat", icon: "✦", group: "WORKSPACE" },
  { id: "agent", label: "Agent", icon: "◎", group: "WORKSPACE" },
  { id: "web", label: "Web", icon: "⊕", group: "WORKSPACE" },
  { id: "work", label: "Work", icon: "▣", group: "WORKSPACE" },
  { id: "proof", label: "Proof", icon: "✓", group: "SYSTEM" },
  { id: "memory", label: "Memory", icon: "◈", group: "SYSTEM" },
  { id: "studio", label: "Studio", icon: "⌘", group: "SYSTEM" },
  { id: "desktop", label: "Desktop", icon: "▥", group: "SYSTEM" },
  { id: "settings", label: "설정", icon: "⚙", group: "SYSTEM" },
];

const initialConversations: Conversation[] = [
  { id: "welcome", title: "GOYU AI 시작하기", preview: "GOYU AI에 오신 것을 환영합니다", updated: "오늘" },
  { id: "planning", title: "프로젝트 아이디어 정리", preview: "모델 연결 후 대화가 시작됩니다", updated: "어제" },
];

function Badge({ children, tone = "purple" }: { children: React.ReactNode; tone?: "purple" | "green" | "gray" | "orange" }) {
  const colors = {
    purple: "bg-[#f0edff] text-[#6759ef]",
    green: "bg-[#e4faf3] text-[#179d7b]",
    gray: "bg-[#f1f3f8] text-[#69728d]",
    orange: "bg-[#fff1df] text-[#bd7520]",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${colors[tone]}`}>{children}</span>;
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return <button aria-label={label} title={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-white text-muted transition hover:border-lavender hover:text-lavender">{children}</button>;
}

function Home({ go }: { go: (section: Section) => void }) {
  return <div className="grid-bg min-h-full px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
    <div className="mx-auto max-w-5xl">
      <Badge>GOYU AI PLATFORM</Badge>
      <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.04em] md:text-6xl">말하면 실행하고,<br /><span className="gradient-text">실행하면 검증한다.</span></h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-muted">대화에서 끝나지 않는 AI. 생각을 정리하고, 작업을 실행하고, 결과까지 확인하는 새로운 업무 플랫폼.</p>
      <div className="mt-8 flex flex-wrap gap-3"><button onClick={() => go("chat")} className="rounded-2xl bg-ink px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5">새 대화 시작 <span className="ml-2">→</span></button><button onClick={() => go("agent")} className="rounded-2xl border border-line bg-white px-5 py-3 text-sm font-bold text-ink">Agent 둘러보기</button></div>
      <div className="mt-14 grid gap-4 md:grid-cols-3"><Feature icon="✦" title="GOYU Chat" text="생각을 대화로 정리하세요." onClick={() => go("chat")} /><Feature icon="◎" title="GOYU Agent" text="복잡한 일을 단계별로 실행하세요." onClick={() => go("agent")} /><Feature icon="✓" title="GOYU Proof" text="결과의 신뢰도를 확인하세요." onClick={() => go("proof")} /></div>
      <div className="mt-10 rounded-3xl border border-line bg-white p-6 shadow-soft"><p className="text-xs font-bold uppercase tracking-[.2em] text-muted">A SIMPLE FLOW</p><div className="mt-6 grid gap-4 sm:grid-cols-4">{[["01", "대화", "Chat"], ["02", "실행", "Agent"], ["03", "창작", "Work"], ["04", "검증", "Proof"]].map(([n, a, b]) => <div key={n} className="rounded-2xl bg-[#fafbff] p-4"><span className="text-xs font-bold text-lavender">{n}</span><h3 className="mt-6 text-lg font-bold">{a}</h3><p className="mt-1 text-xs text-muted">{b}가 하나의 흐름으로 연결됩니다.</p></div>)}</div></div>
    </div>
  </div>;
}

function Feature({ icon, title, text, onClick }: { icon: string; title: string; text: string; onClick: () => void }) {
  return <button onClick={onClick} className="group rounded-3xl border border-line bg-white p-5 text-left shadow-soft transition hover:-translate-y-1"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f0edff] text-lg text-lavender">{icon}</div><h3 className="mt-5 font-bold">{title}<span className="float-right text-muted transition group-hover:translate-x-1">→</span></h3><p className="mt-1 text-sm text-muted">{text}</p></button>;
}

function Chat({ conversations, activeId, setActiveId, addConversation, updateConversation }: { conversations: Conversation[]; activeId: string; setActiveId: (id: string) => void; addConversation: () => void; updateConversation: (text: string) => void }) {
  const [input, setInput] = useState("");
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const messages = sent[activeId] ?? [];
  const active = conversations.find(item => item.id === activeId);
  const submit = () => { const value = input.trim(); if (!value) return; setSent(previous => ({ ...previous, [activeId]: [...(previous[activeId] ?? []), value] })); updateConversation(value); setInput(""); };

  return <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-white">
    <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-7"><div className="flex min-w-0 items-center gap-3"><button className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold hover:bg-[#f7f8fc]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f0edff] text-lavender">✦</span><span className="truncate">GOYU General</span><span className="text-xs text-muted">⌄</span></button><Badge tone="orange">연결 대기 중</Badge></div><div className="flex gap-2"><IconButton label="공유">↗</IconButton><IconButton label="더보기">•••</IconButton></div></div>
    <div className="scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-20">{messages.length === 0 ? <div className="mx-auto max-w-2xl py-12 text-center sm:py-20"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#f0edff] text-2xl text-lavender">✦</div><h2 className="mt-5 text-2xl font-bold">무엇을 함께 해볼까요?</h2><p className="mt-2 text-sm leading-6 text-muted">아이디어를 정리하거나, 작업을 계획하거나,<br />새로운 것을 만들어 보세요.</p><div className="mt-8 grid gap-3 text-left sm:grid-cols-2"><Prompt text="이번 주 업무를 정리해줘" onClick={() => setInput("이번 주 업무를 정리해줘")} /><Prompt text="새 프로젝트 아이디어를 구체화해줘" onClick={() => setInput("새 프로젝트 아이디어를 구체화해줘")} /></div></div> : <div className="mx-auto max-w-3xl space-y-6">{messages.map((item, index) => <div key={`${item}-${index}`}><div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-ink p-4 text-sm leading-6 text-white sm:max-w-[75%]">{item}</div><div className="mt-4 flex gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#f0edff] text-lavender">✦</div><div className="rounded-2xl border border-[#f2cf9c] bg-[#fffaf2] p-4 text-sm leading-6 text-[#93601f]"><b>모델 연결 대기 중</b><br />이 요청은 실제 모델에 전달되지 않았습니다. 담당자가 모델 API를 연결하면 답변이 표시됩니다.</div></div></div>)}</div>}</div>
    <div className="border-t border-line bg-white p-4 sm:px-8 lg:px-20"><div className="mx-auto max-w-3xl rounded-2xl border border-line bg-[#fbfcff] p-2 shadow-sm focus-within:border-lavender focus-within:ring-4 focus-within:ring-[#f0edff]"><div className="flex items-end gap-2"><IconButton label="파일 첨부">＋</IconButton><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder="GOYU에게 요청하세요..." className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" rows={1} /><button aria-label="메시지 보내기" title="메시지 보내기" onClick={submit} className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white transition hover:bg-lavender">↑</button></div><div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted"><span>Shift + Enter로 줄바꿈</span><span>GOYU AI · 데모 모드</span></div></div><p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted">현재는 UI 데모입니다. 입력 내용은 모델 API로 전달되지 않습니다.</p></div>
  </div>;
}

function EnhancedChat({ conversations, activeId, setActiveId, addConversation, updateConversation }: { conversations: Conversation[]; activeId: string; setActiveId: (id: string) => void; addConversation: () => void; updateConversation: (text: string) => void }) {
  const [input, setInput] = useState("");
  const [sent, setSent] = useState<Record<string, string[]>>({});
  const [model, setModel] = useState("GOYU General");
  const [modelOpen, setModelOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [webMode, setWebMode] = useState(false);
  const [temporary, setTemporary] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const messages = sent[activeId] ?? [];
  const active = conversations.find(item => item.id === activeId);
  const submit = () => { const value = input.trim(); if (!value) return; setSent(previous => ({ ...previous, [activeId]: [...(previous[activeId] ?? []), value] })); updateConversation(value); setInput(""); };
  const clearDraft = () => { setInput(""); setFiles([]); };

  return <div className="flex h-full min-h-0 flex-col bg-white">
    <div className="relative flex shrink-0 items-center justify-between border-b border-line px-4 py-3 sm:px-7"><div className="flex min-w-0 items-center gap-3"><div className="relative"><button onClick={() => setModelOpen(value => !value)} className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-bold hover:bg-[#f7f8fc]"><span className="grid h-7 w-7 place-items-center rounded-lg bg-[#f0edff] text-lavender">✦</span><span className="truncate">{model}</span><span className="text-xs text-muted">⌄</span></button>{modelOpen && <div className="absolute left-0 top-11 z-30 w-64 rounded-2xl border border-line bg-white p-2 shadow-soft"><p className="px-3 py-2 text-[11px] font-bold text-muted">모델 선택</p>{["GOYU General", "GOYU Mini"].map(item => <button key={item} onClick={() => { setModel(item); setModelOpen(false); }} className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f7f8fc]"><span>{item}</span>{item === model && <span className="text-lavender">✓</span>}</button>)}<p className="mt-2 border-t border-line px-3 pt-2 text-[11px] leading-5 text-muted">현재는 모델 API 연결 전입니다.</p></div>}</div><Badge tone="orange">연결 대기 중</Badge></div><div className="flex gap-2"><IconButton label="새 대화" onClick={addConversation}>＋</IconButton><IconButton label="공유">↗</IconButton><div className="relative"><IconButton label="대화 메뉴" onClick={() => setMoreOpen(value => !value)}>•••</IconButton>{moreOpen && <div className="absolute right-0 top-11 z-30 w-48 rounded-2xl border border-line bg-white p-2 shadow-soft"><button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f7f8fc]">대화 이름 바꾸기</button><button className="w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f7f8fc]">대화 내보내기</button><button className="w-full rounded-xl px-3 py-2 text-left text-sm text-muted hover:bg-[#f7f8fc]">삭제 기능 연결 전</button></div>}</div></div></div>
    <div className="scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-8 sm:px-8 lg:px-20">{messages.length === 0 ? <div className="mx-auto max-w-2xl py-12 text-center sm:py-20"><div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#f0edff] text-2xl text-lavender">✦</div><h2 className="mt-5 text-2xl font-bold">무엇을 함께 해볼까요?</h2><p className="mt-2 text-sm leading-6 text-muted">아이디어를 정리하거나, 작업을 계획하거나,<br />새로운 것을 만들어 보세요.</p><div className="mt-8 grid gap-3 text-left sm:grid-cols-2"><Prompt text="이번 주 업무를 정리해줘" onClick={() => setInput("이번 주 업무를 정리해줘")} /><Prompt text="새 프로젝트 아이디어를 구체화해줘" onClick={() => setInput("새 프로젝트 아이디어를 구체화해줘")} /></div></div> : <div className="mx-auto max-w-3xl space-y-6">{messages.map((item, index) => <div key={`${item}-${index}`}><div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-ink p-4 text-sm leading-6 text-white sm:max-w-[75%]">{item}<div className="mt-3 flex justify-end gap-2 text-[11px] text-white/60"><button title="복사">복사</button><button title="메시지 메뉴">•••</button></div></div><div className="mt-4 flex gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#f0edff] text-lavender">✦</div><div className="rounded-2xl border border-[#f2cf9c] bg-[#fffaf2] p-4 text-sm leading-6 text-[#93601f]"><b>모델 연결 대기 중</b><br />이 요청은 실제 모델에 전달되지 않았습니다. 담당자가 모델 API를 연결하면 답변이 표시됩니다.<div className="mt-3 flex gap-2 text-xs"><button disabled className="rounded-lg border border-[#efcf9e] px-2 py-1 opacity-60">재생성</button><button disabled className="rounded-lg border border-[#efcf9e] px-2 py-1 opacity-60">답변 복사</button></div></div></div></div>)}</div>}</div>
    <div className="sticky bottom-0 z-20 shrink-0 border-t border-line bg-white/95 p-4 backdrop-blur sm:px-8 lg:px-20"><div className="mx-auto max-w-3xl rounded-2xl border border-line bg-[#fbfcff] p-2 shadow-sm focus-within:border-lavender focus-within:ring-4 focus-within:ring-[#f0edff]"><div className="flex items-end gap-2"><label className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-line bg-white text-lg text-muted transition hover:border-lavender hover:text-lavender" title="파일 첨부"><input type="file" multiple className="hidden" onChange={event => setFiles(Array.from(event.target.files ?? []).map(file => file.name))} />＋</label><textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submit(); } }} placeholder="GOYU에게 요청하세요..." className="min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" rows={1} /><button aria-label="음성 입력" title="음성 입력은 연결 전입니다" className="grid h-10 w-10 place-items-center rounded-xl text-lg text-muted hover:bg-[#f0edff] hover:text-lavender">◉</button><button aria-label="메시지 보내기" title="메시지 보내기" onClick={submit} className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white transition hover:bg-lavender">↑</button></div>{files.length > 0 && <div className="mt-2 flex flex-wrap gap-2 px-1">{files.map(file => <span key={file} className="rounded-lg bg-[#f0edff] px-2 py-1 text-[11px] text-lavender">📎 {file}</span>)}</div>}<div className="mt-2 flex flex-wrap items-center gap-2 px-1 text-[11px] text-muted"><button onClick={() => setWebMode(value => !value)} className={`rounded-lg px-2 py-1 transition ${webMode ? "bg-[#e4faf3] font-bold text-[#179d7b]" : "hover:bg-[#f1f3f8]"}`}>⊕ 웹 검색 {webMode ? "켜짐" : "꺼짐"}</button><button onClick={() => setTemporary(value => !value)} className={`rounded-lg px-2 py-1 transition ${temporary ? "bg-[#fff1df] font-bold text-[#bd7520]" : "hover:bg-[#f1f3f8]"}`}>◌ 임시 채팅 {temporary ? "켜짐" : "꺼짐"}</button><button onClick={clearDraft} className="rounded-lg px-2 py-1 hover:bg-[#f1f3f8]">초안 지우기</button><span className="ml-auto hidden sm:inline">Shift + Enter 줄바꿈 · {model}</span></div></div><p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted">현재는 UI 데모입니다. 파일·웹 검색·음성·모델 응답은 API 연결 후 활성화됩니다.</p></div>
  </div>;
}

function Prompt({ text, onClick }: { text: string; onClick: () => void }) { return <button onClick={onClick} className="rounded-2xl border border-line bg-white p-3 text-left text-sm text-ink transition hover:border-lavender hover:bg-[#faf9ff]">“{text}”<span className="float-right text-muted">↗</span></button>; }

function Panel({ section }: { section: Section }) {
  const info: Record<string, [string, string, string, string]> = { agent: ["GOYU Agent", "복잡한 작업을 계획하고 단계별로 실행합니다.", "실행 대기 중", "◎"], web: ["GOYU Web", "검색, 조사, 비교를 한 곳에서 관리합니다.", "검색 연결 대기 중", "⊕"], work: ["GOYU Work", "문서와 파일을 기반으로 결과물을 만듭니다.", "파일 0개", "▣"], proof: ["GOYU Proof", "작업 결과의 성공 여부와 검증 근거를 확인합니다.", "검증 기록 없음", "✓"], memory: ["GOYU Memory", "저장된 대화와 프로젝트 문맥을 직접 관리합니다.", "저장된 기억 0개", "◈"], studio: ["GOYU Studio", "연결 가능한 도구와 권한을 관리합니다.", "도구 연결 대기 중", "⌘"], desktop: ["GOYU Desktop", "승인 기반 데스크톱 자동화를 준비합니다.", "출시 예정", "▥"], settings: ["설정", "계정, 알림, 보안과 연결 정보를 관리합니다.", "개인 설정", "⚙"] };
  const [title, sub, badge, icon] = info[section];
  return <div className="min-h-full p-5 sm:p-8 lg:p-12"><div className="mx-auto max-w-5xl"><div className="flex items-start justify-between"><div><div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f0edff] text-xl text-lavender">{icon}</div><h1 className="mt-6 text-3xl font-extrabold tracking-tight">{title}</h1><p className="mt-2 text-sm text-muted">{sub}</p></div><Badge tone={section === "desktop" ? "gray" : "orange"}>{badge}</Badge></div><div className="mt-10 grid gap-4 md:grid-cols-3">{["개요", "최근 활동", "연결 설정"].map((label, index) => <div key={label} className="min-h-36 rounded-2xl border border-line bg-white p-5 shadow-soft"><p className="text-sm font-bold">{label}</p><p className="mt-6 text-xs leading-5 text-muted">{index === 0 ? "이 공간은 실제 연결 전에도 구조와 상태를 확인할 수 있습니다." : "아직 표시할 데이터가 없습니다."}</p></div>)}</div><div className="mt-8 rounded-2xl border border-dashed border-[#cfd3e4] bg-white p-8 text-center"><p className="text-sm font-bold">이 기능은 연결 후 활성화됩니다</p><p className="mt-2 text-xs text-muted">백엔드 API와 사용자 인증을 연결하면 이 화면에서 실제 데이터를 관리할 수 있습니다.</p></div></div></div>;
}

function NavItem({ item, active, setActive }: { item: typeof nav[number]; active: Section; setActive: (section: Section) => void }) { return <button onClick={() => setActive(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active === item.id ? "bg-[#f0edff] text-lavender" : "text-muted hover:bg-[#f7f8fc] hover:text-ink"}`}><span className="w-5 text-center text-base">{item.icon}</span>{item.label}{item.id === "desktop" && <Badge tone="gray">Soon</Badge>}</button>; }

export default function Page() {
  const [active, setActive] = useState<Section>("home");
  const [activeId, setActiveId] = useState("welcome");
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const current = nav.find(item => item.id === active);
  const filtered = useMemo(() => conversations.filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.preview.toLowerCase().includes(query.toLowerCase())), [conversations, query]);

  useEffect(() => { const saved = window.localStorage.getItem("goyu-demo-conversations"); if (saved) { try { setConversations(JSON.parse(saved)); } catch { /* ignore invalid local demo data */ } } }, []);
  useEffect(() => { window.localStorage.setItem("goyu-demo-conversations", JSON.stringify(conversations)); }, [conversations]);
  const newConversation = () => { const item = { id: `chat-${Date.now()}`, title: "새 대화", preview: "새로운 대화를 시작하세요", updated: "방금" }; setConversations(previous => [item, ...previous]); setActiveId(item.id); setActive("chat"); };
  const updateConversation = (text: string) => setConversations(previous => previous.map(item => item.id === activeId && item.title === "새 대화" ? { ...item, title: text.slice(0, 28), preview: text, updated: "방금" } : item));
  const go = (section: Section) => setActive(section);

  return <main className="flex h-screen min-h-0 overflow-hidden bg-[#fbfcff]">
    <aside className="hidden w-[270px] shrink-0 border-r border-line bg-[#f8f9fc] md:flex md:flex-col"><div className="flex items-center gap-3 px-5 py-5"><div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-bold text-white">G</div><div><p className="font-extrabold tracking-tight">GOYU AI</p><p className="text-[10px] font-bold tracking-widest text-lavender">WORKSPACE</p></div></div><button onClick={newConversation} className="mx-4 flex items-center justify-center gap-2 rounded-xl border border-line bg-white py-3 text-sm font-bold text-ink shadow-sm transition hover:border-lavender hover:text-lavender">＋ 새 대화</button><div className="px-4 pt-4"><label className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-xs text-muted"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="대화 검색" className="min-w-0 flex-1 bg-transparent outline-none" /></label></div><div className="scrollbar flex-1 overflow-auto px-3 pt-5"><p className="px-3 text-[10px] font-bold tracking-[.18em] text-[#a1a8bd]">최근 대화</p><div className="mt-2 space-y-1">{filtered.map(item => <button key={item.id} onClick={() => { setActiveId(item.id); setActive("chat"); }} className={`w-full rounded-xl px-3 py-2 text-left transition ${active === "chat" && activeId === item.id ? "bg-[#eceaff]" : "hover:bg-white"}`}><p className="truncate text-xs font-bold text-ink">{item.title}</p><p className="mt-1 truncate text-[11px] text-muted">{item.preview}</p></button>)}{filtered.length === 0 && <p className="px-3 py-3 text-xs text-muted">검색 결과가 없습니다.</p>}</div><div className="mt-6 space-y-5">{["WORKSPACE", "SYSTEM"].map(group => <div key={group}><p className="px-3 text-[10px] font-bold tracking-[.18em] text-[#a1a8bd]">{group}</p><div className="mt-2 space-y-1">{nav.filter(item => item.group === group).map(item => <NavItem key={item.id} item={item} active={active} setActive={setActive} />)}</div></div>)}</div></div><div className="border-t border-line p-4"><Link href="/auth" className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-white"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#dcd8ff] text-xs font-bold text-lavender">Y</div><div className="min-w-0"><p className="truncate text-xs font-bold">내 워크스페이스</p><p className="text-[10px] text-muted">로그인 / 개인 플랜</p></div><span className="ml-auto text-muted">›</span></Link><div className="mt-2 flex gap-3 px-2 text-[10px] text-muted"><Link href="/legal/terms" className="hover:text-lavender">이용약관</Link><Link href="/legal/privacy" className="hover:text-lavender">개인정보</Link></div></div></aside>
    <section className="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden"><header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-4 sm:px-7"><div className="flex items-center gap-3"><button onClick={() => setActive("home")} className="font-extrabold tracking-tight md:hidden">GOYU <span className="text-lavender">AI</span></button><div className="hidden items-center gap-2 text-sm text-muted md:flex"><span>Workspace</span><span>/</span><span className="font-bold text-ink">{current?.label}</span></div></div><div className="flex items-center gap-2"><IconButton label="검색">⌕</IconButton><IconButton label="도움말">?</IconButton><Link href="/auth" className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-[#dcd8ff] text-xs font-bold text-lavender">Y</Link></div></header><div className={`min-h-0 flex-1 ${active === "chat" ? "overflow-hidden" : "overflow-auto"}`}>{active === "home" ? <Home go={go} /> : active === "chat" ? <EnhancedChat conversations={conversations} activeId={activeId} setActiveId={setActiveId} addConversation={newConversation} updateConversation={updateConversation} /> : <Panel section={active} />}</div><nav className="flex shrink-0 overflow-x-auto border-t border-line bg-white px-2 py-2 md:hidden">{nav.slice(0, 6).map(item => <button key={item.id} onClick={() => setActive(item.id)} className={`min-w-16 flex-1 rounded-xl px-2 py-2 text-center text-[10px] font-bold ${active === item.id ? "bg-[#f0edff] text-lavender" : "text-muted"}`}><span className="block text-lg">{item.icon}</span>{item.label}</button>)}</nav></section>
  </main>;
}
