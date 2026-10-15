const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");
const toast = document.querySelector(".toast");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 30);
}

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  mainNav.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    const routes = {
      "Login": "login.html",
      "Sign Up": "signup.html",
      "Get Started": "signup.html",
      "AI Design": "ai.html",
      "View Profile": "profile.html",
      "Browse Designers": "desinger.html",
      "Browse All Designers": "desinger.html",
      "Browse Furniture": "shop.html",
      "Start Designing": "room-details.html",
      "Create Account": "signup.html"
    };
    const destination = routes[button.dataset.demo];
    if (destination) {
      const isAuthenticated = (() => {
        try { return !!JSON.parse(localStorage.getItem("myspace_current_user") || "null"); }
        catch (_) { return false; }
      })();
      const authAction = ["Login", "Sign Up", "Create Account", "Get Started"].includes(button.dataset.demo);
      // Homepage actions cannot open private app pages before sign-in.
      if (!isAuthenticated && !authAction) {
        window.location.href = "login.html";
        return;
      }
      window.location.href = destination;
    }
  });
});

document.querySelector(".newsletter").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  showToast("Thank you — inspiration is on the way.");
  input.value = "";
});

document.querySelector("#year").textContent = new Date().getFullYear();