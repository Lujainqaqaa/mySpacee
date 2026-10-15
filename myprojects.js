const defaultProjects = [
  { id: 1, name: 'Living Room', designer: 'Nour Design Studio', budget: 850, spent: 560, started: 'Oct 05, 2026', progress: 65, status: 'In Progress', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=85', description: 'A Scandinavian-inspired living room with warm ivory tones, natural textures, and comfortable seating.' },
  { id: 2, name: 'Master Bedroom', designer: 'Rana Odeh', budget: 620, spent: 180, started: 'Oct 06, 2026', progress: 20, status: 'Planning', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85', description: 'A calm, modern master bedroom with soft neutral colors and layered lighting.' },
  { id: 3, name: 'Kitchen', designer: 'Self-managed', budget: 480, spent: 420, started: 'Oct 08, 2026', progress: 88, status: 'Near Complete', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1000&q=85', description: 'A practical kitchen renovation focused on clean lines, storage, and durable finishes.' },
  { id: 4, name: 'Home Office', designer: 'Studio Terra', budget: 720, spent: 690, started: 'Oct 10, 2026', progress: 100, status: 'Completed', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=85', description: 'A completed home office project with a contemporary look and functional work areas.' }
];
const sharedPlatform = (() => { try { return JSON.parse(localStorage.getItem('myspace_platform_data') || 'null'); } catch (_) { return null; } })();
const projects = sharedPlatform && Array.isArray(sharedPlatform.projects) && sharedPlatform.projects.length
  ? sharedPlatform.projects.map((item, index) => ({
      id: index + 1, name: item.name, designer: item.owner, budget: Number(item.budget || 0),
      spent: Math.round(Number(item.budget || 0) * 0.62), started: item.date || '2026-10-01',
      progress: item.status === 'Completed' ? 100 : item.status === 'Review' ? 85 : 45,
      status: item.status === 'Completed' ? 'Completed' : item.status === 'Review' ? 'Near Complete' : 'In Progress',
      image: defaultProjects[index % defaultProjects.length].image, description: 'MySpace room design project managed through the shared platform records.'
    })) : defaultProjects;

const projectsList = document.getElementById('projectsList');
const money = amount => 'JD ' + amount.toLocaleString('en-US');
const statusClass = status => ({
  'In Progress': 'progress',
  'Planning': 'planning',
  'Near Complete': 'near-complete',
  'Completed': 'completed'
}[status] || '');

function renderProjects() {
  projectsList.innerHTML = projects.map(project => `
    <article class="project-card">
      <div class="project-image"><img src="${project.image}" alt="${project.name}" loading="lazy" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85';"></div>
      <div class="project-info">
        <div class="project-topline">
          <div class="project-title-area">
            <h2 class="project-title">${project.name}</h2>
            <p class="designer">Designer: ${project.designer}</p>
          </div>
          <div class="project-actions">
            <span class="status ${statusClass(project.status)}">${project.status}</span>
            <button class="button" data-view-project="${project.id}">View Project</button>
          </div>
        </div>
        <div class="project-metrics">
          <span>Budget: ${money(project.budget)}</span>
          <span>Spent: ${money(project.spent)}</span>
          <span>Started: ${project.started}</span>
        </div>
        <div class="progress-header"><span>Progress</span><strong>${project.progress}%</strong></div>
        <div class="progress-track" role="progressbar" aria-label="${project.name} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${project.progress}">
          <div class="progress-fill ${project.status === 'Completed' ? 'done' : ''}" style="width:${project.progress}%"></div>
        </div>
      </div>
    </article>
  `).join('');

  const active = projects.filter(project => project.status !== 'Completed');
  const completed = projects.filter(project => project.status === 'Completed');
  const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
  const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
  document.getElementById('activeCount').textContent = active.length;
  document.getElementById('completedCount').textContent = completed.length;
  document.getElementById('totalBudget').textContent = 'JD ' + (totalBudget / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'K';
  document.getElementById('totalSpent').textContent = 'JD ' + (totalSpent / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'K';
}

const backdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
function openModal(title, content) {
  modalTitle.textContent = title;
  modalContent.innerHTML = content;
  backdrop.hidden = false;
}
function closeModal() { backdrop.hidden = true; }

projectsList.addEventListener('click', event => {
  const button = event.target.closest('[data-view-project]');
  if (!button) return;
  const project = projects.find(item => item.id === Number(button.dataset.viewProject));
  if (!project) return;
  localStorage.setItem('myspace_selected_project', JSON.stringify(project));
  location.href = 'project-detail.html';
});

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalCancel').addEventListener('click', closeModal);
backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.getElementById('avatarButton').addEventListener('click', () => {
  openModal('My Profile', '<p>Connect this button to your profile/settings page.</p>');
});
document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  openModal('Logged out', '<p>The local demo session has been cleared. Connect this button to your login page if needed.</p>');
});

renderProjects();