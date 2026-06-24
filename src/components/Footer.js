import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
//import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  const li = "mr-[10px] last:mr-0 transition-all duration-500 hover:scale-125";
  const link = "text-white no-underline text-[1.75rem] p-2 max-[400px]:text-[1.25rem] max-[400px]:p-1";
  return (
    <div className="bg-transparent text-white p-5 pb-10 flex h-[8vh] justify-end fixed right-0 bottom-0 w-full z-50 pointer-events-none max-[400px]:justify-center max-[400px]:items-center">
      <div className="flex flex-col items-start pointer-events-auto">
        <ul className="list-none m-0 p-0 flex">
          {/* <li className={li}><a href="#" className={`${link} hover:text-[#3b5998]`}><FontAwesomeIcon icon={faFacebook} /></a></li>
          <li className={li}><a href="#" className={`${link} hover:text-[#1da1f2]`}><FontAwesomeIcon icon={faTwitter} /></a></li> */}
          <li className={li}><a href="https://www.instagram.com/thisisnotedward/" target="_blank" rel="noopener noreferrer" className={`${link} hover:text-[rgb(202,10,122)]`}><FontAwesomeIcon icon={faInstagram} /></a></li>
          {/* <li className={li}><a href="#" className={link}><FontAwesomeIcon icon={faEnvelope} /></a></li> */}
        </ul>
      </div>
    </div>
  );
}
