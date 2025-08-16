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
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    waitForDomIdle(() => {
      if (shouldSendSnapshot(config)) {
        sendSnapshot(config);
      }
    }, 2500);
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
      snapshot: captureSnapshot(config),
    }),
  });
}

/**
 * Capture sanitized DOM snapshot
 */
function captureSnapshot(config) {
  const html = sanitizeDOM(document.documentElement, {
    exclude_el: config.data?.page_config?.exclude_el || [],
    privacy_el: config.data?.page_config?.privacy_el || [],
  });

  return {
    html,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };
}

/**
 * Sanitize DOM for privacy
 */
function sanitizeDOM(root, opts = {}) {
  const clone = root.cloneNode(true);

  const defaultExcluded = [
    '[id*="cookie"]',
    '[class*="cookie"]',
    '[id*="consent"]',
    '[class*="consent"]',
    '[id*="gdpr"]',
    '[class*="gdpr"]',
  ];

  const excludeSelectors = [
    ...defaultExcluded,
    ...(opts.exclude_el ?? []),
    "[data-hp-exclude]",
  ];

  // helper to avoid crashes on invalid selectors
  function safeMatches(el, selector) {
    try {
      return el.matches(selector);
    } catch {
      console.warn("Invalid selector ignored:", selector);
      return false;
    }
  }

  // instead of running querySelectorAll for each selector,
  // walk once and remove matching nodes
  const walkerExclude = document.createTreeWalker(
    clone,
    NodeFilter.SHOW_ELEMENT
  );
  let node = walkerExclude.currentNode;

  while (node) {
    const current = node;
    node = walkerExclude.nextNode(); // advance before removal
    if (excludeSelectors.some((sel) => safeMatches(current, sel))) {
      current.remove();
    }
  }

  // Clear input/textarea values
  clone.querySelectorAll("input, textarea").forEach((el) => {
    el.value = "";
    el.setAttribute("value", "");
  });

  // Walk text nodes and sanitize sensitive patterns
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;
      const tag = node.parentElement.tagName;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "HEAD"].includes(tag))
        return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const patterns = [
    [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email]"], // Email
    [/\+?\d[\d\-\s()]{6,}\d/g, "[phone]"], // Phone
    [/\b(?:\d[ -]*?){13,16}\b/g, "[cc-number]"], // Credit card
    [/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[ip]"], // IPv4
  ];

  let textNode;
  while ((textNode = walker.nextNode())) {
    if (!textNode.textContent) continue;
    patterns.forEach(([regex, replacement]) => {
      textNode.textContent = textNode.textContent.replace(regex, replacement);
    });
  }

  // Handle privacy masking
  let privacySelectors = "[data-hp-privacy]";
  if (opts.privacy_el && opts.privacy_el.length > 0) {
    privacySelectors = opts.privacy_el.join(",") + ", [data-hp-privacy]";
  }

  clone.querySelectorAll(privacySelectors).forEach((el) => {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = "";
      el.setAttribute("value", "");
    } else {
      el.innerText = "[masked]";
    }
  });

  return clone.outerHTML;
}

function waitForDomIdle(callback, timeout = 8000) {
  let called = false;
  let loadPromises = [];

  const runOnce = () => {
    if (called) return;
    called = true;

    Promise.all(loadPromises)
      .then(() => {
        setTimeout(() => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(callback, { timeout: 2000 });
          } else {
            setTimeout(callback, 500);
          }
        }, 1000);
      })
      .catch(() => {
        setTimeout(callback, 2000);
      });
  };

  const waitForImages = () =>
    new Promise((resolve) => {
      const images = Array.from(document.querySelectorAll("img"));
      if (images.length === 0) {
        resolve();
        return;
      }
      let loadedCount = 0;
      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= images.length) {
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
      setTimeout(resolve, 3000);
    });

  const waitForFonts = () =>
    new Promise((resolve) => {
      if ("fonts" in document) {
        document.fonts.ready.then(resolve);
      } else {
        setTimeout(resolve, 1000);
      }
    });

  const waitForAnimations = () =>
    new Promise((resolve) => {
      const animatedElements = document.querySelectorAll("*");
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
          setTimeout(checkStyles, 100);
        }
      };
      setTimeout(checkStyles, 200);
      setTimeout(resolve, 2000);
    });

  const waitForNetworkIdle = () =>
    new Promise((resolve) => {
      let lastActivity = Date.now();
      const checkIdle = () => {
        if (Date.now() - lastActivity > 1000) {
          resolve();
        } else {
          setTimeout(checkIdle, 200);
        }
      };
      setTimeout(checkIdle, 1000);
      setTimeout(resolve, 3000);
    });

  if (document.readyState === "complete") {
    loadPromises = [
      waitForImages(),
      waitForFonts(),
      waitForAnimations(),
      waitForNetworkIdle(),
    ];
    runOnce();
  } else {
    const loadHandler = () => {
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
