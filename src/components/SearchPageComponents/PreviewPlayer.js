import React, { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";

const fmt = (s) => {
  if (!s || s < 0) return "0:00";
  const sec = Math.floor(s);
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
};

// Plays a free 30-second iTunes preview via a native <audio> element.
// Props:
//   track      — preview-track ({ previewUrl, title, artist, art })
//   onProgress — called with { position, duration, isPaused } (ms) to drive lyrics
function PreviewPlayer({ track, onProgress }) {
  const audioRef = useRef(null);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [pos, setPos] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const emit = (a) =>
    progressRef.current?.({ position: a.currentTime * 1000, duration: (a.duration || 30) * 1000, isPaused: a.paused });

  // Load + autoplay whenever the preview URL changes.
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = track.previewUrl;
    a.volume = volume;
    a.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.previewUrl]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  const onSeek = (e) => {
    const v = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = v;
    setPos(v);
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="w-full max-w-[520px] bg-white/[0.06] rounded-2xl p-4 text-white backdrop-blur-sm">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => { setPos(e.target.currentTime); emit(e.target); }}
        onLoadedMetadata={(e) => setDuration(e.target.duration)}
        onPlay={(e) => { setPlaying(true); emit(e.target); }}
        onPause={(e) => { setPlaying(false); emit(e.target); }}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex items-center gap-3">
        {track.art && <img src={track.art} alt="" className="w-12 h-12 rounded object-cover" />}
        <div className="min-w-0">
          <div className="truncate font-semibold text-sm">{track.title}</div>
          <div className="truncate text-xs text-white/60">{track.artist} · 30s preview</div>
        </div>
        <button
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="ml-auto w-10 h-10 shrink-0 rounded-full bg-white text-black flex items-center justify-center transition-transform hover:scale-105"
        >
          {playing ? <FaPause /> : <FaPlay className="ml-0.5" />}
        </button>
      </div>

      <div className="flex items-center gap-2 mt-3 text-[11px] text-white/60">
        <span className="tabular-nums">{fmt(pos)}</span>
        <input
          type="range" min={0} max={duration || 0} value={Math.min(pos, duration || 0)}
          onChange={onSeek}
          className="flex-1 h-1 accent-white cursor-pointer"
        />
        <span className="tabular-nums">{fmt(duration)}</span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <FaVolumeUp className="text-white/60 shrink-0" />
        <input
          type="range" min={0} max={1} step={0.01} value={volume}
          onChange={onVolume}
          aria-label="Volume"
          className="flex-1 h-1 accent-white cursor-pointer"
        />
      </div>
    </div>
  );
}

export default PreviewPlayer;
