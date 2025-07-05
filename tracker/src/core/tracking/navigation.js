export function setupNavigationTracking() {
  let lastUrl = location.pathname;

  function handlePageChange(isSPA = false) {
    const newUrl = location.pathname;
    if (isSPA && newUrl === lastUrl) return;
    lastUrl = newUrl;
    document.dispatchEvent(
      new CustomEvent("heatpeek:navigation", { detail: newUrl })
    );
  }

  const notifyBeforeNavigation = () => {
    document.dispatchEvent(new Event("heatpeek:before-navigation"));
  };

  window.addEventListener("hashchange", () => handlePageChange(true));
  window.addEventListener("popstate", () => {
    notifyBeforeNavigation();
    handlePageChange(true);
  });

  const originalPushState = history.pushState;
  history.pushState = function () {
    notifyBeforeNavigation();
    originalPushState.apply(this, arguments);
    handlePageChange(true);
  };

  const originalReplaceState = history.replaceState;
  history.replaceState = function () {
    notifyBeforeNavigation();
    originalReplaceState.apply(this, arguments);
    handlePageChange(true);
  };

  if (
    document.visibilityState === "hidden" ||
    document.visibilityState === "prerender"
  ) {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        handlePageChange(false);
      }
    });
  } else {
    handlePageChange(false);
  }

  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      handlePageChange(false);
    }
  });

  // Optional cleanup return
  return () => {
    window.removeEventListener("hashchange", handlePageChange);
    window.removeEventListener("popstate", handlePageChange);
    window.removeEventListener("pageshow", handlePageChange);
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  };
}
