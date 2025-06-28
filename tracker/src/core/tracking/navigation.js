export function setupNavigationTracking() {
  let lastPath = location.pathname;

  function handlePageChange(isSPA = false) {
    const newPath = location.pathname;
    if (isSPA && newPath === lastPath) return;
    lastPath = newPath;
    document.dispatchEvent(
      new CustomEvent("heatpeek:navigation", { detail: newPath })
    );
  }

  window.addEventListener("hashchange", () => handlePageChange(true));
  window.addEventListener("popstate", () => handlePageChange(true));

  const originalPushState = history.pushState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
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
}
