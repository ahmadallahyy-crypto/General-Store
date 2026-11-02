"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";

// ============================================================
// DIAGNOSTICS (development only)
// Open http://localhost:3001/diagnostics while `npm run dev` is running. It measures what THIS browser actually
// does (zoom, text sizes, which styles loaded, whether photos load, whether clicks work) and gives one report that
// can be copied and sent. It is hidden in production builds (see app/diagnostics/page.tsx).
// ============================================================

type Row = { name: string; expected: string; actual: string; ok: boolean };
type ImageResult = { id: string; direct: string; optimised: string };
type Report = {
  screen: Record<string, string | number>;
  text: Row[];
  css: Row[];
  fullScreenLayers: string[];
  images: ImageResult[];
};

// What each text class should measure (from src/app/typography-tokens.css)
const TEXT_EXPECTED: [string, string][] = [
  ["t-body", "16px"], ["t-caption", "12px"], ["t-card-name-grid", "14px"], ["t-price-card", "16px"],
  ["t-title-page", "24px"], ["t-title-subcategory", "20px"], ["t-title-section", "16px"], ["t-title-block", "15px"], ["t-hero", "24px"], ["t-logo", "24px"],
];

const loadDirect = (src: string) =>
  new Promise<string>((resolve) => {
    const img = new window.Image();
    const timer = setTimeout(() => resolve("timeout (8s)"), 8000);
    img.onload = () => { clearTimeout(timer); resolve(`ok ${img.naturalWidth}x${img.naturalHeight}`); };
    img.onerror = () => { clearTimeout(timer); resolve("FAILED to load"); };
    img.src = src;
  });

async function loadOptimised(src: string) {
  try {
    const res = await fetch(`/_next/image?url=${encodeURIComponent(src)}&w=256&q=75`);
    return res.ok ? `ok (${res.status}, ${res.headers.get("content-type")})` : `FAILED (HTTP ${res.status})`;
  } catch {
    return "FAILED (network)";
  }
}

