import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaSpotify } from "react-icons/fa";
import { isLoggedIn, isConfigured, login } from "../../services/spotifyAuth";
import { findTrack, searchTracks } from "../../services/spotifyApi";
import { getLyrics } from "../../services/lyrics";
import { findPreview } from "../../services/itunes";
import { randomBillboardSong } from "../../data/billboardHot100";
import SpotifyPlayer from "./SpotifyPlayer";
import PreviewPlayer from "./PreviewPlayer";
import LyricsDisplay from "./LyricsDisplay";

export default function SearchMenu() {
  const [searchQuery, setSearchQuery] = useState("");
  const [track, setTrack] = useState(null);
  const [lyrics, setLyrics] = useState(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPreview, setIsPreview] = useState(false);

  const loggedIn = isLoggedIn();
  const playing = Boolean(track);

  // --- Playback clock: interpolate between sparse player updates -----------
  const clock = useRef({ position: 0, at: 0, paused: true });

  const handleProgress = useCallback(({ position, isPaused }) => {
    clock.current = { position, at: performance.now(), paused: isPaused };
  }, []);

  useEffect(() => {
    if (!playing) return;
    let raf;
    const tick = () => {
      const { position, at, paused } = clock.current;
      const elapsed = paused ? 0 : performance.now() - at;
      setCurrentTime(position + elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // --- Lyrics: fetch whenever the track changes ----------------------------
  useEffect(() => {
    if (!track) return;
    let cancelled = false;
    setLyrics(null);
    setLyricsLoading(true);
    setCurrentTime(0);
    clock.current = { position: 0, at: performance.now(), paused: true };

    getLyrics(track)
      .then((res) => !cancelled && setLyrics(res))
      .catch(() => !cancelled && setLyrics(null))
      .finally(() => !cancelled && setLyricsLoading(false));

    return () => {
      cancelled = true;
    };
  }, [track]);

  // --- Actions -------------------------------------------------------------
  const requireLogin = () => {
    if (loggedIn) return true;
    if (isConfigured()) login().catch((err) => setStatus(err.message));
    else setStatus("Spotify isn't set up yet — add your Client ID (see the Connect page).");
    return false;
  };

  const handleSurprise = async () => {
    setLoading(true);
    setStatus("");
    try {
      const pick = randomBillboardSong();
      setStatus(`Finding “${pick.title}”…`);

      if (loggedIn) {
        const found = await findTrack(pick.title, pick.artist);
        if (!found) {
          setStatus(`Couldn't find “${pick.title}” on Spotify — try again.`);
          return;
        }
        setIsPreview(false);
        setTrack(found);
      } else {
        // No Spotify connected — play a free 30s preview from iTunes instead.
        const preview = await findPreview(pick.title, pick.artist);
        if (!preview) {
          setStatus(`Couldn't find a preview for “${pick.title}” — try again.`);
          return;
        }
        setIsPreview(true);
        setTrack(preview);
      }
      setStatus("");
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !requireLogin()) return;
    setLoading(true);
    setStatus("");
    try {
      const results = await searchTracks(searchQuery, 1);
      if (!results.length) {
        setStatus(`No results for “${searchQuery}”.`);
        return;
      }
      setIsPreview(false);
      setTrack(results[0]);
    } catch (err) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => {
    if (isConfigured()) login().catch((err) => setStatus(err.message));
    else setStatus("Spotify isn't set up yet — add your Client ID (see the Connect page).");
  };

  // --- Render --------------------------------------------------------------
  const btnBase =
    "text-white bg-[rgba(128,128,128,0.315)] px-5 h-[2.3rem] rounded-2xl border-none mx-8 my-4 cursor-pointer disabled:opacity-50 disabled:cursor-default";

  const controls = (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto">
      <input
        className="bg-[rgba(128,128,128,0.315)] w-full h-[2.3rem] rounded-2xl border-none text-white pl-[14px] placeholder:text-white/[.466]"
        type="text"
        placeholder="Search: songs, artists, or albums"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <div className="flex">
        <button className={btnBase} onClick={handleSurprise} disabled={loading}>
          {loading ? "Loading…" : "Surprise Me!"}
        </button>
        {!loggedIn && (
          <button
            className={`${btnBase} flex items-center justify-center !bg-spotify`}
            onClick={handleConnect}
          >
            Connect<FaSpotify className="mx-2" /> Spotify
          </button>
        )}
      </div>
      {status && <p className="text-white mt-2">{status}</p>}
    </div>
  );

  if (!playing) {
    return (
      <div className="h-full flex flex-col justify-center items-center px-4">
        {controls}
      </div>
    );
  }

  return (
    <div className="relative z-[1] flex flex-col h-full pt-[2vh] px-4 pb-[9vh] box-border">
      <div className="flex-none">{controls}</div>

      {isPreview && (
        <div className="flex-none mx-auto mt-2 w-full max-w-[640px]">
          <div className="flex items-center justify-center gap-2 text-center text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-2 text-sm">
            <span>Please connect to your Spotify Premium to get the full animated lyrics experience.</span>
            <button onClick={handleConnect} className="underline whitespace-nowrap hover:text-white">Connect</button>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center min-h-0">
        <LyricsDisplay lyrics={lyrics} currentTime={currentTime} loading={lyricsLoading} plain={isPreview} />
      </div>
      <div className="flex-none flex flex-col items-center gap-2">
        {isPreview ? (
          <PreviewPlayer track={track} onProgress={handleProgress} />
        ) : (
          <SpotifyPlayer track={track} onProgress={handleProgress} />
        )}
      </div>
    </div>
  );
}
