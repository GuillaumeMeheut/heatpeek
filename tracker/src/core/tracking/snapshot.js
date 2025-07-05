import { deviceFieldMap } from "../../utils/getDevice";

let navigationHandler;
let timeoutId;

export function setupSnapshotLogic({ config }) {
  teardownSnapshotLogic();

  // Initial snapshot after load or idle
  waitForDomIdle(() => {
    if (shouldSendSnapshot(config)) {
      sendSnapshot(config);
    }
  });

  // On SPA navigation
  navigationHandler = () => {
    timeoutId = setTimeout(() => {
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
  if (config.browser !== "chrome") return false;
  const pageConfig = config.get();
  return !!pageConfig?.page_config?.[deviceFieldMap[config.device]];
}

function sendSnapshot(config) {
  fetch(`${config.endpoint}/api/screenPage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trackingId: config.trackingId,
      device: config.device,
      browser: config.browser,
      os: config.os,
      url: window.location.href,
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

function waitForDomIdle(callback, timeout = 4000) {
  let called = false;

  const runOnce = () => {
    if (called) return;
    called = true;

    if ("requestIdleCallback" in window) {
      requestIdleCallback(callback, { timeout: 1000 });
    } else {
      setTimeout(callback, 300); // Fallback for Safari
    }
  };

  if (document.readyState === "complete") {
    runOnce();
  } else {
    const loadHandler = () => {
      setTimeout(runOnce, 500);
    };
    window.addEventListener("load", loadHandler, { once: true });

    setTimeout(runOnce, timeout);
  }
}
