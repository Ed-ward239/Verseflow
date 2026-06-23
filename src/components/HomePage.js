import React from 'react';
import { Outlet } from "react-router-dom";
import MainPage from './MainBody';
import Navbar from './Navbar';
import Footer from './Footer';
import Particle from './Particle';

function Home() {
    return (
        <>
            <Particle />
            <Navbar />
            <Outlet/>
            <MainPage />
            <Footer />
        </>
    )
}

export default Home;