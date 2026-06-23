import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleCallback } from "../services/spotifyAuth";

// Spotify redirects here with ?code=... after the user signs in.
function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const authError = params.get("error");

    if (authError) {
      setError(`Spotify sign-in was cancelled or failed (${authError}).`);
      return;
    }
    if (!code) {
      setError("No authorization code returned from Spotify.");
      return;
    }

    handleCallback(code)
      .then(() => navigate("/SearchPage", { replace: true }))
      .catch((e) => setError(e.message));
  }, [navigate]);

  return (
    <div className="text-white text-center mt-[20vh]">
      {error ? (
        <>
          <h2>Couldn't connect to Spotify</h2>
          <p>{error}</p>
          <button
            className="mt-4 bg-spotify text-white border-none rounded-2xl py-[5px] px-4 cursor-pointer"
            onClick={() => navigate("/connectSpotify")}
          >
            Try again
          </button>
        </>
      ) : (
        <h2>Connecting to Spotify…</h2>
      )}
    </div>
  );
}

export default Callback;
