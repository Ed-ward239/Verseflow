// Spotify Authorization Code flow with PKCE (no client secret, browser-safe).
// Docs: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow

const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/callback";

// Scopes: basic profile now; playback scopes included so we can add the
// Web Playback SDK later without forcing the user to re-authorize.
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-modify-playback-state",
  "user-read-playback-state",
].join(" ");

const TOKEN_KEY = "spotify_token";
const VERIFIER_KEY = "spotify_pkce_verifier";

export function isConfigured() {
  return Boolean(CLIENT_ID);
}

export function isLoggedIn() {
  const t = readToken();
  return Boolean(t && t.access_token);
}

// --- PKCE helpers -----------------------------------------------------------

function randomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}

async function sha256(plain) {
  const data = new TextEncoder().encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// --- Login flow -------------------------------------------------------------

// Step 1: redirect the browser to Spotify's sign-in / consent page.
export async function login() {
  if (!CLIENT_ID) {
    throw new Error(
      "Missing REACT_APP_SPOTIFY_CLIENT_ID. Add it to .env and restart `npm start`."
    );
  }
  const verifier = randomString(64);
  const challenge = base64url(await sha256(verifier));
  localStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

// Step 2: on /callback, exchange the `code` for an access token.
export async function handleCallback(code) {
  const verifier = localStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error("Missing PKCE verifier — please sign in again.");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: verifier,
  });

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`);

  const token = await res.json();
  saveToken(token);
  localStorage.removeItem(VERIFIER_KEY);
  return token;
}

// --- Token storage & refresh ------------------------------------------------

function saveToken(token) {
  // Stamp an absolute expiry so we know when to refresh.
  token.expires_at = Date.now() + (token.expires_in - 60) * 1000;
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

function readToken() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY));
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

async function refresh(token) {
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: token.refresh_token,
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    logout();
    throw new Error("Session expired — please connect Spotify again.");
  }
  const next = await res.json();
  // Spotify may not return a new refresh_token; keep the old one if so.
  if (!next.refresh_token) next.refresh_token = token.refresh_token;
  saveToken(next);
  return next;
}

// Returns a valid access token, refreshing if needed. Throws if not logged in.
export async function getAccessToken() {
  let token = readToken();
  if (!token) throw new Error("Not connected to Spotify.");
  if (Date.now() >= token.expires_at && token.refresh_token) {
    token = await refresh(token);
  }
  return token.access_token;
}
