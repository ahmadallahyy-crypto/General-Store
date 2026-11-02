// Date helpers. They use a fixed locale (en-GB: "14 Oct") so the text is the same for every visitor.

/** "14 Oct – 16 Oct" for a delivery window of [fastest, slowest] days from `from`. Call it in the browser (it uses today's date). */
export function formatEtaRange(days: readonly [number, number], from: Date): string {
  const format = (offset: number) => {
    const d = new Date(from);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };
  return `${format(days[0])} – ${format(days[1])}`;
}

/** The next midnight in Lagos (23:00 UTC), as an ISO string. Used as the end of the daily flash sale. */
export function nextLagosMidnight(now = new Date()): string {
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 0, 0));
  if (end <= now) end.setUTCDate(end.getUTCDate() + 1);
  return end.toISOString();
}
