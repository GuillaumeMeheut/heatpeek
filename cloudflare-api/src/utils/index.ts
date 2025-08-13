export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Performance measurement utilities
export interface PerformanceMetrics {
  totalTime: number;
  steps: Record<string, number>;
  startTime: number;
}

export function createPerformanceTracker(): PerformanceMetrics {
  return {
    totalTime: 0,
    steps: {},
    startTime: Date.now(),
  };
}

export function measureStep<T>(
  metrics: PerformanceMetrics,
  stepName: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const stepStart = Date.now();

  return Promise.resolve(fn()).then((result) => {
    const stepTime = Date.now() - stepStart;
    metrics.steps[stepName] = stepTime;
    return result;
  });
}

export function finalizeMetrics(
  metrics: PerformanceMetrics
): PerformanceMetrics {
  metrics.totalTime = Date.now() - metrics.startTime;
  return metrics;
}

export function logPerformance(
  metrics: PerformanceMetrics,
  context: string = "API Request"
) {
  console.log(`[${context}] Performance Metrics:`, {
    totalTime: `${metrics.totalTime}ms`,
    steps: Object.entries(metrics.steps).reduce((acc, [step, time]) => {
      acc[step] = `${time}ms`;
      return acc;
    }, {} as Record<string, string>),
  });
}

/**
 * Extracts the base domain from a URL
 * @param url - The URL to extract the base domain from
 * @returns The base domain (e.g., "heatpeek.com" from "https://dashboard.heatpeek.com/pricing")
 */
export function extractBaseDomain(url: string): string | null {
  try {
    if (!url) return null;

    // Handle URLs with or without protocol
    const urlToProcess = url.startsWith("http") ? url : `https://${url}`;
    const urlObj = new URL(urlToProcess);

    // Get the hostname and remove www. prefix if present
    let hostname = urlObj.hostname;
    if (hostname.startsWith("www.")) {
      hostname = hostname.substring(4);
    }

    // Split by dots and get the main domain (last two parts for most cases)
    const parts = hostname.split(".");
    if (parts.length >= 2) {
      // For domains like "dashboard.heatpeek.com", extract "heatpeek.com"
      // For domains like "heatpeek.com", keep as is
      if (parts.length === 2) {
        return hostname; // e.g., "heatpeek.com"
      } else {
        // For subdomains, take the last two parts
        return parts.slice(-2).join(".");
      }
    }

    return hostname;
  } catch (error) {
    console.error("Error extracting base domain:", error);
    return null;
  }
}

/**
 * Checks if two URLs share the same base domain
 * @param url1 - First URL to compare
 * @param url2 - Second URL to compare
 * @returns True if both URLs share the same base domain
 */
export function sameBaseDomain(url1: string, url2: string): boolean {
  const domain1 = extractBaseDomain(url1);
  const domain2 = extractBaseDomain(url2);

  if (!domain1 || !domain2) return false;

  return domain1 === domain2;
}