export function DiagnosticsPanel() {
  const [report, setReport] = useState<Report | null>(null);
  const [running, setRunning] = useState(true);
  const [clicks, setClicks] = useState(0);
  const [copied, setCopied] = useState(false);
  const probeRef = useRef<HTMLDivElement>(null);
  const testButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const probe = probeRef.current;
      if (!probe) return;
      const vv = window.visualViewport;
      const screen = {
        "window width (CSS px)": window.innerWidth,
        "window height (CSS px)": window.innerHeight,
        "screen width (device px)": window.screen.width,
        "device pixel ratio": window.devicePixelRatio,
        "page scale (pinch zoom)": vv ? Math.round(vv.scale * 100) / 100 : "n/a",
        "Ubuntu font loaded": document.fonts.check("16px Ubuntu") ? "yes" : "NO (fallback font in use)",
        "browser": navigator.userAgent.replace(/^Mozilla\/5.0 /, "").slice(0, 90),
      };

      const text: Row[] = TEXT_EXPECTED.map(([cls, baseSize]) => {
        const expected = baseSize;
        const el = document.createElement("span");
        el.className = cls;
        el.textContent = "Mg";
        probe.appendChild(el);
        const actual = getComputedStyle(el).fontSize;
        probe.removeChild(el);
        return { name: `.${cls}`, expected, actual, ok: actual === expected };
      });

      const css: Row[] = [];
      const check = (name: string, expected: string, make: () => HTMLElement, read: (el: HTMLElement) => string) => {
        const el = make();
        probe.appendChild(el);
        const actual = read(el);
        probe.removeChild(el);
        css.push({ name, expected, actual, ok: actual === expected });
      };
      check("Tailwind utilities generated (bg-[#087f8c])", "rgb(37, 99, 235)", () => Object.assign(document.createElement("div"), { className: "bg-[#087f8c]" }), (el) => getComputedStyle(el).backgroundColor);
      check("Tailwind 'hidden' works", "none", () => Object.assign(document.createElement("div"), { className: "hidden" }), (el) => getComputedStyle(el).display);
      check("Product-card styles loaded (.gs .feed is a grid)", "grid", () => { const g = document.createElement("div"); g.className = "gs"; const f = document.createElement("div"); f.className = "feed"; g.appendChild(f); return g; }, (el) => getComputedStyle(el.firstElementChild as HTMLElement).display);
      check("Card photos fill their square (.gs .ph img is 'cover')", "cover", () => { const g = document.createElement("div"); g.className = "gs"; g.innerHTML = '<div class="ph"><img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw="></div>'; return g; }, (el) => getComputedStyle(el.querySelector("img") as HTMLElement).objectFit);
      check("Site colour variable --accent", "#17b5c9", () => document.createElement("div"), () => getComputedStyle(document.documentElement).getPropertyValue("--accent").trim());

      // anything pinned to the screen that covers (almost) all of it could swallow clicks
      const fullScreenLayers = [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.position === "fixed" && r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9 && cs.pointerEvents !== "none"; })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);

      setReport({ screen, text, css, fullScreenLayers, images: [] });
      testButton.current?.click(); // proves click handlers run (React hydrated)

      const sample = products.filter((_, i) => i % 15 === 0).slice(0, 6);
      const images: ImageResult[] = [];
      for (const p of sample) {
        const [direct, optimised] = await Promise.all([loadDirect(p.image), loadOptimised(p.image)]);
        images.push({ id: p.handle, direct, optimised });
        if (cancelled) return;
        setReport((r) => (r ? { ...r, images: [...images] } : r));
      }
      setRunning(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const full = report ? JSON.stringify({ ...report, "click test": clicks > 0 ? "events work" : "NO CLICK RECEIVED" }, null, 2) : "";
  const cell = "border border-[#e5e7eb] px-3 py-2 text-left align-top";
  const bad = "bg-[#fee2e2] text-[#991b1b]";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div ref={probeRef} aria-hidden="true" style={{ position: "absolute", left: -9999, top: 0, visibility: "hidden" }} />
      <h1 className="t-hero t-w-700">Diagnostics</h1>
      <p className="mt-2 t-body text-[#4b5563]">Development only. Wait for “Done”, then press <b>Copy report</b> and send it.</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button ref={testButton} type="button" onClick={() => setClicks((c) => c + 1)} className="min-h-10 border border-[#e5e7eb] bg-white px-4 t-body">Click test: {clicks}</button>
        <button type="button" disabled={!report} onClick={async () => { await navigator.clipboard.writeText(full); setCopied(true); }} className="min-h-10 bg-[#087f8c] px-4 t-body t-w-700 text-white disabled:opacity-60">{copied ? "Copied" : "Copy report"}</button>
        <span className="t-body">{running ? "Running checks..." : "Done"}</span>
      </div>

      {report && (
        <>
          <h2 className="mt-8 t-title-block t-w-700">This browser</h2>
          <table className="mt-2 w-full border-collapse t-caption"><tbody>{Object.entries(report.screen).map(([k, v]) => <tr key={k}><th className={cell}>{k}</th><td className={cell}>{String(v)}</td></tr>)}</tbody></table>
          <p className="mt-2 t-caption text-[#6b7280]">At 100% zoom, “window width” × “device pixel ratio” is about your screen width. If it is much smaller, the page is zoomed in (press Ctrl+0 to reset).</p>

          <h2 className="mt-8 t-title-block t-w-700">Text sizes</h2>
          <table className="mt-2 w-full border-collapse t-caption"><thead><tr><th className={cell}>Class</th><th className={cell}>Should be</th><th className={cell}>Is</th></tr></thead><tbody>{report.text.map((r) => <tr key={r.name} className={r.ok ? "" : bad}><td className={cell}>{r.name}</td><td className={cell}>{r.expected}</td><td className={cell}>{r.actual}</td></tr>)}</tbody></table>

          <h2 className="mt-8 t-title-block t-w-700">Styles</h2>
          <table className="mt-2 w-full border-collapse t-caption"><tbody>{report.css.map((r) => <tr key={r.name} className={r.ok ? "" : bad}><td className={cell}>{r.name}</td><td className={cell}>{r.expected}</td><td className={cell}>{r.actual || "(empty)"}</td></tr>)}</tbody></table>

          <h2 className="mt-8 t-title-block t-w-700">Anything covering the screen?</h2>
          <p className="mt-2 t-body">{report.fullScreenLayers.length ? <span className="text-[#991b1b]">{report.fullScreenLayers.join(", ")}</span> : "No. Nothing is sitting on top of the page."}</p>

          <h2 className="mt-8 t-title-block t-w-700">Photos (6 samples)</h2>
          <table className="mt-2 w-full border-collapse t-caption"><thead><tr><th className={cell}>Product</th><th className={cell}>Direct from the photo site</th><th className={cell}>Through Next.js</th></tr></thead><tbody>{report.images.map((r) => <tr key={r.id} className={/FAILED|timeout/.test(r.direct + r.optimised) ? bad : ""}><td className={cell}>{r.id}</td><td className={cell}>{r.direct}</td><td className={cell}>{r.optimised}</td></tr>)}</tbody></table>
          <pre className="mt-8 max-h-72 overflow-auto border border-[#e5e7eb] bg-[#f9fafb] p-3 t-caption">{full}</pre>
        </>
      )}
    </div>
  );
}
