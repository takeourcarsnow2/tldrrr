// Dev NO-OP Service Worker
// Purpose: when running in development and SWs are disabled, register this
// minimal service worker to replace any older/buggy worker that might be
// intercepting Next dev HMR requests. It intentionally does not intercept
// or cache Next.js assets and avoids any background work.

self.addEventListener('install', (e) => {
  // Activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Claim clients so this SW controls pages as soon as possible
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  try {
    const url = new URL(event.request.url);
    // Never intercept Next dev assets (HMR) or webpack hot updates
    if (url.pathname.startsWith('/_next/')) {
      return; // let the browser handle it directly
    }
    // For everything else, do not attempt to respond from cache — just passthrough
    // so we don't accidentally keep the SW alive or modify responses.
    // Note: returning undefined lets the request go to network as usual.
  } catch (e) {
    // On any error, do nothing and let requests go to network
  }
});
