import React from 'react';
import Particle from '../Particle';
import Navbar from '../Navbar';
import Footer from '../Footer';

const h2 = "text-white text-xl font-semibold mt-7 mb-2";
const p = "text-white/80 leading-[1.6] text-[1.05rem]";

function Privacy() {
    return (
        <>
            <Particle />
            <Navbar />
            <div className="flex flex-col text-white max-w-[760px] mx-auto px-6 pt-[12vh] pb-[14vh]">
                <h1 className="text-3xl font-bold text-center mb-2">Privacy Policy</h1>

                <p className={`${p} mt-4`}>
                    Verseflow is built to do as little with your data as possible. The app
                    runs entirely in your browser — there is no Verseflow server collecting,
                    storing, or selling your information.
                </p>

                <h2 className={h2}>What we store</h2>
                <p className={p}>
                    When you connect Spotify, the access token Spotify issues is kept in your
                    browser's <code>localStorage</code> on your own device so you don't have
                    to sign in every time. It never leaves your browser, and you can clear it
                    at any moment by disconnecting Spotify or clearing your browser data.
                </p>

                <h2 className={h2}>What we don't do</h2>
                <p className={p}>
                    We don't run analytics, advertising, or third-party trackers. We don't
                    collect your name, email, listening history, or playlists, and we never
                    see your Spotify password — sign-in happens on Spotify's own pages.
                </p>

                <h2 className={h2}>Third-party services</h2>
                <p className={p}>
                    To work, Verseflow talks directly from your browser to a few services:
                    Spotify (for search and playback) and LRCLIB (for time-synced lyrics).
                    Your use of those features is also covered by their respective privacy
                    policies.
                </p>

                <h2 className={h2}>Contact</h2>
                <p className={p}>
                    Questions about privacy? Reach us through the contact links in the footer
                    and we'll be happy to help.
                </p>
            </div>
            <Footer />
        </>
    )
}

export default Privacy;
