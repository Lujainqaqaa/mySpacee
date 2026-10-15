
// ===== 1. Page elements =====
const form = document.getElementById("roomDetailsForm");
const roomPhoto = document.getElementById("roomPhoto");
const photoPreview = document.getElementById("photoPreview");
const uploadContent = document.getElementById("uploadContent");
const removePhotoButton = document.getElementById("removePhoto");
const formMessage = document.getElementById("formMessage");

const STORAGE_KEY = "myspace_rooms";
const params = new URLSearchParams(window.location.search);
const roomId = params.get("id");

// ===== 2. Load saved rooms =====
function loadRooms() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load rooms:", error);
    return [];
  }
}

let rooms = loadRooms();
let room = rooms.find(item => String(item.id) === String(roomId));

// Create a default room if the URL ID does not exist.
if (!room) {
  room = {
    id: roomId || String(Date.now()),
    name: "Living Room",
    style: "Scandinavian",
    progress: 0,
    budget: 2850,
    status: "Not Started",
    image: "",
    details: {}
  };

  rooms.push(room);
}

room.details = room.details || {};

let selectedStyle = room.details.style || room.style || "Scandinavian";
let selectedColors = room.details.colors || ["Ivory"];
let selectedFurniture = room.details.furniture || ["Sofa / Seating"];
let uploadedPhoto = room.details.photo || "";

// ===== 3. Display saved room information =====
function loadRoomDetails() {
  document.getElementById("pageTitle").textContent =
    `${room.name} Details`;

  document.getElementById("roomType").value =
    room.name || "Living Room";

  document.getElementById("roomBudget").value =
    room.budget ?? 2850;

  document.getElementById("roomSize").value =
    room.details.size || "";

  document.getElementById("lighting").value =
    room.details.lighting || "Warm ambient";

  updateChoices("styleChoices", [selectedStyle]);
  updateChoices("colorChoices", selectedColors);
  updateChoices("furnitureChoices", selectedFurniture);

  if (uploadedPhoto) {
    showPhoto(uploadedPhoto);
  }

  // Display saved user initials when available.
  try {
    const user = JSON.parse(
      localStorage.getItem("myspace_current_user") || "null"
    );

    if (user && user.name) {
      document.getElementById("userAvatar").textContent =
        user.name
          .split(/\s+/)
          .slice(0, 2)
          .map(part => part[0].toUpperCase())
          .join("");
    }
  } catch (error) {
    console.error("Could not load user:", error);
  }
}

// ===== 4. Update selected choices =====
function updateChoices(groupId, values) {
  const group = document.getElementById(groupId);

  group.querySelectorAll(".choice").forEach(button => {
    const selected = values.includes(button.dataset.value);

    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
}

// Select one preferred style.
document.querySelectorAll("#styleChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    selectedStyle = button.dataset.value;
    updateChoices("styleChoices", [selectedStyle]);
  });
});

// Select multiple colors.
document.querySelectorAll("#colorChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    selectedColors = selectedColors.includes(value)
      ? selectedColors.filter(color => color !== value)
      : [...selectedColors, value];

    updateChoices("colorChoices", selectedColors);
  });
});

// Select multiple furniture needs.
document.querySelectorAll("#furnitureChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    selectedFurniture = selectedFurniture.includes(value)
      ? selectedFurniture.filter(item => item !== value)
      : [...selectedFurniture, value];

    updateChoices("furnitureChoices", selectedFurniture);
  });
});

// ===== 5. Upload and preview the room photo =====
function showPhoto(source) {
  photoPreview.src = source;
  photoPreview.hidden = false;
  uploadContent.hidden = true;
  removePhotoButton.hidden = false;
}

roomPhoto.addEventListener("change", () => {
  const file = roomPhoto.files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    showMessage("Please select a JPG, PNG, or WebP image.");
    roomPhoto.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    showMessage("Please select an image smaller than 2MB.");
    roomPhoto.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    uploadedPhoto = reader.result;
    showPhoto(uploadedPhoto);
    showMessage("Photo uploaded successfully.", true);
  };

  reader.onerror = () => {
    showMessage("Could not read this image.");
  };

  reader.readAsDataURL(file);
});

// Remove uploaded photo.
removePhotoButton.addEventListener("click", () => {
  uploadedPhoto = "";
  roomPhoto.value = "";
  photoPreview.removeAttribute("src");
  photoPreview.hidden = true;
  uploadContent.hidden = false;
  removePhotoButton.hidden = true;
});

// ===== 6. Save room details =====
function saveRoomDetails() {
  const roomType = document.getElementById("roomType").value;
  const roomSizeValue = document.getElementById("roomSize").value;
  const roomSize = Number(roomSizeValue);
  const budget = Number(document.getElementById("roomBudget").value);
  const lighting = document.getElementById("lighting").value;

  if (!Number.isFinite(budget) || budget < 0) {
    showMessage("Please enter a valid budget.");
    return false;
  }

  if (
    roomSizeValue &&
    (!Number.isFinite(roomSize) || roomSize <= 0)
  ) {
    showMessage("Please enter a valid room size.");
    return false;
  }

  room.name = roomType;
  room.style = selectedStyle;
  room.budget = budget;
  room.image = uploadedPhoto || room.image || "";

  room.details = {
    ...room.details,
    size: roomSizeValue ? roomSize : "",
    style: selectedStyle,
    colors: [...selectedColors],
    lighting,
    furniture: [...selectedFurniture],
    photo: uploadedPhoto
  };

  const existingIndex = rooms.findIndex(
    item => String(item.id) === String(room.id)
  );

  if (existingIndex >= 0) {
    rooms[existingIndex] = room;
  } else {
    rooms.push(room);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
    showMessage("Room details saved successfully.", true);
    return true;
  } catch (error) {
    console.error("Could not save room:", error);
    showMessage("Storage is full. Try removing the photo.");
    return false;
  }
}

// Save button.
form.addEventListener("submit", event => {
  event.preventDefault();

  if (saveRoomDetails()) {
    setTimeout(() => {
      window.location.href = "myhome.html";
    }, 700);
  }
});

// ===== 7. Navigate to AI Design =====
document.getElementById("aiDesignBtn").addEventListener("click", () => {
  if (!saveRoomDetails()) return;

  setTimeout(() => {
    window.location.href =
      `ai.html?id=${encodeURIComponent(room.id)}`;
  }, 500);
});

// ===== 8. Mobile navigation =====
document.getElementById("mobileMenu").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});

// ===== 9. Logout =====
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("myspace_current_user");
  window.location.href = "login.html";
});

// ===== 10. Display messages =====
let messageTimer;

function showMessage(message, success = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle("success", success);

  clearTimeout(messageTimer);

  messageTimer = setTimeout(() => {
    formMessage.textContent = "";
    formMessage.classList.remove("success");
  }, 3500);
}

// ===== 11. Initialize page =====
loadRoomDetails();
