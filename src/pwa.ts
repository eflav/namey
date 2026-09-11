import { registerSW } from 'virtual:pwa-register';

/** Force service worker to check for updates and activate immediately. */
export function setupPwa() {
  const updateSW = registerSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      // Poll for a new SW periodically while the tab is open
      window.setInterval(() => {
        void registration.update();
      }, 60_000);
    },
    onNeedRefresh() {
      void updateSW(true);
    },
  });
}
