export const config = {
  data: null,
  lastFetch: 0,
  CACHE_DURATION: 60 * 1000,
  endpointAPI: null,
  trackingId: null,

  init(endpointAPI, trackingId) {
    this.endpointAPI = endpointAPI;
    this.trackingId = trackingId;
  },

  async fetch() {
    const now = Date.now();
    if (this.data && now - this.lastFetch < this.CACHE_DURATION) {
      return this.data;
    }

    try {
      const response = await fetch(
        `${this.endpointAPI}/api/project/config?id=${
          this.trackingId
        }&p=${encodeURIComponent(window.location.pathname)}`
      );
      if (!response.ok) throw new Error("Failed to fetch config");

      this.data = await response.json();
      this.lastFetch = now;
      return this.data;
    } catch (error) {
      console.error("Heatpeek: Error fetching config:", error);
      return null;
    }
  },

  get() {
    return this.data;
  },
};
