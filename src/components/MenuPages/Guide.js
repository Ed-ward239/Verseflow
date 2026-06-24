import React from 'react';
import Particle from '../Particle';
import Navbar from '../Navbar';
import Footer from '../Footer';

const h2 = "text-white text-xl font-semibold mt-7 mb-2";
const p = "text-white/80 leading-[1.6] text-[1.05rem]";

function Guide() {
    return (
        <>
            <Particle />
            <Navbar />
            <div className="flex flex-col text-white max-w-[760px] mx-auto px-6 pt-[12vh] pb-[14vh]">
                <h1 className="text-3xl font-bold text-center mb-2">Guide</h1>
                <p className={`${p} text-center`}>
                    Verseflow turns any song into a living lyric stage — words scroll and
                    glow in time with the music. Here's how to get going.
                </p>

                <h2 className={h2}>1. Connect Spotify</h2>
                <p className={p}>
                    Click <strong>Connect Spotify</strong> and sign in with your own Spotify
                    account. We use Spotify's official sign-in, so we never see your password.
                    You'll only need to do this once per device.
                </p>

                <h2 className={h2}>2. Pick a song</h2>
                <p className={p}>
                    Type a song, artist, or album into the search bar and hit Enter — or, if
                    you can't decide, tap <strong>Surprise ME!</strong> to pull a random hit
                    from the charts. The track loads into the player at the bottom of the screen.
                </p>

                <h2 className={h2}>3. Press play and watch the lyrics</h2>
                <p className={p}>
                    Start playback in the Spotify player and the lyrics take over the stage,
                    centering and highlighting each line exactly as it's sung. Lines you've
                    passed fade above; lines coming up wait below.
                </p>

                <h2 className={h2}>Tips</h2>
                <p className={p}>
                    • Not every track has time-synced lyrics — when that happens, we show the
                    plain lyrics instead.<br />
                    • Open the app at <code>http://localhost:3000</code> so the Spotify sign-in
                    redirect works.<br />
                    • A Spotify Premium account gives the smoothest in-app playback.
                </p>
            </div>
            <Footer />
        </>
    )
}

export default Guide;
