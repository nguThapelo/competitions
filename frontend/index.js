const API_URL = 'http://localhost:3000/api/competitions';

const competitionsList = document.getElementById('competitionsList');
const filtersDiv = document.getElementById('filters');
const addCompetitionBtn = document.getElementById('addCompetitionBtn');
const competitionModal = new bootstrap.Modal(document.getElementById('competitionModal'));
const competitionForm = document.getElementById('competitionForm');
const modalTitle = document.getElementById('modalTitle');
const deleteCompetitionBtn = document.getElementById('deleteCompetitionBtn');

let competitions = [];
let currentCompetitionId = null;

async function fetchCompetitions(category = 'All') {
  const url = category === 'All' ? API_URL : `${API_URL}?category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  competitions = await res.json();
  displayCompetitions(competitions);
  initializeFilters();
}

function displayCompetitions(comps) {
  competitionsList.innerHTML = '';
  comps.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.name}</td>
      <td>${c.category}</td>
      <td>${new Date(c.start_date).toLocaleDateString()} - ${new Date(c.end_date).toLocaleDateString()}</td>
      <td>${c.description.length > 50 ? c.description.substring(0, 50) + '...' : c.description}</td>
      <td>
        <button class="btn btn-primary btn-sm me-2" data-id="${c.id}">Edit</button>
      </td>
    `;
    competitionsList.appendChild(tr);

    tr.querySelector('button').addEventListener('click', () => openEditModal(c));
  });
}

async function getCategories() {
  const res = await fetch(API_URL);
  const allComps = await res.json();
  const cats = new Set(allComps.map(c => c.category));
  return ['All', ...cats];
}

async function initializeFilters() {
  filtersDiv.innerHTML = '';
  const categories = await getCategories();
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'btn btn-outline-primary category-btn';
    btn.type = 'button';
    btn.addEventListener('click', () => fetchCompetitions(cat));
    filtersDiv.appendChild(btn);
  });
}

function openEditModal(comp) {
  currentCompetitionId = comp.id;
  modalTitle.textContent = 'Edit Competition';
  deleteCompetitionBtn.style.display = 'inline-block';

  document.getElementById('compId').value = comp.id;
  document.getElementById('compName').value = comp.name;
  document.getElementById('compCategory').value = comp.category;
  document.getElementById('startDate').value = comp.start_date;
  document.getElementById('endDate').value = comp.end_date;
  document.getElementById('compDescription').value = comp.description;

  competitionModal.show();
}

function openAddModal() {
  currentCompetitionId = null;
  modalTitle.textContent = 'Add Competition';
  deleteCompetitionBtn.style.display = 'none';

  competitionForm.reset();
  competitionModal.show();
}

addCompetitionBtn.addEventListener('click', openAddModal);

competitionForm.addEventListener('submit', async e => {
  e.preventDefault();
  const compData = {
    name: document.getElementById('compName').value,
    category: document.getElementById('compCategory').value,
    start_date: document.getElementById('startDate').value,
    end_date: document.getElementById('endDate').value,
    description: document.getElementById('compDescription').value
  };

  if (currentCompetitionId) {
    // Update
    await fetch(`${API_URL}/${currentCompetitionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compData)
    });
  } else {
    // Add new
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compData)
    });
  }
  competitionModal.hide();
  fetchCompetitions();
});

deleteCompetitionBtn.addEventListener('click', async () => {
  if (!currentCompetitionId) return;
  await fetch(`${API_URL}/${currentCompetitionId}`, { method: 'DELETE' });
  competitionModal.hide();
  fetchCompetitions();
});

window.onload = () => {
  fetchCompetitions();
};
