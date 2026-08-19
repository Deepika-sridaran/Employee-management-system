const STORAGE_KEY = "ems_profile_extras";

function getAllExtras() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

export function getProfileExtras(userId) {
    const all = getAllExtras();
    return (
        all[userId] || {
            dateofBirth: "",
            gender: "",
            dateofJoining: "",
            employeeStatus: "Active",
        }
    );
}

export function saveProfileExtras(userId, extras) {
    const all = getAllExtras();
    all[userId] = extras;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
