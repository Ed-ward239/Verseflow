import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './index.css';


// basename keeps routes working under the GitHub Pages subpath (/Lyrical.ly).
// process.env.PUBLIC_URL is derived from "homepage" in package.json.
ReactDOM.render((
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <App />
  </BrowserRouter>
  ), document.getElementById('root')
);
