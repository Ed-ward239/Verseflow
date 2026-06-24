// Free 30-second previews via Apple's iTunes Search API — no key, no login.
// Used as the "Surprise Me" fallback when the user hasn't connected Spotify.
// Docs: https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/

const BASE = "https://itunes.apple.com/search";

// Returns a preview-track ({ previewUrl, ... }) or null if none is found.
export async function findPreview(title, artist) {
  const params = new URLSearchParams({
    term: `${title} ${artist}`,
    entity: "song",
    limit: "5",
  });

  let res;
  try {
    res = await fetch(`${BASE}?${params}`);
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const data = await res.json();
  const hit = (data.results || []).find((r) => r.previewUrl);
  if (!hit) return null;

  return {
    source: "preview",
    title: hit.trackName,
    artist: hit.artistName,
    artistPrimary: hit.artistName,
    album: hit.collectionName,
    art: (hit.artworkUrl100 || "").replace("100x100", "300x300"),
    previewUrl: hit.previewUrl,
    // Full-song length (for the lyrics lookup); the preview audio itself is ~30s.
    durationMs: hit.trackTimeMillis || 30000,
  };
}
