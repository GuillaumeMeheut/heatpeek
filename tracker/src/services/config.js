export const config = {
  data: null,
  endpointAPI: null,
  endpoint: null,
  trackingId: null,
  path: null,
  referrer: null,

  init(endpointAPI, endpoint, trackingId, path, referrer) {
    this.endpointAPI = endpointAPI;
    this.endpoint = endpoint;
    this.trackingId = trackingId;
    this.path = path;
    this.referrer = referrer;
  },

  async fetch() {
    try {
      const response = await fetch(
        `${this.endpointAPI}/api/project/config?id=${
          this.trackingId
        }&p=${encodeURIComponent(this.path)}`
      );
      if (!response.ok) throw new Error("Failed to fetch config");

      this.data = await response.json();
      return this.data;
    } catch (error) {
      return null;
    }
  },
};
