import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook,faTwitter,faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'

export default function Footer() {
  const li = "mr-[10px] last:mr-0 transition-all duration-500 hover:scale-125";
  const link = "text-white no-underline text-[3rem] p-4 max-[400px]:text-[2rem] max-[400px]:p-2";
  return (
    <div className="bg-transparent text-white p-5 flex h-[8vh] justify-end fixed right-0 bottom-0 w-full max-[400px]:justify-center max-[400px]:items-center">
      <div className="flex flex-col items-start">
        <ul className="list-none m-0 p-0 flex">
          <li className={li}><a href="#" className={`${link} hover:text-[#3b5998]`}><FontAwesomeIcon icon={faFacebook} /></a></li>
          <li className={li}><a href="#" className={`${link} hover:text-[#1da1f2]`}><FontAwesomeIcon icon={faTwitter} /></a></li>
          <li className={li}><a href="#" className={`${link} hover:text-[rgb(202,10,122)]`}><FontAwesomeIcon icon={faInstagram} /></a></li>
          <li className={li}><a href="#" className={link}><FontAwesomeIcon icon={faEnvelope} /></a></li>
        </ul>
      </div>
    </div>
  );
}
