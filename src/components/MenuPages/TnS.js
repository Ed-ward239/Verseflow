import React from 'react';
import Particle from '../Particle';
import Navbar from '../Navbar';
import Footer from '../Footer';

const h2 = "text-white text-xl font-semibold mt-7 mb-2";
const p = "text-white/80 leading-[1.6] text-[1.05rem]";

function TnS() {
    return (
        <>
            <Particle />
            <Navbar />
            <div className="flex flex-col text-white max-w-[760px] mx-auto px-6 pt-[12vh] pb-[14vh]">
                <h1 className="text-3xl font-bold text-center mb-2">Terms of Use</h1>

                <p className={`${p} mt-4`}>
                    Welcome to Verseflow. By using the app you agree to these terms. Verseflow
                    is an independent project made for music lovers — please use it for
                    personal, non-commercial enjoyment.
                </p>

                <h2 className={h2}>Spotify connection</h2>
                <p className={p}>
                    Playback and search are powered by your own Spotify account through
                    Spotify's official API. You agree to use those features in line with
                    Spotify's own Terms of Service, and you're responsible for keeping your
                    account secure.
                </p>

                <h2 className={h2}>Lyrics and content</h2>
                <p className={p}>
                    Lyrics are provided by third-party sources such as LRCLIB and remain the
                    property of their respective songwriters and rights holders. Verseflow
                    displays them for personal viewing only and claims no ownership over them.
                </p>

                <h2 className={h2}>No affiliation</h2>
                <p className={p}>
                    Verseflow is not affiliated with, endorsed by, or sponsored by Spotify,
                    LRCLIB, or any artist or label. All trademarks belong to their owners.
                </p>

                <h2 className={h2}>"As is" service</h2>
                <p className={p}>
                    The app is provided "as is," without warranties of any kind. Lyrics may
                    occasionally be missing, mistimed, or inaccurate, and the service may
                    change or pause at any time. To the extent permitted by law, we aren't
                    liable for any damages arising from your use of Verseflow.
                </p>

                <h2 className={h2}>Changes</h2>
                <p className={p}>
                    We may update these terms as the app evolves. Continued use after an
                    update means you accept the revised terms.
                </p>
            </div>
            <Footer />
        </>
    )
}

export default TnS;
