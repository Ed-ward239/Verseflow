// Thin wrapper over the Spotify Web API. All calls use the logged-in user's
// token (see spotifyAuth.js).
import { getAccessToken } from "./spotifyAuth";

const BASE = "https://api.spotify.com/v1";

async function api(path, params) {
  const token = await getAccessToken();
  const url = new URL(BASE + path);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`Spotify API ${res.status}: ${await res.text()}`);
  return res.json();
}

// Search and return the single best-matching track, or null.
export async function findTrack(title, artist) {
  // Field filters make the match far more reliable than a free-text query.
  const q = `track:${title} artist:${artist}`;
  const data = await api("/search", { q, type: "track", limit: 1, market: "US" });
  const track = data.tracks?.items?.[0];
  if (!track) return null;
  return normalizeTrack(track);
}

// General-purpose search for the search box (multiple results).
export async function searchTracks(query, limit = 20) {
  if (!query.trim()) return [];
  const data = await api("/search", { q: query, type: "track", limit, market: "US" });
  return (data.tracks?.items || []).map(normalizeTrack);
}

// Start playback of the given track URIs on a specific device (our Web Playback
// SDK player). Requires the user-modify-playback-state scope + Spotify Premium.
export async function playOnDevice(uris, deviceId) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ uris }),
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error("Spotify Premium is required for in-app playback.");
    if (res.status === 404) throw new Error("Player not ready yet — try again in a moment.");
    throw new Error(`Spotify play ${res.status}: ${await res.text()}`);
  }
}

function normalizeTrack(t) {
  return {
    id: t.id,
    uri: t.uri,
    title: t.name,
    artist: t.artists.map((a) => a.name).join(", "),
    artistPrimary: t.artists[0]?.name,
    album: t.album?.name,
    art: t.album?.images?.[0]?.url || null,
    durationMs: t.duration_ms,
    url: t.external_urls?.spotify,
  };
}
