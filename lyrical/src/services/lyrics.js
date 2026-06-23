// Synced lyrics from LRCLIB (https://lrclib.net) — free, no API key, CORS-friendly.
// Returns time-stamped lines we can highlight in sync with playback.

const BASE = "https://lrclib.net/api";

// Spotify track titles carry qualifiers LRCLIB won't have ("(feat. X)",
// "(Explicit Ver.)", "- Remastered 2011"). Strip them for a better match.
function cleanTitle(title) {
  return title
    .replace(
      /\s*[([][^)\]]*(feat|ft|explicit|clean|remaster|version|ver\.|edit|deluxe|bonus|mono|stereo)[^)\]]*[)\]]/gi,
      ""
    )
    .replace(/\s*-\s*(remaster|.*version|.*mix|live|acoustic).*$/gi, "")
    .trim();
}

// Parse an LRC string into [{ time(ms), text }], sorted by time.
export function parseLRC(lrc) {
  const stamp = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  const lines = [];

  for (const raw of lrc.split("\n")) {
    const text = raw.replace(stamp, "").trim();
    let m;
    stamp.lastIndex = 0;
    while ((m = stamp.exec(raw)) !== null) {
      const min = Number(m[1]);
      const sec = Number(m[2]);
      const frac = m[3] ? Number(`0.${m[3]}`) : 0;
      lines.push({ time: Math.round((min * 60 + sec + frac) * 1000), text });
    }
  }
  return lines.sort((a, b) => a.time - b.time);
}

function toResult(entry) {
  if (!entry) return null;
  if (entry.syncedLyrics) {
    return { synced: true, lines: parseLRC(entry.syncedLyrics), plain: entry.plainLyrics };
  }
  if (entry.plainLyrics) {
    return { synced: false, lines: [], plain: entry.plainLyrics };
  }
  return null;
}

// Fetch lyrics for a normalized Spotify track. Returns
// { synced, lines, plain } or null if nothing is found.
export async function getLyrics(track) {
  const title = cleanTitle(track.title);
  const artist = track.artistPrimary || track.artist;
  const duration = Math.round(track.durationMs / 1000);

  // 1) Exact signature match (best quality).
  const getParams = new URLSearchParams({
    track_name: title,
    artist_name: artist,
    album_name: track.album || "",
    duration: String(duration),
  });
  try {
    const res = await fetch(`${BASE}/get?${getParams}`);
    if (res.ok) {
      const result = toResult(await res.json());
      if (result) return result;
    }
  } catch {
    /* fall through to search */
  }

  // 2) Fuzzy search; prefer a synced result close to the right duration.
  const searchParams = new URLSearchParams({ track_name: title, artist_name: artist });
  try {
    const res = await fetch(`${BASE}/search?${searchParams}`);
    if (!res.ok) return null;
    const hits = await res.json();
    if (!Array.isArray(hits) || hits.length === 0) return null;

    const synced = hits.filter((h) => h.syncedLyrics);
    const pool = synced.length ? synced : hits;
    const best =
      pool.find((h) => Math.abs((h.duration || 0) - duration) <= 3) || pool[0];
    return toResult(best);
  } catch {
    return null;
  }
}
