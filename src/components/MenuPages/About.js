import React from 'react';
import Particle from '../Particle';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Edward from '../Images/Edward.jpg';
import Devin from '../Images/Devin.png';

const imgClass = "max-h-[20vh] rounded-[20px]";
const cardClass = "flex flex-col justify-center items-center m-[60px]";
const roleClass = "m-[2%] text-center text-white";

function About() {
    return (
        <div>
            <Particle/>
            <Navbar/>
            <h1 className='mt-0 flex justify-center items-center text-white text-3xl'>"Who We Are"</h1>
            <div className='flex flex-col items-center justify-center'>

            <div className='flex flex-row items-center justify-center w-full'>
                <div className={cardClass}>
                    <img src={Devin} className={imgClass} alt="Devin"/>
                    <h2 className="text-white">Devin Lin</h2>
                    <p className={roleClass}>Front-end</p>
                </div>
                <div className={cardClass}>
                    <img src={Edward} className={imgClass} alt="Edward"/>
                    <h2 className="text-white">Edward Lee</h2>
                    <p className={roleClass}>Back-end </p>
                </div>
            </div>


            </div>
            <div className='flex flex-col justify-center items-center text-center text-white max-w-[700px] mx-auto my-2 px-6'>
            <h3>We are fresh college graduates with a passion for music and animation.</h3>
            <p className="my-[0.85rem] leading-[1.55] text-[1.05rem]">
                Verseflow began with a simple question: what if your favorite songs
                could light up the screen the way they light up your ears? Inspired by
                Lyric Speaker boxes, we set out to turn lyrics into living, breathing
                visuals that move in time with the music.
            </p>
            <p className="my-[0.85rem] leading-[1.55] text-[1.05rem]">
                Fun fact: most of this was built on late nights, far too much coffee,
                and an endless loop of the songs we were "testing." Devin brings the
                front-end magic to life, while Edward wires up everything behind the
                scenes.
            </p>
            </div>
            <Footer/>
        </div>
    )
}

export default About;