document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");
  const errorBox = document.getElementById("forgotError");
  const successBox = document.getElementById("forgotSuccess");
  const btn = document.getElementById("forgotBtn");
  const spinner = document.getElementById("forgotSpinner");
  const btnText = document.getElementById("forgotBtnText");

  function setLoading(loading) {
    btn.disabled = loading;
    spinner.classList.toggle("show", loading);
    btnText.textContent = loading ? "Sending…" : "Send reset link";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.remove("show");
    successBox.classList.remove("show");

    const email = document.getElementById("email").value.trim();
    if (!email) return;

    setLoading(true);
    try {
      const data = await ELMS.forgotPassword(email);
      let message = data.message;
      // In local/dev mode (no SMTP configured) the API returns the link directly.
      if (data.resetLink) {
        message += ` — dev link: ${data.resetLink}`;
      }
      successBox.textContent = message;
      successBox.classList.add("show");
      form.reset();
    } catch (err) {
      errorBox.textContent = err.message || "Something went wrong. Please try again.";
      errorBox.classList.add("show");
    } finally {
      setLoading(false);
    }
  });
});
