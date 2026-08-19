export const holidays = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-14", name: "Pongal / Makar Sankranti" },
  { date: "2026-01-26", name: "Republic Day" },
  { date: "2026-03-04", name: "Holi" },
  { date: "2026-04-14", name: "Tamil New Year" },
  { date: "2026-05-01", name: "May Day" },
  { date: "2026-08-15", name: "Independence Day" },
  { date: "2026-08-26", name: "Miladi Nabi" },
  { date: "2026-08-28", name: "Raksha Bandhan"},
  { date: "2026-09-14", name: "Ganesh Chaturthi"},
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-11-08", name: "Diwali" },
  { date: "2026-12-02", name: "National Day" },
  { date: "2026-12-25", name: "Christmas" },
];

export function getHolidayForDate(dateStr) {
  return holidays.find((h) => h.date === dateStr);
}

export function getUpcomingHolidays(count = 5) {
  const today = new Date().toISOString().split("T")[0];
  return holidays
    .filter((h) => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}