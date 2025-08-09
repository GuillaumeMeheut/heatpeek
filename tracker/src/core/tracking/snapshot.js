let navigationHandler;
let timeoutId;

export function setupSnapshotLogic(config) {
  if (config.device === "large-desktop") return;

  teardownSnapshotLogic();

  // Initial snapshot after load or idle
  waitForDomIdle(() => {
    if (shouldSendSnapshot(config)) {
      sendSnapshot(config);
    }
  });

  // On SPA navigation
  navigationHandler = () => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Use the same improved waitForDomIdle logic for SPA navigation
    waitForDomIdle(() => {
      if (shouldSendSnapshot(config)) {
        sendSnapshot(config);
      }
    }, 2500); // Slightly shorter timeout for SPA navigation
  };
  document.addEventListener("heatpeek:navigation", navigationHandler);
}

export function teardownSnapshotLogic() {
  if (navigationHandler) {
    document.removeEventListener("heatpeek:navigation", navigationHandler);
    navigationHandler = null;
  }

  if (timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
}

function shouldSendSnapshot(config) {
  const pageConfig = config.data;
  return !!pageConfig?.page_config?.snapshot_update;
}

function sendSnapshot(config) {
  fetch(`${config.endpointAPI}/api/snapshot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trackingId: config.trackingId,
      url: window.location.href,
      device: config.device,
      snapshot: captureSnapshot(),
    }),
  });
}

function captureSnapshot() {
  return {
    html: document.documentElement.outerHTML,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}

function waitForDomIdle(callback, timeout = 8000) {
  let called = false;
  let loadPromises = [];

  const runOnce = () => {
    if (called) return;
    called = true;

    // Wait for all promises to resolve, then execute callback
    Promise.all(loadPromises)
      .then(() => {
        // Additional delay to ensure any remaining animations complete
        setTimeout(() => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(callback, { timeout: 2000 });
          } else {
            setTimeout(callback, 500);
          }
        }, 1000);
      })
      .catch(() => {
        // If any promises fail, still execute callback after timeout
        setTimeout(callback, 2000);
      });
  };

  const waitForImages = () => {
    return new Promise((resolve) => {
      const images = Array.from(document.querySelectorAll("img"));
      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          checkComplete();
        } else {
          img.addEventListener("load", checkComplete, { once: true });
          img.addEventListener("error", checkComplete, { once: true });
        }
      });

      // Fallback timeout for images
      setTimeout(resolve, 3000);
    });
  };

  const waitForFonts = () => {
    return new Promise((resolve) => {
      if ("fonts" in document) {
        document.fonts.ready.then(resolve);
      } else {
        // Fallback for browsers without Font Loading API
        setTimeout(resolve, 1000);
      }
    });
  };

  const waitForAnimations = () => {
    return new Promise((resolve) => {
      // Wait for CSS animations and transitions to complete
      const animatedElements = document.querySelectorAll("*");
      let animationCount = 0;
      let transitionCount = 0;

      const checkStyles = () => {
        let hasAnimations = false;
        let hasTransitions = false;

        animatedElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.animationName && style.animationName !== "none") {
            hasAnimations = true;
          }
          if (style.transitionProperty && style.transitionProperty !== "none") {
            hasTransitions = true;
          }
        });

        if (!hasAnimations && !hasTransitions) {
          resolve();
        } else {
          // Check again after a short delay
          setTimeout(checkStyles, 100);
        }
      };

      // Start checking after a brief delay to allow initial animations to start
      setTimeout(checkStyles, 200);

      // Fallback timeout
      setTimeout(resolve, 2000);
    });
  };

  const waitForNetworkIdle = () => {
    return new Promise((resolve) => {
      // Simple network idle detection
      let lastActivity = Date.now();
      const checkIdle = () => {
        if (Date.now() - lastActivity > 1000) {
          resolve();
        } else {
          setTimeout(checkIdle, 200);
        }
      };

      // Start checking after a delay
      setTimeout(checkIdle, 1000);

      // Fallback timeout
      setTimeout(resolve, 3000);
    });
  };

  if (document.readyState === "complete") {
    // Page is already loaded, collect promises and wait
    loadPromises = [
      waitForImages(),
      waitForFonts(),
      waitForAnimations(),
      waitForNetworkIdle(),
    ];
    runOnce();
  } else {
    // Page is still loading
    const loadHandler = () => {
      // Wait a bit more after load event to ensure everything is processed
      setTimeout(() => {
        loadPromises = [
          waitForImages(),
          waitForFonts(),
          waitForAnimations(),
          waitForNetworkIdle(),
        ];
        runOnce();
      }, 1000);
    };

    window.addEventListener("load", loadHandler, { once: true });

    // Fallback timeout
    setTimeout(() => {
      if (!called) {
        loadPromises = [
          waitForImages(),
          waitForFonts(),
          waitForAnimations(),
          waitForNetworkIdle(),
        ];
        runOnce();
      }
    }, timeout);
  }
}
