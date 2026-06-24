import React, { useMemo } from "react";

const MSG = "w-full h-full flex items-center justify-center text-white/60";

// Normal (non-kinetic) scrolling lyrics that center + highlight the active line,
// driven by playback time. Used for preview / plain mode.
const NLINE_H = 52;
function NormalScroll({ lines, active }) {
  const idx = Math.max(active, 0);
  return (
    <div className="w-full max-w-[860px] h-full overflow-hidden relative text-center [mask-image:linear-gradient(180deg,transparent,#000_18%,#000_82%,transparent)] [-webkit-mask-image:linear-gradient(180deg,transparent,#000_18%,#000_82%,transparent)]">
      <div
        className="absolute top-1/2 left-0 right-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{ transform: `translateY(${-(idx * NLINE_H + NLINE_H / 2)}px)` }}
      >
        {lines.map((l, i) => (
          <p
            key={i}
            className={`h-[52px] m-0 flex items-center justify-center px-4 text-[1.4rem] leading-[1.2] transition-[opacity,color,transform] duration-300 ${
              i === active ? "text-white font-bold opacity-100 scale-105" : "text-white/40 opacity-50"
            }`}
          >
            {l.text || "♪"}
          </p>
        ))}
      </div>
    </div>
  );
}

// Template library for the current line. `kind` controls typography/motion.
// Only `kind: "rotated"` shows the 90° previous/next columns.
const SIZE = {
  chars:    "clamp(1.9rem,5vw,3.6rem)",
  emphasis: "clamp(1.9rem,5vw,3.6rem)",
  mixed:    "clamp(1.5rem,3.8vw,2.6rem)",
  big:      "clamp(2.6rem,7.5vw,5.5rem)",
  steps:    "clamp(1.3rem,3.2vw,2.2rem)",
  type:     "clamp(1.9rem,4.8vw,3.3rem)",
  rotated:  "clamp(1.9rem,5vw,3.6rem)",
};
const TEMPLATES = [
  { kind: "mixed",    font: "sans",  justify: "justify-center", items: "items-center", text: "text-center", tilt: 0,  graphic: "web" },
  { kind: "big",      font: "sans",  justify: "justify-center", items: "items-start",  text: "text-left",   tilt: -6, upper: true, graphic: "web" },
  { kind: "chars",    font: "serif", justify: "justify-center", items: "items-end",    text: "text-right",  tilt: 7,  graphic: "none" },
  { kind: "type",     font: "sans",  justify: "justify-end",    items: "items-center", text: "text-center", tilt: -7, upper: true, graphic: "none" },
  { kind: "emphasis", font: "serif", justify: "justify-center", items: "items-start",  text: "text-left",   tilt: 6,  graphic: "web" },
  { kind: "steps",    font: "sans",  justify: "justify-center", items: "items-start",  text: "text-left",   tilt: 0,  dir: "left",  graphic: "none" },
  { kind: "rotated",  font: "serif", justify: "justify-center", items: "items-center", text: "text-center", tilt: 0,  graphic: "web" },
  { kind: "chars",    font: "sans",  justify: "justify-start",  items: "items-end",    text: "text-right",  tilt: -5, upper: true, graphic: "none" },
  { kind: "mixed",    font: "serif", justify: "justify-end",    items: "items-end",    text: "text-right",  tilt: 7,  graphic: "web" },
  { kind: "big",      font: "serif", justify: "justify-center", items: "items-center", text: "text-center", tilt: 0,  graphic: "none" },
  { kind: "rotated",  font: "sans",  justify: "justify-center", items: "items-center", text: "text-center", tilt: 0,  upper: true, graphic: "web" },
  { kind: "emphasis", font: "sans",  justify: "justify-start",  items: "items-start",  text: "text-left",   tilt: 0,  upper: true, graphic: "none" },
  { kind: "steps",    font: "serif", justify: "justify-center", items: "items-end",    text: "text-right",  tilt: 0,  dir: "right", graphic: "web" },
];

