export function setupNavigationTracking() {
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  let lastUrl = location.pathname;
  let navigationTimeout = null;
  let isNavigating = false;

  const handlePageChange = (isSPA = false) => {
    const newUrl = location.pathname;

    if (isSPA && newUrl === lastUrl) return;

    lastUrl = newUrl;
    document.dispatchEvent(
      new CustomEvent("heatpeek:navigation", { detail: newUrl })
    );
  };

  const onHashChange = () => handlePageChange(true);
  const onPopState = () => {
    handlePageChange(true);
  };
  const onPushState = (...args) => {
    originalPushState.apply(history, args);
    handlePageChange(true);
  };
  const onReplaceState = (...args) => {
    originalReplaceState.apply(history, args);
    handlePageChange(true);
  };
  const onPageshow = (e) => {
    if (e.persisted) handlePageChange(false);
  };

  window.addEventListener("hashchange", onHashChange);
  window.addEventListener("popstate", onPopState);
  window.addEventListener("pageshow", onPageshow);

  history.pushState = onPushState;
  history.replaceState = onReplaceState;

  return () => {
    window.removeEventListener("hashchange", onHashChange);
    window.removeEventListener("popstate", onPopState);
    window.removeEventListener("pageshow", onPageshow);

    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;

    if (navigationTimeout) {
      clearTimeout(navigationTimeout);
    }
  };
}
