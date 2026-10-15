const signupForm = document.getElementById("signupForm");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const formMessage = document.getElementById("formMessage");

// Show/hide the password for either password field.
document.querySelectorAll(".toggle-password").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.target);
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Hide" : "Show";
    button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
});

// Validate details and store a demo account locally so navigation works without a backend.
signupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.classList.remove("success");

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!fullName || !email || !password || !confirmPassword) {
    formMessage.textContent = "Please fill in all fields.";
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formMessage.textContent = "Please enter a valid email address.";
    emailInput.focus();
    return;
  }

  if (password.length < 8) {
    formMessage.textContent = "Password must be at least 8 characters long.";
    passwordInput.focus();
    return;
  }

  if (password !== confirmPassword) {
    formMessage.textContent = "Passwords do not match. Please try again.";
    confirmPasswordInput.focus();
    return;
  }

  const users = JSON.parse(localStorage.getItem("myspace_users") || "[]");
  const normalizedEmail = email.toLowerCase();
  if (users.some(user => user.email === normalizedEmail)) {
    formMessage.textContent = "An account with this email already exists. Please log in.";
    return;
  }
  users.push({ id: 'U-' + Date.now(), name: fullName, email: normalizedEmail, password, role: 'Customer', status: 'Active', joined: new Date().toISOString().slice(0, 10), projects: 0 });
  localStorage.setItem("myspace_users", JSON.stringify(users));
  localStorage.setItem("myspace_current_user", JSON.stringify({ name: fullName, email: normalizedEmail }));
  formMessage.classList.add("success");
  formMessage.textContent = "Account created successfully! Opening My Home…";
  setTimeout(() => location.href = "myhome.html", 600);
});