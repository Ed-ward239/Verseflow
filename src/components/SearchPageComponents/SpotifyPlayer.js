import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa";
import { getAccessToken } from "../../services/spotifyAuth";
import { playOnDevice } from "../../services/spotifyApi";

// Load the Web Playback SDK script once and resolve the global Spotify object.
let sdkPromise;
function loadSDK() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve) => {
    if (window.Spotify) return resolve(window.Spotify);
    window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify);
    const s = document.createElement("script");
    s.src = "https://sdk.scdn.co/spotify-player.js";
    s.async = true;
    document.body.appendChild(s);
  });
  return sdkPromise;
}

const fmt = (ms) => {
  if (!ms || ms < 0) return "0:00";
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

// Custom player built on the Spotify Web Playback SDK (requires Premium).
// Props:
//   track      — normalized track ({ uri, title, artist, art, ... })
//   onProgress — called with { position, duration, isPaused } on each update
function SpotifyPlayer({ track, onProgress }) {
  const playerRef = useRef(null);
  const deviceIdRef = useRef(null);
  const pendingUriRef = useRef(null);
  const clockRef = useRef({ position: 0, at: 0, paused: true });
  const durationRef = useRef(0);
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [displayPos, setDisplayPos] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [error, setError] = useState("");

  const startPlayback = useCallback(async (uri) => {
    try {
      await playOnDevice([uri], deviceIdRef.current);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, []);

  // Create + connect the player once.
  useEffect(() => {
    let player;
    let cancelled = false;

    loadSDK().then((Spotify) => {
      if (cancelled) return;
      player = new Spotify.Player({
        name: "Verseflow",
        getOAuthToken: (cb) => getAccessToken().then(cb).catch(() => {}),
        volume: 0.5,
      });
      playerRef.current = player;

      player.addListener("ready", ({ device_id }) => {
        deviceIdRef.current = device_id;
        setReady(true);
        if (pendingUriRef.current) {
          startPlayback(pendingUriRef.current);
          pendingUriRef.current = null;
        }
      });
      player.addListener("not_ready", () => setReady(false));

      player.addListener("player_state_changed", (state) => {
        if (!state) return;
        const { position, duration: dur, paused: isPaused } = state;
        clockRef.current = { position, at: performance.now(), paused: isPaused };
        durationRef.current = dur;
        setPaused(isPaused);
        setDuration(dur);
        progressRef.current?.({ position, duration: dur, isPaused });
      });

      ["initialization_error", "authentication_error", "account_error", "playback_error"].forEach((ev) =>
        player.addListener(ev, ({ message }) =>
          setError(ev === "account_error" ? "Spotify Premium is required for in-app playback." : message)
        )
      );

      player.connect();
    });

    return () => {
      cancelled = true;
      if (player) player.disconnect();
    };
  }, [startPlayback]);

  // Play the selected track whenever it changes (queue it if not ready yet).
  useEffect(() => {
    if (!track?.uri) return;
    if (deviceIdRef.current) startPlayback(track.uri);
    else pendingUriRef.current = track.uri;
  }, [track?.uri, startPlayback]);

  // Interpolate position between sparse state updates for a smooth progress bar.
  useEffect(() => {
    let raf;
    const tick = () => {
      const { position, at, paused: p } = clockRef.current;
      const elapsed = p ? 0 : performance.now() - at;
      const pos = Math.min(position + elapsed, durationRef.current || Infinity);
      setDisplayPos(pos);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const togglePlay = () => playerRef.current?.togglePlay();

  const onSeek = (e) => {
    const ms = Number(e.target.value);
    playerRef.current?.seek(ms);
    clockRef.current = { ...clockRef.current, position: ms, at: performance.now() };
    setDisplayPos(ms);
  };

  const onVolume = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
  };

  return (
    <div className="w-full max-w-[520px] bg-white/[0.06] rounded-2xl p-4 text-white backdrop-blur-sm">
      {error ? (
        <div className="text-sm text-red-300 text-center py-2">{error}</div>
      ) : (
        <>
          {/* track info + play/pause */}
          <div className="flex items-center gap-3">
            {track.art && <img src={track.art} alt="" className="w-12 h-12 rounded object-cover" />}
            <div className="min-w-0">
              <div className="truncate font-semibold text-sm">{track.title}</div>
              <div className="truncate text-xs text-white/60">{track.artist}</div>
            </div>
            <button
              onClick={togglePlay}
              disabled={!ready}
              aria-label={paused ? "Play" : "Pause"}
              className="ml-auto w-10 h-10 shrink-0 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-40 transition-transform hover:scale-105"
            >
              {paused ? <FaPlay className="ml-0.5" /> : <FaPause />}
            </button>
          </div>

          {/* seek bar */}
          <div className="flex items-center gap-2 mt-3 text-[11px] text-white/60">
            <span className="tabular-nums">{fmt(displayPos)}</span>
            <input
              type="range" min={0} max={duration || 0} value={Math.min(displayPos, duration || 0)}
              onChange={onSeek} disabled={!ready}
              className="flex-1 h-1 accent-white cursor-pointer"
            />
            <span className="tabular-nums">{fmt(duration)}</span>
          </div>

          {/* volume slider (bottom) */}
          <div className="flex items-center gap-2 mt-2">
            <FaVolumeUp className="text-white/60 shrink-0" />
            <input
              type="range" min={0} max={1} step={0.01} value={volume}
              onChange={onVolume}
              aria-label="Volume"
              className="flex-1 h-1 accent-white cursor-pointer"
            />
          </div>

          {!ready && <div className="text-xs text-white/50 mt-2 text-center">Connecting to Spotify…</div>}
        </>
      )}
    </div>
  );
}

export default SpotifyPlayer;
