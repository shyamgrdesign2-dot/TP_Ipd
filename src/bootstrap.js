import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import reportWebVitals from './reportWebVitals';

import './index.css';
import './assets/scss/app.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Sentry from "@sentry/react";
import icomoonWoff from './assets/fonts/iconmoon/icomoon.woff';

// Set global wallpaper path from public static assets to avoid bundling large media.
if (typeof document !== 'undefined') {
  const cdssWallpaperUrl = `${process.env.PUBLIC_URL || ''}/static-media/cdss-wallpaper.gif`;
  document.documentElement.style.setProperty('--cdss-wallpaper-url', `url(${cdssWallpaperUrl})`);
}

// Proactively load icomoon so icon glyphs are available before UI renders.
if (typeof document !== 'undefined' && 'fonts' in document && typeof FontFace !== 'undefined') {
  const icomoonFace = new FontFace('icomoon', `url(${icomoonWoff}) format('woff')`, {
    display: 'swap',
  });
  icomoonFace
    .load()
    .then((loadedFace) => {
      document.fonts.add(loadedFace);
      document.documentElement.classList.add('icomoon-loaded');
    })
    .catch(() => {
      // Keep SVG fallback if font fails to load.
    });
}

Sentry.init({
  dsn: "https://e217b496cfe26ddc7d834f74ad8ff89c@o4509909105508352.ingest.us.sentry.io/4509910041231360",
  sendDefaultPii: true,
  environment: process.env.REACT_APP_ENV,
  beforeSend(event) {
    // Filter out development errors or specific error types
    if (event.environment === "dev") return null;
    return event;
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter basename={"/"}>
      <App />
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
