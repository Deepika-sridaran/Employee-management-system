import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHolidayForDate, getUpcomingHolidays } from "../data/holidays.js";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateStr(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function CalendarCard() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const todayStr = today.toISOString().split("T")[0];
  const upcomingHolidays = getUpcomingHolidays(3);

  function goToPrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDateClick(dateStr) {
    setSelectedDate(dateStr === selectedDate ? null : dateStr);
  }

  const blanks = Array.from({ length: firstDayOfMonth });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const selectedHoliday = selectedDate ? getHolidayForDate(selectedDate) : null;

  return (
    <div className="dashboard-card calendar-card">
      <div className="card-header">
        <h3>📅 CALENDAR</h3>
      </div>

      <div className="calendar-nav">
        <button onClick={goToPrevMonth}>‹</button>
        <strong>{MONTH_NAMES[viewMonth]} {viewYear}</strong>
        <button onClick={goToNextMonth}>›</button>
      </div>

      <div className="calendar">
        <div className="calendar-days">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span>
          <span>Thu</span><span>Fri</span><span>Sat</span>
        </div>

        <div className="calendar-dates">
          {blanks.map((_, i) => <span key={`blank-${i}`}></span>)}
          {days.map((day) => {
            const dateStr = formatDateStr(viewYear, viewMonth, day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;
            const holiday = getHolidayForDate(dateStr);
            return (
              <span
                key={day}
                onClick={() => handleDateClick(dateStr)}
                className={[
                  isToday ? "today" : "",
                  holiday ? "holiday-date" : "",
                  isSelected ? "selected-date" : "",
                ].join(" ").trim()}
                title={holiday ? holiday.name : ""}
              >
                {day}
              </span>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-panel">
          <div>
            <strong>{selectedDate}</strong>
            {selectedHoliday ? (
              <p className="holiday-tag">🎉 {selectedHoliday.name}</p>
            ) : (
              <p className="no-holiday-tag">No holiday on this date</p>
            )}
          </div>
          <button onClick={() => navigate("/apply-leave", { state: { prefillDate: selectedDate } })}>
            Apply Leave
          </button>
          </div>)}

      <div className="upcoming-holidays">
        <div className="upcoming-holidays-title">Upcoming Holidays</div>
        {upcomingHolidays.length === 0 ? (
          <p className="empty-note">No upcoming holidays this year.</p>
        ) : (
          upcomingHolidays.map((h) => (
            <div className="holiday-row" key={h.date}>
              <span className="holiday-dot"></span>
              <span className="holiday-name">{h.name}</span>
              <span className="holiday-date-label">{h.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CalendarCard;