const STORAGE_USERS_KEY = 'myspace_users';
const CURRENT_USER_KEYS = ['myspace_current_user', 'loggedInUser', 'currentUser', 'mySpaceCurrentUser', 'user'];

const defaultUser = {
  fullName: 'Sara Ahmad',
  email: 'sara@example.com',
  phone: '+966 55 123 4567',
  location: 'Amman, Jordan',
  bio: 'Homeowner passionate about interior design and creating beautiful, functional living spaces.',
  role: 'Homeowner',
  password: '',
  notifications: { email: true, projects: true, marketing: false },
  privacy: { profileVisible: true, shareProjects: false },
  preferences: { style: 'Scandinavian', currency: 'JOD', language: 'English' }
};

function parseJSON(value) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}
function getCurrentUser() {
  for (const key of CURRENT_USER_KEYS) {
    const parsed = parseJSON(localStorage.getItem(key));
    if (parsed && typeof parsed === 'object') return { ...defaultUser, ...parsed, ...normalizeUser(parsed) };
    const raw = localStorage.getItem(key);
    if (raw && !raw.trim().startsWith('{') && !raw.trim().startsWith('[') && raw.includes('@')) {
      return { ...defaultUser, email: raw };
    }
  }

  const users = parseJSON(localStorage.getItem(STORAGE_USERS_KEY));
  if (Array.isArray(users)) {
    const activeEmail = localStorage.getItem('loggedInEmail');
    const found = users.find(user => user.email === activeEmail);
    if (found) return { ...defaultUser, ...found, ...normalizeUser(found) };
  }
  return { ...defaultUser };
}
function normalizeUser(user) {
  return {
    fullName: user.fullName || user.name || user.username || user.userName || defaultUser.fullName,
    email: user.email || user.emailAddress || defaultUser.email,
    phone: user.phone || user.phoneNumber || defaultUser.phone,
    location: user.location || user.address || defaultUser.location,
    bio: user.bio || defaultUser.bio,
    role: user.role || user.accountType || defaultUser.role
  };
}
let currentUser = getCurrentUser();
let activeSection = 'account';
let avatarDataUrl = '';
const sectionContent = document.getElementById('sectionContent');
const feedback = document.getElementById('feedback');

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}
function updateProfileHeader() {
  document.getElementById('profileDisplayName').textContent = currentUser.fullName || currentUser.name || 'User';
  document.getElementById('profileDisplayEmail').textContent = currentUser.email || '';
  document.getElementById('profileRole').textContent = currentUser.role || 'Member';
  const initial = (currentUser.fullName || currentUser.name || currentUser.email || 'U').trim().charAt(0).toUpperCase();
  const avatar = document.getElementById('profileInitial');
  if (avatarDataUrl) avatar.innerHTML = `<img src="${avatarDataUrl}" alt="Profile photo">`;
  else avatar.textContent = initial;
  document.getElementById('navAvatar').textContent = initial;
}
function inputField(label, id, value, type = 'text') {
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${escapeHTML(value)}" autocomplete="off"></div>`;
}
function renderAccount() {
  sectionContent.innerHTML = `
    <form id="accountForm">
      <div class="form-grid">
        ${inputField('Full Name', 'fullName', currentUser.fullName || currentUser.name || '')}
        ${inputField('Email Address', 'email', currentUser.email || '', 'email')}
        ${inputField('Phone Number', 'phone', currentUser.phone || currentUser.phoneNumber || '', 'tel')}
        ${inputField('Location', 'location', currentUser.location || '')}
        <div class="field full"><label for="bio">Bio</label><textarea id="bio" name="bio">${escapeHTML(currentUser.bio || '')}</textarea></div>
      </div>
      <div class="form-actions"><button class="button button-primary" type="submit">Save Changes</button></div>
    </form>`;
  document.getElementById('accountForm').addEventListener('submit', event => {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!fullName || !email) {
      feedback.style.color = '#c62828';
      feedback.textContent = 'Please enter your full name and email address.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.style.color = '#c62828';
      feedback.textContent = 'Please enter a valid email address.';
      return;
    }
    currentUser = { ...currentUser, fullName, email,
      phone: document.getElementById('phone').value.trim(),
      location: document.getElementById('location').value.trim(),
      bio: document.getElementById('bio').value.trim()
    };
    persistUser();
    updateProfileHeader();
    feedback.style.color = '#277744';
    feedback.textContent = 'Your profile changes have been saved in this browser.';
  });
}
function renderPassword() {
  sectionContent.innerHTML = `
    <h2 class="section-title">Change Password</h2>
    <p class="section-description">Choose a strong password to help protect your account.</p>
    <form id="passwordForm">
      <div class="form-grid">
        <div class="field full"><label for="currentPassword">Current Password</label><input id="currentPassword" type="password" required autocomplete="current-password"></div>
        <div class="field"><label for="newPassword">New Password</label><input id="newPassword" type="password" required minlength="6" autocomplete="new-password"></div>
        <div class="field"><label for="confirmPassword">Confirm New Password</label><input id="confirmPassword" type="password" required minlength="6" autocomplete="new-password"></div>
      </div>
      <div class="form-actions"><button class="button button-primary" type="submit">Update Password</button></div>
    </form>`;
  document.getElementById('passwordForm').addEventListener('submit', event => {
    event.preventDefault();
    const oldPass = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newPass !== confirm) return showFeedback('New passwords do not match.', true);
    if (newPass.length < 6) return showFeedback('Password must be at least 6 characters.', true);
    // This demo does not store plaintext passwords. Integrate with a secure backend for real password changes.
    if (currentUser.password && oldPass !== currentUser.password) return showFeedback('Current password does not match the saved demo value.', true);
    showFeedback('Password form validated. Connect a secure backend to change the real account password.');
    event.target.reset();
  });
}
function optionRow(title, description, id, checked) {
  return `<div class="settings-option"><div class="option-copy"><strong>${title}</strong><span>${description}</span></div><input class="toggle" id="${id}" type="checkbox" ${checked ? 'checked' : ''}></div>`;
}
function renderNotifications() {
  const settings = currentUser.notifications || defaultUser.notifications;
  sectionContent.innerHTML = `
    <h2 class="section-title">Notifications</h2>
    <p class="section-description">Choose what you would like to hear about from MySpace.</p>
    ${optionRow('Email updates', 'Receive important account updates by email.', 'emailNotifications', settings.email)}
    ${optionRow('Project activity', 'Updates when project progress or status changes.', 'projectNotifications', settings.projects)}
    ${optionRow('Tips and inspiration', 'Occasional design inspiration and product news.', 'marketingNotifications', settings.marketing)}
    <div class="form-actions"><button class="button button-primary" id="saveSettings">Save Preferences</button></div>`;
  document.getElementById('saveSettings').addEventListener('click', () => {
    currentUser.notifications = {
      email: document.getElementById('emailNotifications').checked,
      projects: document.getElementById('projectNotifications').checked,
      marketing: document.getElementById('marketingNotifications').checked
    };
    persistUser(); showFeedback('Notification preferences saved.');
  });
}
function renderPrivacy() {
  const settings = currentUser.privacy || defaultUser.privacy;
  sectionContent.innerHTML = `
    <h2 class="section-title">Privacy</h2>
    <p class="section-description">Manage how your profile and project information are shown.</p>
    ${optionRow('Visible profile', 'Allow other members to find your public profile.', 'profileVisible', settings.profileVisible)}
    ${optionRow('Share completed projects', 'Allow completed projects to appear in community inspiration.', 'shareProjects', settings.shareProjects)}
    <p class="inline-note">These settings are saved in this browser demo. A live website should enforce privacy rules on its server too.</p>
    <div class="form-actions"><button class="button button-primary" id="saveSettings">Save Privacy Settings</button></div>`;
  document.getElementById('saveSettings').addEventListener('click', () => {
    currentUser.privacy = {
      profileVisible: document.getElementById('profileVisible').checked,
      shareProjects: document.getElementById('shareProjects').checked
    };
    persistUser(); showFeedback('Privacy settings saved.');
  });
}
function renderPreferences() {
  const settings = currentUser.preferences || defaultUser.preferences;
  sectionContent.innerHTML = `
    <h2 class="section-title">Preferences</h2>
    <p class="section-description">Personalize the way MySpace looks and displays information.</p>
    <div class="form-grid">
      <div class="field"><label for="designStyle">Preferred Design Style</label><select id="designStyle">${['Scandinavian','Modern','Minimal','Classic','Industrial','Bohemian'].map(x => `<option ${settings.style === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="field"><label for="currency">Currency</label><select id="currency">${['JOD','USD','AED','EUR'].map(x => `<option ${settings.currency === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
      <div class="field"><label for="language">Language</label><select id="language">${['English','Arabic'].map(x => `<option ${settings.language === x ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <div class="form-actions"><button class="button button-primary" id="saveSettings">Save Preferences</button></div>`;
  document.getElementById('saveSettings').addEventListener('click', () => {
    currentUser.preferences = {
      style: document.getElementById('designStyle').value,
      currency: document.getElementById('currency').value,
      language: document.getElementById('language').value
    };
    persistUser(); showFeedback('Preferences saved.');
  });
}
function renderSection(section) {
  activeSection = section;
  document.querySelectorAll('.side-link[data-section]').forEach(button => button.classList.toggle('active', button.dataset.section === section));
  feedback.textContent = '';
  feedback.style.color = '';
  ({ account: renderAccount, password: renderPassword, notifications: renderNotifications, privacy: renderPrivacy, preferences: renderPreferences }[section] || renderAccount)();
}
function showFeedback(message, isError = false) {
  feedback.style.color = isError ? '#c62828' : '#277744';
  feedback.textContent = message;
}
function persistUser() {
  // Keep the signed-in user's profile consistent across Settings and every navbar.
  const savedUser = {
    ...currentUser,
    name: currentUser.fullName,
    username: currentUser.fullName,
    fullName: currentUser.fullName,
    email: currentUser.email
  };

  localStorage.setItem('myspace_current_user', JSON.stringify(savedUser));
  localStorage.setItem('mySpaceCurrentUser', JSON.stringify(savedUser));
  localStorage.setItem('loggedInEmail', currentUser.email || '');

  // Update compatible session keys only when they already exist.
  for (const key of CURRENT_USER_KEYS) {
    if (key === 'myspace_current_user' || key === 'mySpaceCurrentUser') continue;
    const stored = parseJSON(localStorage.getItem(key));
    if (stored && typeof stored === 'object') {
      localStorage.setItem(key, JSON.stringify({ ...stored, ...savedUser }));
    }
  }

  // Update the saved account record so the new name remains after the next login.
  const users = parseJSON(localStorage.getItem(STORAGE_USERS_KEY));
  if (Array.isArray(users)) {
    const updatedUsers = users.map(user =>
      (user.email || '').toLowerCase() === (currentUser.email || '').toLowerCase()
        ? { ...user, ...savedUser }
        : user
    );
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
  }
}

document.querySelectorAll('.side-link[data-section]').forEach(button => button.addEventListener('click', () => renderSection(button.dataset.section)));
document.getElementById('avatarInput').addEventListener('change', event => {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) return showFeedback('Please choose an image file.', true);
  const reader = new FileReader();
  reader.onload = () => {
    avatarDataUrl = reader.result;
    updateProfileHeader();
    showFeedback('Profile photo preview updated. Save profile photos to a backend for cross-device use.');
  };
  reader.readAsDataURL(file);
});

function openModal(title, body, buttons = []) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalContent').innerHTML = body;
  const actions = document.getElementById('modalActions');
  actions.innerHTML = '';
  if (!buttons.length) buttons = [{ label: 'Close', className: 'button button-outline', action: closeModal }];
  buttons.forEach(item => {
    const button = document.createElement('button');
    button.className = item.className || 'button button-outline';
    button.textContent = item.label;
    button.addEventListener('click', item.action);
    actions.appendChild(button);
  });
  document.getElementById('modalBackdrop').hidden = false;
}
function closeModal() { document.getElementById('modalBackdrop').hidden = true; }

function logout() {
  // Keep profile data; remove only common session keys.
  ['myspace_current_user', 'loggedInUser', 'currentUser', 'mySpaceCurrentUser', 'user', 'loggedInEmail'].forEach(key => localStorage.removeItem(key));
  openModal('Logged out', '<p>Your local demo session has been cleared. Connect this action to your login page.</p>');
}
document.getElementById('navLogout').addEventListener('click', logout);
document.getElementById('sideLogout').addEventListener('click', logout);
document.getElementById('navAvatar').addEventListener('click', () => renderSection('account'));
document.getElementById('deleteAccount').addEventListener('click', () => {
  openModal('Delete Account?', '<p>This demo action removes the saved MySpace profile data from this browser. This cannot delete a real server account.</p>', [
    { label: 'Cancel', className: 'button button-outline', action: closeModal },
    { label: 'Delete Local Data', className: 'button button-primary', action: () => {
      CURRENT_USER_KEYS.forEach(key => localStorage.removeItem(key));
      localStorage.removeItem(STORAGE_USERS_KEY);
      localStorage.removeItem('loggedInEmail');
      currentUser = { ...defaultUser, fullName: 'User', email: '' };
      updateProfileHeader();
      closeModal();
      renderSection('account');
      showFeedback('Local demo profile data deleted.');
    }}
  ]);
});
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
document.getElementById('modalBackdrop').addEventListener('click', event => {
  if (event.target.id === 'modalBackdrop') closeModal();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

updateProfileHeader();
renderSection('account');