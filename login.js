const authForm = document.getElementById("authForm");
const forgotPassword = document.getElementById("forgotPassword");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const formMessage = document.getElementById("formMessage");

// Show or hide the password while typing.
togglePassword.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  togglePassword.textContent = isHidden ? "Hide" : "Show";
  togglePassword.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

// Demo forgot-password interaction; connect this to a backend to send an email.
forgotPassword.addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  formMessage.classList.remove("success");
  formMessage.textContent = email
    ? `Password reset can be requested for ${email}. Connect this action to your backend.`
    : "Enter your email address first, then choose Forgot password.";
});

// Demo authentication uses localStorage so the whole prototype works without a backend.
authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("success");
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = passwordInput.value;
  if (!email || !password) {
    formMessage.textContent = "Please enter your email address and password.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    return;
  }
  const users = JSON.parse(localStorage.getItem("myspace_users") || "[]");
  const found = users.find(user => (user.email || "").toLowerCase() === email && user.password === password);
  if (found) {
    localStorage.setItem("myspace_current_user", JSON.stringify({ name: found.name, email: found.email }));
  } else {
    // For a smooth class demo, allow first-time demo sign-in and remember the session.
    const name = email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    localStorage.setItem("myspace_current_user", JSON.stringify({ name, email }));
  }
  formMessage.classList.add("success");
  formMessage.textContent = "Login successful! Opening My Home…";
  setTimeout(() => location.href = "myhome.html", 500);
});
