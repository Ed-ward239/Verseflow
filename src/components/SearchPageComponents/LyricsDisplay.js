import React, { useMemo } from "react";

// Height of one lyric line in px — must match the line height class below.
export const LINE_H = 56;

const MSG = "w-full max-w-[760px] h-[46vh] flex items-center justify-center text-white/60";
const MASK =
  "[mask-image:linear-gradient(180deg,transparent,#000_22%,#000_78%,transparent)] " +
  "[-webkit-mask-image:linear-gradient(180deg,transparent,#000_22%,#000_78%,transparent)]";
const LINE_BASE =
  "h-[56px] m-0 flex items-center justify-center text-[1.6rem] leading-[1.2] px-4 " +
  "transition-[opacity,transform,color] duration-[400ms]";
const LINE_ACTIVE =
  " text-white font-bold opacity-100 scale-110 [text-shadow:0_0_18px_rgba(255,255,255,0.45)]";
const LINE_DIM = " text-white/40 opacity-40";

// Renders synced lyrics, centering and highlighting the line that matches the
// current playback time. Falls back to plain text or a status message.
function LyricsDisplay({ lyrics, currentTime, loading }) {
  const lines = lyrics?.lines || [];

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

  if (loading) return <div className={MSG}>Loading lyrics...</div>;
  if (!lyrics) return <div className={MSG}>No lyrics found for this track.</div>;

  if (!lyrics.synced) {
    return (
      <div className="w-full max-w-[760px] h-[46vh] overflow-y-auto text-center text-white/80">
        <div>
          {(lyrics.plain || "").split("\n").map((l, i) => (
            <p key={i} className="my-[0.35rem] text-[1.1rem]">{l || " "}</p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-[760px] h-[46vh] overflow-hidden relative text-center ${MASK}`}>
      <div
        className="absolute top-1/2 left-0 right-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
        style={{ transform: `translateY(${-(active * LINE_H + LINE_H / 2)}px)` }}
      >
        {lines.map((line, i) => (
          <p key={i} className={LINE_BASE + (i === active ? LINE_ACTIVE : LINE_DIM)}>
            {line.text || "♪"}
          </p>
        ))}
      </div>
    </div>
  );
}

export default LyricsDisplay;