// Deterministic scramble of a line index → a value with good spread.
function hashInt(x) {
  let h = (x ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

// --- entrance renderers -----------------------------------------------------

// Blur+rise, staggered (per word for spaced text, per char otherwise).
function CharStagger({ text }) {
  const src = text || "♪";
  if (/\s/.test(src)) {
    let k = 0;
    return src.split(/(\s+)/).map((tok, i) => {
      if (/^\s+$/.test(tok)) return <span key={i}> </span>;
      const delay = Math.min(k++ * 0.05, 0.9);
      return <span key={i} className="vf-char" style={{ animationDelay: `${delay}s` }}>{tok}</span>;
    });
  }
  return Array.from(src).map((ch, i) => (
    <span key={i} className="vf-char" style={{ animationDelay: `${Math.min(i * 0.04, 0.9)}s` }}>{ch}</span>
  ));
}

// Last word enlarged + lighter (image 1, "corazón").
function Emphasis({ text }) {
  const src = text || "♪";
  if (!/\s/.test(src)) return <CharStagger text={src} />;
  const words = src.trim().split(/\s+/);
  const last = words.pop();
  return (
    <>
      <span className="vf-char" style={{ animationDelay: "0s" }}>{words.join(" ")} </span>
      <span className="vf-char inline-block font-black" style={{ animationDelay: "0.12s", fontSize: "1.5em", color: "rgba(255,255,255,0.55)" }}>{last}</span>
    </>
  );
}

// Small + big words mixed, dim small / bold big (image 1).
function Mixed({ text }) {
  const sizes = [0.65, 1.5, 0.95, 1.9, 0.8, 1.25, 1.05, 1.7];
  const spaced = /\s/.test(text);
  const units = spaced ? (text || "♪").trim().split(/\s+/) : Array.from(text || "♪");
  return units.map((u, i) => {
    const s = sizes[i % sizes.length];
    return (
      <span
        key={i}
        className="vf-char inline-block"
        style={{
          animationDelay: `${Math.min(i * 0.05, 0.9)}s`,
          fontSize: `${s}em`,
          fontWeight: s >= 1.4 ? 900 : 600,
          color: s < 0.85 ? "rgba(255,255,255,0.55)" : "white",
          marginRight: spaced ? "0.28em" : 0,
          lineHeight: 1.02,
        }}
      >
        {u}
      </span>
    );
  });
}

// Stepped, increasing-size cascade (image 2). `dir` steps down from the left
// (default) or mirrored down from the right.
function Steps({ text, dir = "left" }) {
  const right = dir === "right";
  const spaced = /\s/.test(text);
  const words = spaced ? text.trim().split(/\s+/) : Array.from(text);
  const n = words.length;
  const parts =
    n >= 3
      ? [words.slice(0, Math.ceil(n / 3)), words.slice(Math.ceil(n / 3), Math.ceil((2 * n) / 3)), words.slice(Math.ceil((2 * n) / 3))]
      : [words];
  const sizes = ["1em", "1.55em", "2.15em"];
  return (
    <div className={`flex flex-col ${right ? "items-end" : "items-start"}`}>
      {parts.map((p, i) => (
        <div
          key={i}
          className={`${right ? "vf-slide-l" : "vf-slide-r"} whitespace-nowrap`}
          style={{
            animationDelay: `${i * 0.12}s`,
            fontSize: sizes[Math.min(i, 2)],
            [right ? "marginRight" : "marginLeft"]: `${i * 1.1}em`,
            fontWeight: 700 + i * 100 > 900 ? 900 : 700 + i * 100,
            lineHeight: 1.1,
          }}
        >
          {spaced ? p.join(" ") : p.join("")}
        </div>
      ))}
    </div>
  );
}

// Typewriter with the spinning "/" <-> "\" cursor.
function Typewriter({ text, progress }) {
  const chars = Array.from(text || "");
  const shown = Math.max(0, Math.min(chars.length, Math.ceil(progress * chars.length)));
  return (
    <>
      <span>{chars.slice(0, shown).join("")}</span>
      <span className="vf-cur"><span className="a">/</span><span className="b">\</span></span>
    </>
  );
}

// --- graphics ---------------------------------------------------------------

function WebGraphic({ labels }) {
  const nodes = [
    { x: 30, y: 38 }, { x: 82, y: 18 }, { x: 122, y: 52 },
    { x: 58, y: 80 }, { x: 168, y: 30 }, { x: 112, y: 96 },
  ];
  const links = [[0, 1], [1, 2], [1, 3], [2, 4], [3, 5], [1, 4], [0, 3]];
  return (
    <svg className="absolute left-1/2 bottom-[6%] -translate-x-1/2 w-[72vmin] max-w-[720px] opacity-50" viewBox="0 0 200 110" fill="none" preserveAspectRatio="xMidYMid meet">
      <g className="vf-drift-a" style={{ transformOrigin: "center", transformBox: "fill-box" }}>
        {links.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
        ))}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="1.3" fill="rgba(255,255,255,0.45)" />
            {labels[i] && (
              <text x={n.x + 3} y={n.y - 2.5} fontSize="4" fill="rgba(255,255,255,0.4)" style={{ letterSpacing: "0.5px" }}>{labels[i]}</text>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

function Graphics({ beat, variant, labels }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="w-[68vmin] h-[68vmin] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.13), transparent 65%)", filter: "blur(24px)", animation: "vf-glow 7s ease-in-out infinite" }}
        />
      </div>
      {variant === "web" && <WebGraphic labels={labels} />}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div key={beat} className="vf-pulse-ring w-[44vmin] h-[44vmin] rounded-full border border-white/20" />
      </div>
    </div>
  );
}

// A line rotated into the vertical position (only used by the "rotated" kind).
function RotatedColumn({ text, posStyle, fontClass, size, opacity, animated }) {
  return (
    <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none" style={posStyle}>
      <div
        className={`${fontClass} font-bold leading-[1.08] ${animated ? "vf-rot" : ""}`}
        style={animated ? { maxWidth: "46vmin", fontSize: size } : { maxWidth: "40vmin", fontSize: size, opacity, transform: "rotate(-90deg)" }}
      >
        {text || "♪"}
      </div>
    </div>
  );
}

function LyricsDisplay({ lyrics, currentTime, loading, plain }) {
  // Index of the last line whose timestamp has passed.
  const active = useMemo(() => {
    const ls = lyrics?.lines || [];
    let idx = -1;
    for (let i = 0; i < ls.length; i++) {
      if (ls[i].time <= currentTime) idx = i;
      else break;
    }
    return idx;
  }, [lyrics, currentTime]);

  // Pick a template per line: scrambled (non-sequential) and never the same
  // template twice in a row.
  const tplIndex = useMemo(() => {
    const N = TEMPLATES.length;
    let prev = -1;
    let idx = 0;
    for (let k = 0; k <= Math.max(active, 0); k++) {
      let c = hashInt(k) % N;
      if (c === prev) c = (c + 1) % N;
      prev = c;
      idx = c;
    }
    return idx;
  }, [active]);

  if (loading) return <div className={MSG}>Loading lyrics...</div>;
  if (!lyrics) return <div className={MSG}>No lyrics found for this track.</div>;

  // Preview / plain mode: normal scroll that moves with the song time.
  if (plain && lyrics.synced && lyrics.lines?.length) {
    return <NormalScroll lines={lyrics.lines} active={active} />;
  }
  if (plain || !lyrics.synced) {
    const plainText = lyrics.plain || (lyrics.lines || []).map((l) => l.text).join("\n");
    return (
      <div className="w-full max-w-[760px] h-full overflow-y-auto no-scrollbar text-center text-white/80 px-4 leading-[1.9] [mask-image:linear-gradient(180deg,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(180deg,transparent,#000_8%,#000_92%,transparent)]">
        {plainText.split("\n").map((l, i) => (
          <p key={i} className="my-[0.3rem] text-[1.15rem]">{l || " "}</p>
        ))}
      </div>
    );
  }

  const lines = lyrics.lines;
  const t = TEMPLATES[tplIndex];
  const current = lines[active];
  const prev1 = active > 0 ? lines[active - 1] : null;
  const next = active + 1 < lines.length ? lines[active + 1] : null;
  const text = current?.text || "♪";
  const fontClass = t.font === "serif" ? "vf-serif" : "font-sans";
  const showColumns = t.kind === "rotated";
  const size = SIZE[t.kind] || SIZE.chars;

  // Short labels for the constellation graphic, drawn from the current line.
  const labelTokens = /\s/.test(text) ? text.trim().split(/\s+/) : Array.from(text);
  const labels = labelTokens.slice(0, 6).map((w) => w.slice(0, 7).toUpperCase());

  // Typewriter progress within the active line's time slot.
  let progress = 0;
  if (active >= 0 && current) {
    const end = active + 1 < lines.length ? lines[active + 1].time : current.time + 4000;
    const dur = Math.max(end - current.time, 600);
    progress = Math.min(1, Math.max(0, ((currentTime - current.time) / dur) * 1.4));
  }

  const renderContent = () => {
    switch (t.kind) {
      case "type":     return <Typewriter text={text} progress={progress} />;
      case "emphasis": return <Emphasis text={text} />;
      case "mixed":    return <Mixed text={text} />;
      case "steps":    return <Steps text={text} dir={t.dir} />;
      default:         return <CharStagger text={text} />; // chars, big, rotated
    }
  };

  return (
    <div className="relative w-full h-full max-w-[1500px] mx-auto overflow-hidden">
      <Graphics beat={active} variant={t.graphic} labels={labels} />

      {/* 90° rotated previous/next columns — only for the "rotated" kind */}
      {showColumns && prev1 && (
        <RotatedColumn key={`p-${active}`} text={prev1.text} posStyle={{ left: "4%" }} fontClass={fontClass} size="clamp(1.3rem,3vw,2.3rem)" animated />
      )}
      {showColumns && next && (
        <RotatedColumn text={next.text} posStyle={{ right: "4%" }} fontClass={fontClass} size="clamp(1.1rem,2.6vw,1.9rem)" opacity={0.18} />
      )}

      <div className={`absolute inset-0 flex flex-col ${t.justify} ${t.items} ${t.text} py-[8vh] ${showColumns ? "px-[20%]" : "px-[6vw]"}`}>
        {active < 0 ? (
          <div className="text-white/40 text-[clamp(1.4rem,3.5vw,2.4rem)]">{"♪"}</div>
        ) : (
          <div className="max-w-full" style={{ transform: `rotate(${t.tilt}deg)` }}>
            <div className="vf-line">
              <div
                key={active}
                className={`${fontClass} ${t.upper ? "uppercase" : ""} font-bold leading-[1.18] [text-shadow:0_0_26px_rgba(255,255,255,0.3)]`}
                style={{ fontSize: size }}
              >
                {renderContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LyricsDisplay;
