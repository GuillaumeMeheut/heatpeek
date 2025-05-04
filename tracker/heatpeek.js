(function () {
  const projectId = document.currentScript.getAttribute("data-id");
  const endpoint = "http://localhost:3000/api/trackClick";

  if (!projectId) {
    console.error("Heatpeek: Project ID is required");
    return;
  }

  let lastClickTime = 0;
  const THROTTLE_MS = 500;

  document.addEventListener("click", (e) => {
    const now = Date.now();
    if (now - lastClickTime < THROTTLE_MS) return;
    lastClickTime = now;

    const payload = {
      projectId,
      url: window.location.href,
      relativeX: e.clientX / window.innerWidth,
      relativeY: e.clientY / window.innerHeight,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      element: e.target.tagName,
      class: e.target.className,
      id: e.target.id,
    };

    const data = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, data);
    } else {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data,
      }).catch((error) => {
        console.error("Heatpeek: Error sending click data:", error);
      });
    }
  });
})();
