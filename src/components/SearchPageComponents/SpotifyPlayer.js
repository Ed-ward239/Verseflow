import React, { useEffect, useRef } from "react";

// Loads Spotify's Embed iFrame API once and resolves the IFrameAPI object.
// Unlike a plain embed <iframe>, this controller emits `playback_update`
// events carrying the current position (ms) — which we use to sync lyrics.
let apiPromise;
function loadIframeApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => resolve(IFrameAPI);
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return apiPromise;
}

// Props:
//   track      — normalized track ({ uri, ... })
//   onProgress — called with { position, duration, isPaused } on each update
function SpotifyPlayer({ track, onProgress }) {
  const hostRef = useRef(null);
  const controllerRef = useRef(null);
  // Keep the latest onProgress without re-creating the controller.
  const progressRef = useRef(onProgress);
  progressRef.current = onProgress;

  useEffect(() => {
    let cancelled = false;

    loadIframeApi().then((IFrameAPI) => {
      if (cancelled || !hostRef.current) return;

      // Controller already exists → just load the new track.
      if (controllerRef.current) {
        controllerRef.current.loadUri(track.uri);
        controllerRef.current.play();
        return;
      }

      IFrameAPI.createController(
        hostRef.current,
        { uri: track.uri, width: "100%", height: 152 },
        (controller) => {
          controllerRef.current = controller;
          controller.addListener("playback_update", (e) => {
            const d = e?.data || {};
            progressRef.current?.({
              position: d.position ?? 0,
              duration: d.duration ?? 0,
              isPaused: d.isPaused ?? true,
            });
          });
        }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [track.uri]);

  return (
    <div className="w-full max-w-[520px]">
      {/* createController replaces this node with the Spotify iframe */}
      <div ref={hostRef} />
    </div>
  );
}

export default SpotifyPlayer;
