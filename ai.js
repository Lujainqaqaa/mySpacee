const statusMessage = document.getElementById('statusMessage');

document.getElementById('saveButton').addEventListener('click', () => {
  const design = {
    title: 'Living Room Design',
    concept: 'Nordic Warmth',
    style: 'Scandinavian',
    roomType: 'Living Room',
    size: '28 m²',
    budget: 'JD 15,000',
    savedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem('mySpaceSavedDesign', JSON.stringify(design));
    statusMessage.textContent = 'Design saved successfully!';
  } catch (error) {
    statusMessage.textContent = 'Unable to save in this browser.';
  }
});

document.getElementById('regenerateButton').addEventListener('click', () => {
  statusMessage.textContent = 'Your preferences are ready for a new design.';
  // Connect this button to your AI/design generation endpoint if your project has one.
});

document.getElementById('designerButton').addEventListener('click', () => {
  location.href = 'desinger.html';
});

document.getElementById('shopButton').addEventListener('click', () => {
  location.href = 'shop.html';
});

document.getElementById('avatarButton').addEventListener('click', () => {
  statusMessage.textContent = 'Profile menu selected.';
});

document.getElementById('logoutButton').addEventListener('click', () => {
  // Remove this line if your project uses a different session key.
  localStorage.removeItem('loggedInUser');
  statusMessage.textContent = 'You have been logged out.';
});
// Upload a room photo from the user's device and preview it before sending to the AI workflow.
const roomImageInput = document.getElementById('roomImageInput');
const roomUploadPreview = document.getElementById('roomUploadPreview');
const uploadedRoomImage = document.getElementById('uploadedRoomImage');
const uploadFeedback = document.getElementById('uploadFeedback');
let uploadedRoomData = '';
if (roomImageInput) {
  roomImageInput.addEventListener('change', () => {
    const file = roomImageInput.files && roomImageInput.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { uploadFeedback.textContent = 'Please choose an image file.'; return; }
    if (file.size > 8 * 1024 * 1024) { uploadFeedback.textContent = 'Please choose an image smaller than 8 MB.'; roomImageInput.value = ''; return; }
    const reader = new FileReader();
    reader.onload = () => {
      uploadedRoomData = String(reader.result || '');
      uploadedRoomImage.src = uploadedRoomData;
      roomUploadPreview.hidden = false;
      uploadFeedback.textContent = 'Room photo added. It will be included with your saved design.';
      try { localStorage.setItem('mySpaceUploadedRoomImage', uploadedRoomData); } catch (_) { uploadFeedback.textContent = 'Image preview loaded. This image is too large to store in browser storage.'; }
    };
    reader.readAsDataURL(file);
  });
  document.getElementById('removeRoomImage').addEventListener('click', () => {
    uploadedRoomData = ''; roomImageInput.value = ''; uploadedRoomImage.removeAttribute('src');
    roomUploadPreview.hidden = true; uploadFeedback.textContent = 'Room photo removed.';
    localStorage.removeItem('mySpaceUploadedRoomImage');
  });
  try {
    const savedImage = localStorage.getItem('mySpaceUploadedRoomImage');
    if (savedImage) { uploadedRoomData = savedImage; uploadedRoomImage.src = savedImage; roomUploadPreview.hidden = false; uploadFeedback.textContent = 'Previously selected room photo restored.'; }
  } catch (_) {}
}
