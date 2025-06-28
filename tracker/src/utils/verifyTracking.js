export async function verifyTracking(endpoint, trackingId) {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("verifyHp") === trackingId) {
    try {
      await fetch(`${endpoint}/api/verify/${trackingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: true }),
      });
      window.close();
    } catch (error) {
      console.error("Heatpeek: verifyTracking failed", error);
    }
  }
}
