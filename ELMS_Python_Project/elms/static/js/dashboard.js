document.addEventListener("DOMContentLoaded", async () => {
  if (!ELMS.getToken()) {
    window.location.href = "/login";
    return;
  }

  const errorBox = document.getElementById("dashError");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.style.display = "flex";
  }

  // --- profile chip ---
  try {
    const user = await ELMS.me();
    ELMS.setUser(user);
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userRole").textContent = (user.roles && user.roles[0]) || "Employee";
    const initials = user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
    document.getElementById("userInitials").textContent = initials;
  } catch (err) {
    ELMS.clearToken();
    window.location.href = "/login";
    return;
  }

  // --- stat cards ---
  try {
    const stats = await ELMS.dashboard();
    document.getElementById("statTotal").textContent = stats.totalEmployees;
    document.getElementById("statPending").textContent = stats.pendingLeaves;
    document.getElementById("statApproved").textContent = stats.approvedLeaves;
    document.getElementById("statRejected").textContent = stats.rejectedLeaves;
  } catch (err) {
    showError(err.message || "Could not load dashboard metrics.");
  }

  // --- pending approvals table (managers/admins only — others simply see none) ---
  const tbody = document.getElementById("pendingTableBody");
  try {
    const pending = await ELMS.pendingLeaves();
    if (!pending.length) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-note">No pending requests right now.</td></tr>`;
    } else {
      tbody.innerHTML = pending
        .map(
          (leave) => `
        <tr>
          <td>${leave.employeeName || "Employee #" + leave.employeeId}</td>
          <td>${leave.leaveType}</td>
          <td>${leave.startDate} → ${leave.endDate}</td>
          <td>${leave.totalDays}</td>
          <td><span class="badge ${leave.status}">${leave.status}</span></td>
        </tr>`
        )
        .join("");
    }
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-note">You don't have permission to view pending approvals.</td></tr>`;
  }

  document.getElementById("logoutBtn").addEventListener("click", () => {
    ELMS.clearToken();
    window.location.href = "/login";
  });
});
