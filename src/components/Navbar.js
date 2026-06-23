import React, { useState } from "react";
import { FaSpotify } from "react-icons/fa";
import Hamburger from "hamburger-react";
import { useNavigate } from 'react-router-dom';
import { login, logout, isConfigured, isLoggedIn } from '../services/spotifyAuth';

export default function Navbar() {
  const navigate = useNavigate();
  // Menu bar onClick Functions
  function handleClick(event) {
    event.preventDefault();
    navigate('/');
  }
  function clickAbout(event) {
    event.preventDefault();
    navigate('/About');
  }
  function clickGuide(event) {
    event.preventDefault();
    navigate('/Guide');
  }
  function clickPrivacy(event) {
    event.preventDefault();
    navigate('/Privacy');
  }
  function clickTnS(event) {
    event.preventDefault();
    navigate('/TnS');
  }
  // Reflect Spotify connection state so the button never silently disappears.
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  function clickCntSpotify(event) {
    event.preventDefault();
    if (loggedIn) {
      logout();
      setLoggedIn(false);
      navigate('/'); // reset any playing track / stage view
      return;
    }
    // If the app is configured with a Client ID, go straight to Spotify's
    // sign-in page; otherwise show the Connect page with setup instructions.
    if (isConfigured()) {
      login().catch((err) => alert(err.message));
    } else {
      navigate('/connectSpotify');
    }
  }
  // Menu icon toggle ON/OFF
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [isOpen, setOpen] = useState(false);

  const linkClass =
    "no-underline text-white/50 hover:text-white text-base py-[5px] px-[10px] text-center";

  return (
    <nav className="flex justify-between items-center h-[8vh] bg-transparent">
      <div
        className="font-bold text-white cursor-pointer text-[2rem] p-12"
        onClick={handleClick}
      >
        Lyrical.ly
      </div>
      <div className="flex flex-row items-center mr-[30px]">
        <div
          className={
            "flex absolute right-[3%] w-[800px] p-[10px] rounded-[5px] " +
            "shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all duration-300 " +
            "max-[400px]:flex-col max-[400px]:left-1/2 max-[400px]:w-1/2 " +
            (isMenuOpen
              ? "opacity-100 visible translate-x-0"
              : "opacity-0 invisible translate-x-[90px]")
          }
        >
          <a href="#" onClick={clickAbout} className={linkClass}>Who We Are</a>
          <a href="#" onClick={clickGuide} className={linkClass}>Guide</a>
          <a href="#" onClick={clickPrivacy} className={linkClass}>Privacy Policy</a>
          <a href="#" onClick={clickTnS} className={linkClass}>Terms of Use</a>
          <button
            onClick={clickCntSpotify}
            className="bg-spotify text-white border-none rounded-2xl py-[5px] px-[10px] text-base cursor-pointer flex justify-center items-center mr-8 transition-transform hover:scale-110"
          >
            {loggedIn ? "Disconnect" : "Connect"}
            <FaSpotify className="ml-2" />
          </button>
        </div>

        <a href="#" onClick={toggleMenu}>
          <Hamburger direction="left" color="white" rounded toggled={isOpen} toggle={setOpen} />
        </a>
      </div>
    </nav>
  );
}