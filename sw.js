/* Medha Coaching Center — PWA service worker.
   Network-first so a new deploy goes live immediately (the site sets
   no-cache on html/css/js); falls back to the cached app shell offline.
   Bump CACHE when the icon/shell list changes. */
const CACHE = "medha-v1";
const CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(SHELL).catch(() => {});
    // The Supabase SDK is cross-origin; a failure here must not break install.
    await cache.add(new Request(CDN, { mode: "no-cors" })).catch(() => {});
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  // Same origin, plus the SDK CDN (cached so the shell can boot offline).
  const cacheable = url.origin === self.location.origin || url.hostname.endsWith("jsdelivr.net");
  if (!cacheable) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response && response.status === 200) {
        const cache = await caches.open(CACHE);
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (err) {
      const cached = await caches.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === "navigate") {
        const fallback = await caches.match("./index.html");
        if (fallback) return fallback;
      }
      throw err;
    }
  })());
});
