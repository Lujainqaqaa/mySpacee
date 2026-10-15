/* MySpace authentication guard.
   Demo session is created by Login or Sign Up and stored in localStorage. */
(() => {
  const readUser = () => {
    try { return JSON.parse(localStorage.getItem("myspace_current_user") || "null"); }
    catch (_) { return null; }
  };

  const user = readUser();
  const currentFile = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const publicPages = ["index.html", "login.html", "signup.html"];

  // Prevent direct URL access to app pages before login.
  if (!user && !publicPages.includes(currentFile)) {
    location.replace("login.html");
    return;
  }

  // If logged in, protect internal page links and actions on all protected pages.
  if (user) return;
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = (link.getAttribute("href") || "").trim();
      if (/^(ai|myhome|desinger|shop|myprojects|profile|setting|chat|room-details)\.html(?:$|[?#])/i.test(href)) {
        link.href = "login.html";
      }
    });
  });
})();
