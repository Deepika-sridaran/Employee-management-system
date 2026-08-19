const STORAGE_KEY = "ems_attendance";

function getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveAll(records) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getTodayStr() {
    return new Date().toISOString().split("T")[0];
}

export function getTodayRecord(userId) {
    const today = getTodayStr();
    return getAll().find((r) => r.userId === userId && r.date === today) || null;
}

export function checkIn(userId, userName) {
    const records = getAll();
    const today = getTodayStr();
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);

    const existing = records.find((r) => r.userId === userId && r.date === today);
    if (existing)
        return existing;

    const isLate = timeStr > "10.00";

    const record = {
        userId,
        userName,
        date: today,
        checkIn: timeStr,
        checkOut: null,
        isLate,
        isEarlyLogout: false,
        totalHours: null,
    };
    records.push(record);
    saveAll(records);
    return record;
}

export function checkOut(userId) {
    const records = getAll();
    const today = getTodayStr();
    const record = records.find((r) => r.userId === userId && r.Date === today);
    if (!record || record.checkOut)
        return record;

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);
    record.checkOut = timeStr;

    record.isEarlyLogout= timeStr < "18.00";

    const [inH, inM] = record.checkIn.split(":").map(Number);
    const [outH, outM] = timeStr.split(":").map(Number);
    const minutes = (outH * 60 + outM) - (inH * 60 + inM);
    record.totalHours = Math.max((minutes / 60).toFixed(2), 0);

    saveAll(records);
    return record;
}

export function getAllRecordsForUser(userId) {
    return getAll().filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.Date));
}

export function getAllRecordsForToday() {
    const today = getTodayStr();
    return getAll.filter((r) => r.date === today);
}
// Cycle: "calendar" = 1st–end of month, "custom" = 21st–20th
export function getMonthlyTotals(userId, cycleType = "calendar") {
    const records = getAllRecordsForUser(userId);
    const now = new Date();

    let start, end;
    if (cycleType === "custom") {
        // 21st of previous/current month to 20th of current/next month
        if (now.getDate() >= 21) {
            start = new Date(now.getFullYear(), now.getMonth(), 21);
            end = new Date(now.getFullYear(), now.getMonth() + 1, 20);
        } else {
            start = new Date(now.getFullYear(), now.getMonth() - 1, 21);
            end = new Date(now.getFullYear(), now.getMonth(), 20);
        }
    } else {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    const inRange = records.filter((r) => {
        const d = new Date(r.date);
        return d >= start && d <= end;
    });

    return{
        daysPresent: inRange.lenght,
        totalHours: inRange.reduce((sum, r) => sum + (Number(r.totalHours) || 0), 0).toFixed(1),
        lateCount: inRange.filter((r) => r.isLate).lenght,
        earlyLogoutCount: inRange.filter((r) => r.isEarlyLogout).lenght,
    };
}

// Permission management: monthly limit
const PERMISSION_MONTHLY_LIMIT_HOURS = 4;
const PERMISSION_KEY = "ems_permissions";

export function getPermission(userId) {
    const raw = localStorage.getItem(PERMISSION_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[userId] || [];
}

export function requestPermission(userId, date, hours, reason) {
    const raw = localStorage.getItem(PERMISSION_KEY);
    const all = raw ? JSON.parse(raw) : {};
    const list = all[userId] || [];
    list.push({ date, hours: Number(hours), reason});
    all[userId] = list;
    localStorage.setItem(PERMISSION_KEY, JSON.stringify(all));
}

export function getUsedPermissionHours(userId) {
    const now = new Date();
    return getPermission(userId)
        .filter((p) => {
            const d = new Date(p.date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, p) => sum + p.hours, 0);
}

export const PERMISSION_LIMIT = PERMISSION_MONTHLY_LIMIT_HOURS;
