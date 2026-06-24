import React from 'react';
import Particle from '../Particle';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { FaSpotify } from 'react-icons/fa';
import { login, isConfigured, isLoggedIn } from '../../services/spotifyAuth';

function CntSpotify() {
    const configured = isConfigured();
    const loggedIn = isLoggedIn();

    const handleConnect = () => {
        login().catch((err) => alert(err.message));
    };

    return (
        <>
            <Particle />
            <Navbar />
            <div className="text-white text-center px-4 py-[8vh]">
                {loggedIn ? (
                    <>
                        <h1>You're connected to Spotify ✅</h1>
                        <p>Head to the search page to find a song or hit “Surprise Me”.</p>
                    </>
                ) : configured ? (
                    <>
                        <h1>Connect your Spotify</h1>
                        <p>Link your account to search songs and play them with synced lyrics.</p>
                        <button
                            className="bg-spotify text-white border-none rounded-2xl py-[5px] px-[10px] text-base cursor-pointer inline-flex justify-center items-center transition-transform hover:scale-110"
                            onClick={handleConnect}
                        >
                            Connect <FaSpotify className="ml-2" />
                        </button>
                    </>
                ) : (
                    <>
                        <h1>Spotify isn't set up yet</h1>
                        <p>To enable sign-in, add your Spotify <strong>Client ID</strong> to <code>.env</code>:</p>
                        <pre className="inline-block text-left bg-[#111] p-4 rounded-lg">
{`REACT_APP_SPOTIFY_CLIENT_ID=your_id_here`}
                        </pre>
                        <p>
                            Get one free at the{' '}
                            <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">
                                Spotify Developer Dashboard
                            </a>
                            , add redirect URI <code>http://127.0.0.1:3000/callback</code>, then restart <code>npm start</code>.
                        </p>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default CntSpotify;
