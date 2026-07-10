// Doctor Agent formatting helpers. House rules:
// - 12-hour AM/PM time everywhere (to12h)
// - Sep divider between inline values (never a middle-dot "·")
// - no em dashes anywhere in copy

// Parse a variety of timestamp shapes into a Date (or null).
function toDate(input) {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

// 12-hour clock: "9:30 AM". Accepts Date | ISO string | "HH:mm" | "HH:mm:ss".
export function to12h(input) {
  let d = toDate(input);
  if (!d && typeof input === "string" && /^\d{1,2}:\d{2}/.test(input)) {
    const [h, m] = input.split(":");
    d = new Date();
    d.setHours(Number(h), Number(m), 0, 0);
  }
  if (!d) return typeof input === "string" ? input : "";
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, "0")} ${ampm}`;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// "Today, 9:30 AM" / "Yesterday, 8:00 PM" / "5 Jul, 9:30 AM"
export function toDateTimeLabel(input) {
  const d = toDate(input);
  if (!d) return "";
  const now = new Date();
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const yest = new Date(now);
  yest.setDate(now.getDate() - 1);
  const time = to12h(d);
  if (sameDay(d, now)) return `Today, ${time}`;
  if (sameDay(d, yest)) return `Yesterday, ${time}`;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${time}`;
}

// Relative time: "just now", "5 min ago", "2h ago", "3d ago".
export function relativeTime(input) {
  const d = toDate(input);
  if (!d) return "";
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 45) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Short calendar date: "6 Jul '26". Falls back to the raw string if unparseable.
export function toShortDate(input) {
  const d = toDate(input);
  if (!d) return typeof input === "string" ? input : "";
  const yy = String(d.getFullYear()).slice(-2);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} '${yy}`;
}

// Day-of-stay label: admittedOn -> "D+3".
export function dayOfStay(admittedOn) {
  const d = toDate(admittedOn);
  if (!d) return "";
  const days = Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
  return `D+${days}`;
}

let idSeq = 0;
export function nextId(prefix = "m") {
  idSeq += 1;
  return `${prefix}-${idSeq}-${Math.floor(performance.now())}`;
}
