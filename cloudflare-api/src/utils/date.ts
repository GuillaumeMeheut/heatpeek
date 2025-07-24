export const getDayStart = () => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
};

export function subMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

export function toClickhouseDateTime(date: Date): string {
  return date.toISOString().split(".")[0].replace("T", " ");
}
