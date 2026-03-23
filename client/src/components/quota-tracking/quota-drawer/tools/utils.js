// Helpers to normalize API date/time values for HTML inputs

export function formatDateForInput(value) {
  if (!value) return "";
  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10);
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatDateForDisplay(value) {
  const normalized = formatDateForInput(value);
  if (!normalized) return "";
  const [yyyy, mm, dd] = normalized.split("-");
  return `${mm}/${dd}/${yyyy}`;
}

export function formatTimeForInput(value) {
  if (!value) return "";
  if (typeof value === "string") {
    // Strings like HH:mm:ss or HH:mm:ssZ → take HH:mm
    const m = value.match(/^(\d{1,2}):(\d{2})/);
    if (m) return `${m[1].padStart(2, "0")}:${m[2]}`;
    // ISO datetime → parse to local HH:mm
    if (value.includes("T")) {
      const d = new Date(value);
      if (!Number.isNaN(d.getTime())) {
        const hh = String(d.getHours()).padStart(2, "0");
        const mm = String(d.getMinutes()).padStart(2, "0");
        return `${hh}:${mm}`;
      }
    }
  }
  // Date object fallback
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatTimeForDisplay(value) {
  const normalized = formatTimeForInput(value);
  if (!normalized) return "";

  const [hoursString, minutes] = normalized.split(":");
  const hours = Number(hoursString);
  if (Number.isNaN(hours)) return normalized;

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${minutes} ${suffix}`;
}
