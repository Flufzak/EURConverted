const APP_CACHE = "eurconverted-app-v1";
const API_CACHE = "eurconverted-api-v1";
const APP_SHELL_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/icons/180.png",
  "/icons/192.png",
  "/icons/512.png",
  "/icons/maskable.png",
];

function isFrankfurterRequest(request) {
  return new URL(request.url).origin === "https://api.frankfurter.dev";
}

function isAppAssetRequest(request) {
  const url = new URL(request.url);

  return request.method === "GET" && url.origin === self.location.origin;
}

function isValidRatePayload(data) {
  if (Array.isArray(data)) {
    return typeof data[0]?.rate === "number";
  }

  return typeof data?.rate === "number";
}

async function cacheAppShell() {
  const cache = await caches.open(APP_CACHE);
  await cache.addAll(APP_SHELL_URLS);
}

async function cacheLoadedAssets(urls) {
  const cache = await caches.open(APP_CACHE);
  const sameOriginUrls = urls.filter((url) => new URL(url).origin === self.location.origin);

  await Promise.allSettled(
    sameOriginUrls.map(async (url) => {
      const response = await fetch(url, { cache: "reload" });

      if (response.ok) {
        await cache.put(url, response);
      }
    }),
  );
}

async function handleAppRequest(request) {
  const cache = await caches.open(APP_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (await cache.match(request)) ?? cache.match("/");
  }
}

async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);

  try {
    const response = await fetch(request);

    if (response.ok) {
      try {
        const data = await response.clone().json();

        if (isValidRatePayload(data)) {
          await cache.put(request, response.clone());
        }
      } catch {
        if (cachedResponse) {
          return cachedResponse;
        }
      }
    }

    return response;
  } catch {
    if (cachedResponse) {
      return cachedResponse;
    }

    throw new Error("No cached rate available");
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "CACHE_LOADED_ASSETS") {
    event.waitUntil(cacheLoadedAssets(event.data.urls));
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  if (isFrankfurterRequest(event.request)) {
    event.respondWith(handleApiRequest(event.request));
    return;
  }

  if (isAppAssetRequest(event.request)) {
    event.respondWith(handleAppRequest(event.request));
  }
});
