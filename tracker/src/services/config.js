export const config = {
  data: null,
  endpointAPI: null,
  endpoint: null,
  trackingId: null,
  path: null,
  device: null,
  browser: null,
  os: null,
  referrer: null,

  init(endpointAPI, endpoint, trackingId, path, device, browser, os, referrer) {
    this.endpointAPI = endpointAPI;
    this.endpoint = endpoint;
    this.trackingId = trackingId;
    this.path = path;
    this.device = device;
    this.browser = browser;
    this.os = os;
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

  get() {
    return this.data;
  },
};
