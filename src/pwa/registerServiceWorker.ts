export function registerServiceWorker() {
  const shouldRegister =
    'serviceWorker' in navigator &&
    (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW_IN_DEV === 'true');

  if (!shouldRegister) {
    return;
  }

  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, {
        scope: import.meta.env.BASE_URL,
      });
    } catch (error) {
      console.error('Falha ao registrar o service worker.', error);
    }
  });
}
