document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const errorBox = document.getElementById("resetError");
  const successBox = document.getElementById("resetSuccess");
  const btn = document.getElementById("resetBtn");
  const spinner = document.getElementById("resetSpinner");
  const btnText = document.getElementById("resetBtnText");

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (!token) {
    errorBox.textContent = "This reset link is missing its token. Please request a new one.";
    errorBox.classList.add("show");
    form.querySelectorAll("input, button").forEach((el) => (el.disabled = true));
  }

  function setLoading(loading) {
    btn.disabled = loading;
    spinner.classList.toggle("show", loading);
    btnText.textContent = loading ? "Resetting…" : "Reset password";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.remove("show");
    successBox.classList.remove("show");

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword.length < 8) {
      errorBox.textContent = "Password must be at least 8 characters.";
      errorBox.classList.add("show");
      return;
    }
    if (newPassword !== confirmPassword) {
      errorBox.textContent = "Passwords do not match.";
      errorBox.classList.add("show");
      return;
    }

    setLoading(true);
    try {
      await ELMS.resetPassword(token, newPassword);
      successBox.textContent = "Password reset! Redirecting you to sign in…";
      successBox.classList.add("show");
      form.reset();
      setTimeout(() => (window.location.href = "/login"), 1800);
    } catch (err) {
      errorBox.textContent = err.message || "Could not reset your password. The link may have expired.";
      errorBox.classList.add("show");
    } finally {
      setLoading(false);
    }
  });
});
