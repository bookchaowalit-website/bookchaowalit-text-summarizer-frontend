"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  badge = "Portfolio demo · local-only",
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{badge}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Honest demo: no multi-tenant backend. State (if any) stays in this browser.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue] as const;
}

function uid() {
  return crypto.randomUUID();
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}


export default function Home() {
  const [text, setText] = useState("Portfolio demos should be honest. A short summary tool can extract the first sentences and key phrases without calling an external LLM API. Keep claims bounded.");
  const [n, setN] = useState(2);
  const summary = useMemo(() => {
    const sentences = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter(Boolean);
    const top = sentences.slice(0, Math.max(1, n)).join(" ");
    const words = text.toLowerCase().match(/[a-z\u0e00-\u0e7f]{4,}/g) || [];
    const freq = new Map<string, number>();
    words.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
    const keywords = [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
    return { top, keywords, sentences: sentences.length, words: words.length };
  }, [text, n]);
  return (
    <Shell title="Text Summarizer" subtitle="Extractive summary without an LLM API — first sentences + keyword frequency.">
      <textarea className={`${inputClass} min-h-[160px]`} value={text} onChange={(e) => setText(e.target.value)} />
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm">Sentences</span>
        <input type="number" min={1} max={10} className={`${inputClass} w-20`} value={n} onChange={(e) => setN(Number(e.target.value))} />
      </div>
      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="font-medium">Extractive summary</h2>
        <p className="mt-2 text-sm leading-relaxed">{summary.top || "—"}</p>
        <p className="mt-3 text-xs text-zinc-500">{summary.sentences} sentences · {summary.words} words</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {summary.keywords.map((k) => (
            <span key={k} className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-900">{k}</span>
          ))}
        </div>
      </div>
    </Shell>
  );
}
