
// ===== 1. Select page elements =====
const roomsGrid = document.getElementById("roomsGrid");
const roomDialog = document.getElementById("roomDialog");
const roomForm = document.getElementById("roomForm");
const toast = document.getElementById("toast");

const STORAGE_KEY = "myspace_rooms";

// ===== 2. Initial room data =====
const defaultRooms = [
  {
    id: 1,
    name: "Living Room",
    style: "Scandinavian",
    progress: 75,
    budget: 1900,
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Master Bedroom",
    style: "Modern",
    progress: 45,
    budget: 2280,
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Kids Room",
    style: "Playful",
    progress: 20,
    budget: 1140,
    status: "Planning",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Kitchen",
    style: "Minimal",
    progress: 90,
    budget: 1520,
    status: "Near Complete",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Dining Room",
    style: "Classic",
    progress: 0,
    budget: 760,
    status: "Not Started",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Home Office",
    style: "Industrial",
    progress: 60,
    budget: 950,
    status: "In Progress",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80"
  }
];

// ===== 3. Load saved rooms =====
function loadRooms() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved !== null) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load saved rooms:", error);
  }

  return defaultRooms.map(room => ({ ...room }));
}

let rooms = loadRooms();

// ===== 4. Save room data =====
function saveRooms() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    try {
      const shared = JSON.parse(localStorage.getItem("myspace_platform_data") || "null");
      if (shared) {
        shared.projects = rooms.map((room, index) => ({
          id: "ROOM-" + room.id, name: room.name, owner: (JSON.parse(localStorage.getItem("myspace_current_user") || "{}").name || "Sara Ahmad"),
          room: room.name, budget: Number(room.budget || 0), status: room.status === "Completed" ? "Completed" : room.status === "Near Complete" ? "Review" : "In Progress",
          date: "2026-10-" + String(Math.min(28, index + 1)).padStart(2, "0")
        }));
        localStorage.setItem("myspace_platform_data", JSON.stringify(shared));
      }
    } catch (_) { /* keep the room save functional if shared demo data is unavailable */ }
  } catch (error) {
    showMessage("Could not save rooms in this browser.");
  }
}

// ===== 5. Calculate dashboard statistics =====
function updateStatistics() {
  const total = rooms.length;

  const average = total
    ? Math.round(
        rooms.reduce((sum, room) => sum + room.progress, 0) / total
      )
    : 0;

  const active = rooms.filter(room => room.progress > 0).length;

  const budget = rooms.reduce(
    (sum, room) => sum + Number(room.budget || 0),
    0
  );

  document.getElementById("overallProgress").textContent =
    `${average}%`;

  document.getElementById("overallProgressBar").style.width =
    `${average}%`;

  document.getElementById("activeRooms").textContent = active;

  document.getElementById("roomCountText").textContent =
    `of ${total} total`;

  document.getElementById("totalBudget").textContent =
    `JD ${budget.toLocaleString("en-US")}`;
}

