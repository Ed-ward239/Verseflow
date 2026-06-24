import React from "react";

import SearchMenu from './SearchMenu';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Particle from '../Particle';

function SearchPage() {
 

  return (
    <>
        <Particle />
        <Footer />
        <div className="flex flex-col h-[100dvh] overflow-hidden">
            <Navbar />
            <div className="flex-1 min-h-0">
                <SearchMenu />
            </div>
        </div>
    </>
)
}
export default SearchPage;

