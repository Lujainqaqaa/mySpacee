/* MySpace shared navigation: links existing pages using the actual filenames. */
(() => {
  const routes = {
    home: "myhome.html",
    "my home": "myhome.html",
    "ai design": "ai.html",
    designers: "desinger.html",
    "designers & services": "desinger.html",
    "reuse furniture": "shop.html",
    reuse: "shop.html",
    "my projects": "myprojects.html",
    projects: "myprojects.html",
    messages: "chat.html",
    chat: "chat.html",
    profile: "setting.html",
    settings: "setting.html",
    "profile / settings": "setting.html",
    login: "login.html",
    "sign up": "signup.html",
    "create account": "signup.html",
    "get started": "signup.html",
    "get started free": "signup.html",
    "create your free account": "signup.html",
    "start designing today": "room-details.html",
    "try ai design free": "ai.html",
    "ai design": "ai.html",
    "find a designer": "desinger.html",
    "browse all designers": "desinger.html",
    "browse designers": "desinger.html",
    "browse furniture": "shop.html",
    "shop furniture": "shop.html",
    "view profile": "profile.html",
    "request service": "chat.html",
    "contact": "chat.html"
  };
  const norm = value => (value || "").replace(/\s+/g, " ").trim().toLowerCase();

  // Fix all placeholder navbar links and route by their visible label.
  document.querySelectorAll("nav a, header a.brand, .back-link").forEach(a => {
    const label = norm(a.innerText || a.textContent);
    if (routes[label]) a.href = routes[label];
    if (a.getAttribute("href") === "#") {
      if (label.includes("myspace")) a.href = "index.html";
      else if (routes[label]) a.href = routes[label];
    }
  });

  // Buttons that were previously visual-only or showed a demo toast now navigate.
  document.querySelectorAll("[data-demo]").forEach(button => {
    const label = norm(button.dataset.demo || button.textContent);
    if (routes[label]) button.addEventListener("click", () => location.href = routes[label]);
  });

  // Header action icons are shared across pages.
  document.querySelectorAll(
    "#avatarButton, #navAvatar, #userAvatar, .avatar, .user-avatar, [aria-label='Profile'], [aria-label='User profile'], [aria-label='Open profile settings']"
  ).forEach(button => {
    if (button.tagName === "A") return;
    button.addEventListener("click", () => location.href = "setting.html");
  });
  document.querySelectorAll(
    ".message-button, .message-shortcut, [aria-label='Messages'], [title='Messages']"
  ).forEach(button => {
    button.addEventListener("click", event => {
      if (button.tagName === "A") return;
      event.preventDefault();
      location.href = "chat.html";
    });
  });

  // Ensure the app can always return to the landing page on brand click.
  document.querySelectorAll("a.brand, a.logo").forEach(a => {
    if (!a.closest(".site-header")) a.href = "index.html";
  });

  // Central logout behavior: clear demo session and return to the landing page.
  document.querySelectorAll(
    "#logoutButton, #logoutBtn, #navLogout, #sideLogout, .logout, .logout-btn"
  ).forEach(button => {
    button.addEventListener("click", event => {
      event.preventDefault();
      localStorage.removeItem("myspace_current_user");
      location.href = "index.html";
    });
  });

  // Room details -> AI design / budget placeholder route (budget section stored locally).
  const aiButton = document.getElementById("aiDesignBtn");
  if (aiButton) aiButton.addEventListener("click", () => {
    // The page's own handler saves room data and navigates to ai.html.
  });
})();


/* Shared signed-in navigation identity and actions across every MySpace page. */
(() => {
  const readUser = () => {
    try { return JSON.parse(localStorage.getItem("myspace_current_user") || "null"); }
    catch (_) { return null; }
  };
  const user = readUser();
  const displayName = (user && (user.name || user.fullName || user.username)) || "";
  const firstInitial = displayName.trim().charAt(0).toUpperCase() || "U";

  document.querySelectorAll(
    "#avatarButton, #navAvatar, #userAvatar, .avatar, .user-avatar, .nav-user .avatar, .nav-actions .avatar"
  ).forEach(el => {
    el.textContent = firstInitial;
    el.setAttribute("aria-label", displayName ? `${displayName} profile` : "User profile");
    el.setAttribute("title", displayName || "User profile");
  });

  document.querySelectorAll(".message-button, .message-shortcut, [aria-label='Messages'], [title='Messages']").forEach(el => {
    if (el.tagName === "A") el.href = "chat.html";
    else el.setAttribute("type", "button");
  });

  document.querySelectorAll("#logoutButton, #logoutBtn, #navLogout, #sideLogout, .logout, .logout-btn").forEach(el => {
    el.addEventListener("click", event => {
      event.preventDefault();
      localStorage.removeItem("myspace_current_user");
      location.href = "index.html";
    });
  });
})();
