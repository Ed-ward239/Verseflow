import React from 'react';
import Typewriter from 'typewriter-effect';
import {HiArrowRight} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function MainBody() {

// this is for javascript, not suitable to react

  // var typewriter = new Typewriter(MainBody,{
  //   delay: 1,
  // });
  const navigate = useNavigate();

  function SearchClick(event) {
    event.preventDefault();
    navigate('/SearchPage');
  }
  return (
    <div className="mt-[25%] flex h-[27vh] px-[18%] max-[400px]:flex-col max-[400px]:w-[64%] max-[400px]:h-[64vh]">

      <div className="text-[4rem] text-left mb-[11%] mr-[7%] text-white w-[55%] max-[400px]:text-[2rem] max-[400px]:w-full">

      <Typewriter

        options={{
          delay: 75,
          loop: true,
        }}

        onInit={(typewriter) => {
          typewriter
            .typeString("Feel the rhythm")
            .pauseFor(300)
            .typeString('\n<span style="color: #52B2BF;">Embrace</span> the beat')
            .pauseFor(3000)
            .callFunction(() => {
              const cursor = document.querySelector('.Typewriter__cursor');
              cursor.style.color = "transparent";
            })
            
            .start();
        }}
        
      />
    
      </div>
      
      <div>
        <button
          className="mt-[5.4rem] py-[5px] px-[30px] text-[2rem] border border-white rounded text-white bg-transparent cursor-pointer flex items-center justify-center relative z-[1] transition-all duration-200 hover:bg-white/50 hover:text-black max-[400px]:text-[0.7rem] max-[400px]:m-0"
          onClick={SearchClick}
        >
          Let's get started<HiArrowRight className="p-4" style={{ color: "#fff" }} />
        </button>
      </div>
    </div>
    
  );
}