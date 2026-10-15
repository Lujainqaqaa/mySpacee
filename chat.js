/* MySpace chat: conversations are built from the complete designer/provider directory. */
const providers = [
  { id: 'layla', name: 'Layla Hassan', role: 'Interior Designer', online: true },
  { id: 'omar', name: 'Omar Al-Rashid', role: 'Furniture Maker', online: false },
  { id: 'nour', name: 'Nour Khalil', role: 'Lighting Expert', online: true },
  { id: 'fatima', name: 'Fatima Al-Zahra', role: 'Interior Designer', online: false },
  { id: 'khalid', name: 'Khalid Mansoor', role: 'Carpenter', online: false },
  { id: 'reem', name: 'Reem Al-Sayed', role: 'Curtains & Textiles', online: true }
];

const listEl = document.getElementById('conversationList');
const messagesEl = document.getElementById('messages');
const messengerEl = document.querySelector('.messenger');
const STORAGE_KEY = 'myspace_chat_conversations';

function initial(name) { return (name || 'U').trim().charAt(0).toUpperCase(); }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function loadConversations() {
  let saved = [];
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch (_) {}
  return providers.map(provider => {
    const previous = saved.find(item => item.id === provider.id);
    return previous || {
      ...provider, time: 'New', unread: 0,
      messages: [{ from: 'them', text: `Hi! I'm ${provider.name}. How can I help with your home design project?`, time: 'Welcome' }]
    };
  });
}
let conversations = loadConversations();
const selectedProvider = (() => {
  try { return JSON.parse(localStorage.getItem('myspace_selected_provider') || 'null'); }
  catch (_) { return null; }
})();
let activeConversationId = selectedProvider
  ? (providers.find(p => p.name === selectedProvider.name)?.id || 'layla')
  : 'layla';

function saveConversations() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}
function getActiveConversation() {
  return conversations.find(chat => chat.id === activeConversationId) || conversations[0];
}
function renderConversationList(filter = '') {
  const query = filter.trim().toLowerCase();
  const filtered = conversations.filter(chat =>
    chat.name.toLowerCase().includes(query) ||
    chat.role.toLowerCase().includes(query) ||
    (chat.messages.at(-1)?.text || '').toLowerCase().includes(query)
  );
  if (!filtered.length) {
    listEl.innerHTML = '<p class="empty-state">No chats found.</p>';
    return;
  }
  listEl.innerHTML = filtered.map(chat => {
    const lastMessage = chat.messages[chat.messages.length - 1]?.text || 'Start a conversation';
    return `<button class="conversation ${chat.id === activeConversationId ? 'selected' : ''}" data-chat-id="${escapeHTML(chat.id)}">
      <span class="person-avatar">${escapeHTML(initial(chat.name))}${chat.online ? '<span class="online-dot"></span>' : ''}</span>
      <span class="conversation-copy">
        <span class="conversation-name">${escapeHTML(chat.name)}</span>
        <span class="conversation-preview">${escapeHTML(lastMessage)}</span>
      </span>
      <span class="conversation-meta"><span>${escapeHTML(chat.time || '')}</span>${chat.unread ? `<span class="unread">${chat.unread}</span>` : ''}</span>
    </button>`;
  }).join('');
}
function renderMessages() {
  const chat = getActiveConversation();
  document.getElementById('activeAvatar').textContent = initial(chat.name);
  document.getElementById('activeName').textContent = chat.name;
  document.getElementById('activeStatus').textContent = `${chat.online ? 'Online' : 'Offline'} · ${chat.role}`;
  document.getElementById('activeStatus').style.color = chat.online ? 'var(--green)' : 'var(--muted)';
  messagesEl.innerHTML = chat.messages.map(message => `
    <div class="message-row ${message.from === 'me' ? 'sent' : ''}">
      <div class="bubble">${escapeHTML(message.text)}</div>
      <span class="message-time">${escapeHTML(message.time)}</span>
    </div>`).join('');
  messagesEl.scrollTop = messagesEl.scrollHeight;
}
function renderChat() {
  renderConversationList(document.getElementById('chatSearch').value);
  renderMessages();
}
function currentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
listEl.addEventListener('click', event => {
  const button = event.target.closest('[data-chat-id]');
  if (!button) return;
  activeConversationId = button.dataset.chatId;
  getActiveConversation().unread = 0;
  renderChat();
  messengerEl.classList.add('chat-open');
  saveConversations();
});
document.getElementById('chatSearch').addEventListener('input', event => renderConversationList(event.target.value));
document.getElementById('messageForm').addEventListener('submit', event => {
  event.preventDefault();
  const input = document.getElementById('messageInput');
  const messageText = input.value.trim();
  if (!messageText) return;
  const chat = getActiveConversation();
  chat.messages.push({ from: 'me', text: messageText, time: currentTime() });
  chat.time = 'now';
  input.value = '';
  saveConversations();
  renderChat();
});
renderChat();
