const STORAGE_KEY = "ems_payroll";

function getAll() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
}

export function getPayroll(userId) {
    const all = getAll();
    return (
        all[userId] || {
            basicSalary: 0,
            hra: 0,
            da: 0,
            bonus: 0,
            overtime: 0,
            pf: 0,
            tax: 0,
        }
    );
}

export function savePayroll(userId, data) {
    const all = getAll();
    all[userId] = data;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function calculateNetPay(p) {
    const gross = Number(p.basicSalary) + Number(p.hra) + Number(p.da) + Number(p.bonus) + Number(p.overtime);
    const deductions = Number(p.pf) + Number(p.tax);
    return { gross, deductions, net: gross - deductions };
}