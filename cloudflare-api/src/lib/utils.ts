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

export const getDayStart = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};
