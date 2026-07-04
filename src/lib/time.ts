import { MOCK_NOW } from "@/data/matches";

/** "18:00" — kick-offs are always 24h. */
export function formatKickoff(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** "in 2h 10m" / "in 45m" relative to the (mock) clock; "" once started. */
export function untilKickoff(iso: string, now: Date = MOCK_NOW): string {
  const diffMin = Math.round((new Date(iso).getTime() - now.getTime()) / 60000);
  if (diffMin <= 0) return "";
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  if (h === 0) return `in ${m}m`;
  if (m === 0) return `in ${h}h`;
  return `in ${h}h ${m}m`;
}

/** True if the date is the same calendar day as the (mock) clock. */
export function isToday(iso: string, now: Date = MOCK_NOW): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

/** "Tue · Jun 30" for the Today header. */
export function formatToday(now: Date = MOCK_NOW): string {
  const weekday = now.toLocaleDateString("en-US", { weekday: "short" });
  const month = now.toLocaleDateString("en-US", { month: "short" });
  return `${weekday} · ${month} ${now.getDate()}`;
}

/** "Good morning" / "Good afternoon" / "Good evening". */
export function greeting(now: Date = MOCK_NOW): string {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