// ===== 6. Render all room cards =====
function renderRooms() {
  roomsGrid.innerHTML = "";

  rooms.forEach(room => {
    const card = document.createElement("article");
    card.className = "room-card";

    // Build the card safely without inserting user input as HTML.
    const imageWrap = document.createElement("div");
    imageWrap.className = "room-image-wrap";

    const image = document.createElement("img");
    image.className = "room-image";
    image.src = room.image;
    image.alt = room.name;
    image.loading = "lazy";

    const status = document.createElement("span");
    status.className = "room-status";
    status.textContent = room.status;

    imageWrap.append(image, status);

    const info = document.createElement("div");
    info.className = "room-info";

    const titleRow = document.createElement("div");
    titleRow.className = "room-title-row";

    const title = document.createElement("h3");
    title.className = "room-title";
    title.textContent = room.name;

    const percent = document.createElement("span");
    percent.className = "room-percent";
    percent.textContent = `${room.progress}%`;

    titleRow.append(title, percent);

    const style = document.createElement("p");
    style.className = "room-style";
    style.textContent = room.style;

    const progress = document.createElement("div");
    progress.className = "room-progress";

    const progressFill = document.createElement("span");
    progressFill.style.width = `${room.progress}%`;
    progress.appendChild(progressFill);

    const budget = document.createElement("p");
    budget.className = "room-budget";
    budget.textContent =
      `Budget: JD ${Number(room.budget).toLocaleString("en-US")}`;

    info.append(titleRow, style, progress, budget);
    card.append(imageWrap, info);

    // Clicking a room opens its details page.
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${room.name}`);

    function openRoom() {
      window.location.href =
        `room-details.html?id=${encodeURIComponent(room.id)}`;
    }

    card.addEventListener("click", openRoom);

    card.addEventListener("keydown", event => {
      if (event.key === "Enter") openRoom();
    });

    roomsGrid.appendChild(card);
  });

  // Add room card at the end of the grid.
  const addCard = document.createElement("button");
  addCard.type = "button";
  addCard.className = "add-room-card";

  const plus = document.createElement("span");
  plus.className = "add-room-icon";
  plus.textContent = "+";

  const label = document.createElement("span");
  label.textContent = "Add New Room";

  addCard.append(plus, label);
  addCard.addEventListener("click", openRoomDialog);

  roomsGrid.appendChild(addCard);

  updateStatistics();
}

// ===== 7. Open and close the add-room dialog =====
function openRoomDialog() {
  roomForm.reset();
  document.getElementById("roomBudget").value = 5000;
  roomDialog.showModal();
}

document.getElementById("addRoomTop")
  .addEventListener("click", openRoomDialog);

document.getElementById("closeDialog")
  .addEventListener("click", () => roomDialog.close());

// ===== 8. Create a new room =====
roomForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("roomName").value.trim();
  const style = document.getElementById("roomStyle").value;
  const budget = Number(document.getElementById("roomBudget").value);

  if (!name || !Number.isFinite(budget) || budget < 0) {
    showMessage("Please enter a valid room name and budget.");
    return;
  }

  const styleImages = {
    Modern: "photo-1616486338812-3dadae4b4ace",
    Scandinavian: "photo-1555041469-a586c61ea9bc",
    Minimal: "photo-1556911220-bff31c812dba",
    Classic: "photo-1617806118233-18e1de247200",
    Industrial: "photo-1497366754035-f200968a6e72",
    Playful: "photo-1616486338812-3dadae4b4ace"
  };

  rooms.push({
    id: Date.now(),
    name,
    style,
    progress: 0,
    budget,
    status: "Not Started",
    image: `https://images.unsplash.com/${styleImages[style]}?auto=format&fit=crop&w=800&q=80`
  });

  saveRooms();
  renderRooms();
  roomDialog.close();

  showMessage(`${name} added successfully!`);
});

// ===== 9. Switch between Grid and List =====
document.getElementById("gridView").addEventListener("click", () => {
  roomsGrid.classList.remove("list-view");

  document.getElementById("gridView").classList.add("active");
  document.getElementById("listView").classList.remove("active");
});

document.getElementById("listView").addEventListener("click", () => {
  roomsGrid.classList.add("list-view");

  document.getElementById("listView").classList.add("active");
  document.getElementById("gridView").classList.remove("active");
});

// ===== 10. Mobile navigation =====
document.getElementById("mobileMenu").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

// ===== 11. Logout =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  // Clear only the MySpace demo session, not saved rooms.
  localStorage.removeItem("myspace_current_user");
  window.location.href = "login.html";
});

// ===== 12. Display a small notification =====
let toastTimer;

function showMessage(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

// ===== 13. Load the current user's name =====
function loadUser() {
  try {
    const user = JSON.parse(
      localStorage.getItem("myspace_current_user") || "null"
    );

    if (user && user.name) {
      document.getElementById("homeSubtitle").textContent =
        `${user.name}'s Home · Amman, Jordan`;

      document.getElementById("userAvatar").textContent =
        user.name
          .split(/\s+/)
          .slice(0, 2)
          .map(part => part.charAt(0).toUpperCase())
          .join("");
    }
  } catch (error) {
    console.error("Could not load user information:", error);
  }
}

// ===== 14. Initialize the dashboard =====
loadUser();
renderRooms();
