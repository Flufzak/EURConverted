function getLoadedAssetUrls(): string[] {
  return performance
    .getEntriesByType("resource")
    .map((entry) => entry.name)
    .filter((url) => new URL(url).origin === window.location.origin);
}

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(async (registration) => {
        await navigator.serviceWorker.ready;

        registration.active?.postMessage({
          type: "CACHE_LOADED_ASSETS",
          urls: [window.location.href, ...getLoadedAssetUrls()],
        });
      })
      .catch(() => undefined);
  });
}
