const furnitureItems = [
  { id: 1, name: 'L-Shaped Sofa', mode: 'Exchange', category: 'Sofa', price: 280, priceLabel: 'JD 280', condition: 'Like New', city: 'Amman', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85', description: 'A comfortable teal sofa in excellent condition, ready for a new home.' },
  { id: 2, name: 'King Bed Frame', mode: 'Reuse', category: 'Bed', price: 120, priceLabel: 'JD 120', condition: 'Good', city: 'Irbid', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85', description: 'A modern king-size bed frame available for reuse.' },
  { id: 3, name: 'Dining Table Set', mode: 'Borrow', category: 'Table', price: 0, priceLabel: 'Free', condition: 'Like New', city: 'Amman', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85', description: 'Dining table and chairs available to borrow from the community.' },
  { id: 4, name: 'Study Desk', mode: 'Exchange', category: 'Desk', price: 60, priceLabel: 'JD 60', condition: 'Good', city: 'Zarqa', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=85', description: 'A clean, minimalist desk suitable for a home office or study room.' },
  { id: 5, name: 'Wardrobe 3-door', mode: 'Reuse', category: 'Storage', price: 80, priceLabel: 'JD 80', condition: 'Fair', city: 'Amman', image: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=85', description: 'Three-door storage wardrobe with plenty of room for clothes and linens.' },
  { id: 6, name: 'Armchair Pair', mode: 'Exchange', category: 'Chair', price: 150, priceLabel: 'JD 150', condition: 'Like New', city: 'Irbid', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=85', description: 'A pair of comfortable armchairs available for exchange.' }
];

// Restore community listings created through the full Post Furniture page.
try {
  const savedPosts = JSON.parse(localStorage.getItem('mySpaceFurniturePosts') || '[]');
  savedPosts.forEach((post, index) => {
    if (!furnitureItems.some(item => item.name === (post.title || post.name))) {
      furnitureItems.push({
        id: 1000 + index, name: post.title || post.name, mode: post.mode || 'Reuse',
        category: post.category || 'Other', price: Number(post.price || 0),
        priceLabel: Number(post.price || 0) === 0 ? 'Free' : 'JD ' + Number(post.price).toLocaleString('en-US'),
        condition: post.condition || 'Good', city: post.city || 'Community',
        image: post.image || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
        description: post.description || 'Community furniture listing.'
      });
    }
  });
} catch (_) {}
const grid = document.getElementById('furnitureGrid');
const searchInput = document.getElementById('searchInput');
const emptyState = document.getElementById('emptyState');
const modeButtons = [...document.querySelectorAll('.mode')];
const categoryButtons = [...document.querySelectorAll('.category')];
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
let activeMode = 'All';
let activeCategory = 'All';

function renderFurniture() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleItems = furnitureItems.filter(item => {
    const matchesMode = activeMode === 'All' || item.mode === activeMode;
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = [item.name, item.mode, item.category, item.city, item.condition].join(' ').toLowerCase().includes(query);
    return matchesMode && matchesCategory && matchesSearch;
  });

  grid.innerHTML = visibleItems.map(item => `
    <article class="furniture-card">
      <div class="furniture-photo">
        <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=85';">
        <span class="mode-badge ${item.mode.toLowerCase()}">${item.mode}</span>
      </div>
      <div class="furniture-body">
        <div class="furniture-heading"><h2>${item.name}</h2><span class="price">${item.priceLabel}</span></div>
        <div class="furniture-meta"><span class="condition">${item.condition}</span><span class="location">${item.city}</span></div>
        <button class="request-button" data-item-id="${item.id}">Request ${item.mode}</button>
      </div>
    </article>
  `).join('');
  emptyState.hidden = visibleItems.length > 0;
}

modeButtons.forEach(button => button.addEventListener('click', () => {
  activeMode = button.dataset.mode;
  modeButtons.forEach(item => item.classList.toggle('active', item === button));
  renderFurniture();
}));
categoryButtons.forEach(button => button.addEventListener('click', () => {
  activeCategory = button.dataset.category;
  categoryButtons.forEach(item => item.classList.toggle('active', item === button));
  renderFurniture();
}));
searchInput.addEventListener('input', renderFurniture);

function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  modalBackdrop.hidden = false;
  document.getElementById('modalClose').focus();
}
function closeModal() { modalBackdrop.hidden = true; }

grid.addEventListener('click', event => {
  const button = event.target.closest('[data-item-id]');
  if (!button) return;
  const item = furnitureItems.find(entry => entry.id === Number(button.dataset.itemId));
  if (!item) return;
  localStorage.setItem('mySpaceSelectedReuseItem', JSON.stringify(item));
  location.href = 'request-reuse.html';
});

document.getElementById('postFurnitureButton').addEventListener('click', () => {
  location.href = 'post-furniture.html';
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.getElementById('avatarButton').addEventListener('click', () => {
  openModal('My Profile', '<p>Connect this profile button to your account page.</p>');
});
document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  openModal('Logged out', '<p>Your local demo session has been cleared. Connect this button to your login page if needed.</p>');
});

renderFurniture();