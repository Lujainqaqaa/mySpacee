const providers = [
  { id: 1, name: 'Nour Design Studio', role: 'Interior Designer', city: 'Amman', price: 45, rating: 4.9, reviews: 87, tags: ['Modern', 'Minimal'], category: 'Interior Designers', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85', bio: 'Interior designer focused on calm, modern living spaces and thoughtful layouts.' },
  { id: 2, name: 'Craft & Care', role: 'Furniture Maker', city: 'Irbid', price: 30, rating: 4.8, reviews: 62, tags: ['Custom', 'Wood'], category: 'Furniture Makers', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85', bio: 'Custom furniture maker specializing in natural wood and made-to-measure pieces.' },
  { id: 3, name: 'Studio Terra', role: 'Lighting Expert', city: 'Amman', price: 40, rating: 5.0, reviews: 44, tags: ['Ambient', 'Smart'], category: 'Lighting', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=700&q=85', bio: 'Lighting consultant for warm, layered, energy-conscious residential spaces.' },
  { id: 4, name: 'Rana Odeh', role: 'Interior Designer', city: 'Irbid', price: 42, rating: 4.7, reviews: 118, tags: ['Classic', 'Luxury'], category: 'Interior Designers', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85', bio: 'Interior designer creating elegant classic rooms with luxurious finishes.' },
  { id: 5, name: 'BrightFix', role: 'Carpenter', city: 'Zarqa', price: 28, rating: 4.9, reviews: 53, tags: ['Built-in', 'Custom'], category: 'Carpentry', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85', bio: 'Carpenter specializing in fitted storage, shelves, and custom woodwork.' },
  { id: 6, name: 'Mira Interiors', role: 'Curtains & Textiles', city: 'Zarqa', price: 25, rating: 4.8, reviews: 39, tags: ['Luxury', 'Handmade'], category: 'Curtains', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85', bio: 'Textile specialist offering curtains and soft furnishings tailored to your room.' }
];

const grid = document.getElementById('providerGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const emptyState = document.getElementById('emptyState');
const categoryButtons = [...document.querySelectorAll('.category')];
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
let activeCategory = 'All';

function renderProviders() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = providers.filter(provider => {
    const matchesCategory = activeCategory === 'All' || provider.category === activeCategory ||
      (activeCategory === 'Decoration' && provider.tags.some(tag => ['Luxury', 'Modern', 'Minimal'].includes(tag)));
    const searchable = [provider.name, provider.role, provider.city, provider.category, ...provider.tags].join(' ').toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  switch (sortSelect.value) {
    case 'price-low': visible.sort((a, b) => a.price - b.price); break;
    case 'price-high': visible.sort((a, b) => b.price - a.price); break;
    case 'name': visible.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: visible.sort((a, b) => b.rating - a.rating);
  }

  grid.innerHTML = visible.map(provider => `
    <article class="provider-card">
      <div class="card-photo">
        <img src="${provider.image}" alt="Portrait of ${provider.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=700&q=85';">
        <span class="provider-avatar" aria-hidden="true">${provider.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</span>
        <span class="hourly-rate">JD ${provider.price}/hr</span>
      </div>
      <div class="card-body">
        <h2 class="provider-name">${provider.name}</h2>
        <p class="provider-role">${provider.role} · ${provider.city}</p>
        <div class="rating"><span class="stars" aria-label="5 stars">★★★★★</span><span>${provider.rating.toFixed(1)} (${provider.reviews} reviews)</span></div>
        <div class="tags">${provider.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        <div class="card-actions">
          <button class="button button-outline" data-action="profile" data-id="${provider.id}">View Profile</button>
          <button class="button button-primary" data-action="contact" data-id="${provider.id}">Contact</button>
        </div>
      </div>
    </article>
  `).join('');

  emptyState.hidden = visible.length > 0;
}

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    categoryButtons.forEach(item => item.classList.toggle('active', item === button));
    renderProviders();
  });
});
searchInput.addEventListener('input', renderProviders);
sortSelect.addEventListener('change', renderProviders);

grid.addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const provider = providers.find(item => item.id === Number(button.dataset.id));
  if (!provider) return;
  localStorage.setItem('myspace_selected_provider', JSON.stringify(provider));
  if (button.dataset.action === 'profile') {
    location.href = 'profile.html';
  } else if (button.dataset.action === 'contact') {
    location.href = 'chat.html';
  }
});

function closeModal() { modalBackdrop.hidden = true; }
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOk').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.getElementById('avatarButton').addEventListener('click', () => {
  location.href = 'setting.html';
});
document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('myspace_current_user');
  location.href = 'index.html';
});