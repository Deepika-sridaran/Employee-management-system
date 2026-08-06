document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorBox = document.getElementById("loginError");
  const btn = document.getElementById("loginBtn");
  const spinner = document.getElementById("loginSpinner");
  const btnText = document.getElementById("loginBtnText");
  const toggleBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");

  // If already signed in, skip straight to the dashboard.
  if (ELMS.getToken()) {
    window.location.href = "/dashboard";
  }

  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
  });

  function setLoading(loading) {
    btn.disabled = loading;
    spinner.classList.toggle("show", loading);
    btnText.textContent = loading ? "Signing in…" : "Sign in";
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.add("show");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.classList.remove("show");

    const email = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError("Please enter both your email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await ELMS.login(email, password);
      ELMS.setToken(data.accessToken);
      ELMS.setUser(data.employee);
      window.location.href = "/dashboard";
    } catch (err) {
      showError(err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  });
});
