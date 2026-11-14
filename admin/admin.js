/**
 * Pabitra Lenka Portfolio - Admin Dashboard Controller
 */
import { dataStore, DEFAULT_DATA } from '../components/dataStore.js';

// State
let currentTab = 'overview';
let activeModalType = null; // 'web' | 'ai' | 'python' | 'photos' | 'friends' | 'tech'
let editingIndex = -1;

// Elements
const authGateOverlay = document.getElementById('authGateOverlay');
const authPasscodeInput = document.getElementById('authPasscodeInput');
const btnUnlock = document.getElementById('btnUnlock');
const btnLockSession = document.getElementById('btnLockSession');
const toastContainer = document.getElementById('toastContainer');
const projectModalOverlay = document.getElementById('projectModalOverlay');
const projectModalForm = document.getElementById('projectModalForm');
const projectModalTitle = document.getElementById('projectModalTitle');

// --- AUTHENTICATION GATE ---
function checkAuth() {
  const isUnlocked = sessionStorage.getItem('portfolio_admin_unlocked') === 'true';
  if (isUnlocked) {
    authGateOverlay.classList.remove('active');
  } else {
    authGateOverlay.classList.add('active');
    authPasscodeInput.focus();
  }
}

function handleUnlock() {
  const entered = authPasscodeInput.value.trim();
  const valid = dataStore.getPasscode();
  if (entered === valid) {
    sessionStorage.setItem('portfolio_admin_unlocked', 'true');
    authGateOverlay.classList.remove('active');
    showToast('Dashboard unlocked successfully!', 'success');
    initDashboard();
  } else {
    showToast('Invalid passcode. Default is admin123', 'error');
    authPasscodeInput.value = '';
    authPasscodeInput.focus();
  }
}

btnUnlock.addEventListener('click', handleUnlock);
authPasscodeInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleUnlock();
});

btnLockSession.addEventListener('click', () => {
  sessionStorage.removeItem('portfolio_admin_unlocked');
  checkAuth();
  showToast('Session locked.', 'success');
});

// --- TOAST NOTIFICATIONS ---
export function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✓' : '⚠️'}</span>
    <span>${message}</span>
  `;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- TAB SWITCHING ---
window.switchTab = function (tabName) {
  currentTab = tabName;
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.tab === tabName);
  });
  document.querySelectorAll('.tab-pane').forEach((pane) => {
    pane.style.display = pane.id === `pane-${tabName}` ? 'block' : 'none';
  });

  // Load corresponding data
  if (tabName === 'overview') updateOverview();
  else if (tabName === 'profile') loadProfile();
  else if (tabName === 'web') renderWebProjects();
  else if (tabName === 'ai') renderAIProjects();
  else if (tabName === 'python') renderPythonProjects();
  else if (tabName === 'photos') renderPhotos();
  else if (tabName === 'friends') renderFriends();
  else if (tabName === 'tech') renderTech();
  else if (tabName === 'supabase') loadSupabaseTab();
};

document.querySelectorAll('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.tab) switchTab(btn.dataset.tab);
  });
});

// --- OVERVIEW TAB ---
async function updateOverview() {
  const web = await dataStore.getCollection('web_projects');
  const ai = await dataStore.getCollection('ai_projects');
  const py = await dataStore.getCollection('python_projects');
  const ph = await dataStore.getCollection('photos');

  document.getElementById('statWebCount').textContent = web ? web.length : 0;
  document.getElementById('statAICount').textContent = ai ? ai.length : 0;
  document.getElementById('statPyCount').textContent = py ? py.length : 0;
  document.getElementById('statPhotoCount').textContent = ph ? ph.length : 0;

  const isSupa = dataStore.isSupabaseConfigured();
  const dot = document.querySelector('#overviewStatusPill .status-dot');
  const text = document.getElementById('overviewStatusText');
  const desc = document.getElementById('overviewStatusDesc');

  if (isSupa) {
    dot.className = 'status-dot active';
    text.textContent = 'Supabase Cloud Database Linked';
    desc.textContent = `Connected to: ${dataStore.supabaseConfig.url}. Public pages will stream live database updates!`;
  } else {
    dot.className = 'status-dot local';
    text.textContent = 'Local Storage Mode (Supabase Not Linked)';
    desc.textContent =
      'Changes are saved in your local browser storage. Link a free Supabase database to share edits across all devices.';
  }
}
document.getElementById('btnRefreshStats').addEventListener('click', () => {
  updateOverview();
  showToast('Dashboard stats refreshed', 'success');
});

// --- PROFILE TAB ---
async function loadProfile() {
  const profile = (await dataStore.getCollection('profile')) || DEFAULT_DATA.profile;
  document.getElementById('profName').value = profile.name || '';
  document.getElementById('profRole').value = profile.role || '';
  document.getElementById('profGreeting').value = profile.greeting || '';
  document.getElementById('profStatus').value = profile.status || '';
  document.getElementById('profBio').value = profile.bio || '';
  document.getElementById('profEmail').value = profile.email || '';
  document.getElementById('profLocation').value = profile.location || '';
  document.getElementById('profGithub').value = profile.github || '';
  document.getElementById('profLinkedin').value = profile.linkedin || '';
  document.getElementById('profInstagram').value = profile.instagram || '';
  document.getElementById('profTwitter').value = profile.twitter || '';
  document.getElementById('profResume').value = profile.resumeUrl || '';
}

document.getElementById('btnSaveProfile').addEventListener('click', async () => {
  const updated = {
    name: document.getElementById('profName').value.trim(),
    role: document.getElementById('profRole').value.trim(),
    greeting: document.getElementById('profGreeting').value.trim(),
    subgreeting: "I am a",
    headline: `${document.getElementById('profGreeting').value.trim()} ${document.getElementById('profBio').value.trim()}`,
    status: document.getElementById('profStatus').value.trim(),
    bio: document.getElementById('profBio').value.trim(),
    email: document.getElementById('profEmail').value.trim(),
    location: document.getElementById('profLocation').value.trim(),
    github: document.getElementById('profGithub').value.trim(),
    linkedin: document.getElementById('profLinkedin').value.trim(),
    instagram: document.getElementById('profInstagram').value.trim(),
    twitter: document.getElementById('profTwitter').value.trim(),
    resumeUrl: document.getElementById('profResume').value.trim()
  };

  try {
    await dataStore.saveCollection('profile', updated);
    showToast('Profile updated successfully!', 'success');
  } catch (e) {
    showToast(`Error saving profile: ${e.message}`, 'error');
  }
});

// --- WEB DEVELOPER PROJECTS ---
async function renderWebProjects() {
  const list = (await dataStore.getCollection('web_projects')) || [];
  const container = document.getElementById('listWebProjects');
  container.innerHTML = '';

  list.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__header">
        <span class="card__badge">${p.kind || 'Website build'}</span>
        <div>
          <button class="btn-icon" title="Move Up" onclick="reorderItem('web_projects', ${index}, -1)">↑</button>
          <button class="btn-icon" title="Move Down" onclick="reorderItem('web_projects', ${index}, 1)">↓</button>
        </div>
      </div>
      ${p.poster || p.video ? `
        <div class="card__media-preview">
          ${p.poster ? `<img src="../web-developer/${p.poster}" onerror="this.src='../og.jpg'" alt="${p.title}" />` : `<video src="../web-developer/${p.video}" muted playsinline></video>`}
        </div>
      ` : ''}
      <h3 class="card__title">${p.title}</h3>
      <p class="card__sub">${p.sub || ''}</p>
      <p class="card__desc">${p.desc || ''}</p>
      <div class="card__tags">
        ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card__footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal('web', ${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('web_projects', ${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btnAddWebProject').addEventListener('click', () => {
  openAddModal('web');
});

// --- AI/ML PROJECTS ---
async function renderAIProjects() {
  const list = (await dataStore.getCollection('ai_projects')) || [];
  const container = document.getElementById('listAIProjects');
  container.innerHTML = '';

  list.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__header">
        <span class="card__badge">${p.kind || 'iOS app'}</span>
        <div>
          <button class="btn-icon" title="Move Up" onclick="reorderItem('ai_projects', ${index}, -1)">↑</button>
          <button class="btn-icon" title="Move Down" onclick="reorderItem('ai_projects', ${index}, 1)">↓</button>
        </div>
      </div>
      ${p.poster || p.video ? `
        <div class="card__media-preview">
          <img src="../ai-ml-engineer/${p.poster || p.icon}" onerror="this.src='../og.jpg'" alt="${p.title}" />
        </div>
      ` : ''}
      <h3 class="card__title">${p.title}</h3>
      <p class="card__sub">${p.sub || ''}</p>
      <p class="card__desc">${p.desc || ''}</p>
      <div class="card__tags">
        ${(p.metrics || []).map(m => `<span class="tag">${m.label}: ${m.value}</span>`).join('')}
      </div>
      <div class="card__footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal('ai', ${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('ai_projects', ${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btnAddAIProject').addEventListener('click', () => {
  openAddModal('ai');
});

// --- PYTHON PROJECTS ---
async function renderPythonProjects() {
  const list = (await dataStore.getCollection('python_projects')) || [];
  const container = document.getElementById('listPythonProjects');
  container.innerHTML = '';

  list.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__header">
        <span class="card__badge">${p.kind || 'FastAPI'}</span>
        <div>
          <button class="btn-icon" title="Move Up" onclick="reorderItem('python_projects', ${index}, -1)">↑</button>
          <button class="btn-icon" title="Move Down" onclick="reorderItem('python_projects', ${index}, 1)">↓</button>
        </div>
      </div>
      ${p.poster || p.shot ? `
        <div class="card__media-preview">
          <img src="../python-developer/${p.poster || p.shot}" onerror="this.src='../og.jpg'" alt="${p.title}" />
        </div>
      ` : ''}
      <h3 class="card__title">${p.title}</h3>
      <p class="card__sub">${p.sub || ''}</p>
      <p class="card__desc">${p.desc || ''}</p>
      <div class="card__tags">
        ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="card__footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal('python', ${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('python_projects', ${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btnAddPythonProject').addEventListener('click', () => {
  openAddModal('python');
});

// --- PHOTOGRAPHY GALLERY ---
async function renderPhotos() {
  const list = (await dataStore.getCollection('photos')) || [];
  const container = document.getElementById('listPhotos');
  container.innerHTML = '';

  list.forEach((p, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__header">
        <span class="card__badge">${p.c || 'Photography'}</span>
        <span style="font-size: 0.75rem; color: var(--fg-muted);">${p.w}x${p.h}</span>
      </div>
      <div class="card__media-preview">
        <img src="../photographer/${p.t}" alt="${p.n}" />
      </div>
      <h3 class="card__title" style="font-size: 1rem;">${p.n}</h3>
      <p class="card__sub">${p.c}</p>
      <div class="card__footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal('photos', ${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('photos', ${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btnAddPhoto').addEventListener('click', () => {
  openAddModal('photos');
});

// --- COLLABORATORS ("BETTER TOGETHER") ---
async function renderFriends() {
  const list = (await dataStore.getCollection('friends')) || [];
  const container = document.getElementById('listFriends');
  container.innerHTML = '';

  list.forEach((f, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__header">
        <span class="card__badge">${f.role || 'Collaborator'}</span>
      </div>
      <div class="card__media-preview" style="height: 120px;">
        <img src="../${f.image}" style="object-fit: cover;" onerror="this.src='../og.jpg'" alt="${f.name}" />
      </div>
      <h3 class="card__title">${f.name}</h3>
      <p class="card__desc">${f.bio || ''}</p>
      <div class="card__footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal('friends', ${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('friends', ${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btnAddFriend').addEventListener('click', () => {
  openAddModal('friends');
});

// --- TECH STACK ---
async function renderTech() {
  const list = (await dataStore.getCollection('tech')) || [];
  const container = document.getElementById('listTech');
  container.innerHTML = '';

  list.forEach((t, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card__header">
        <span class="card__badge" style="background-color: ${t.hoverColor || '#3776AB'}; color: #fff;">${t.title}</span>
      </div>
      <h3 class="card__title">${t.title}</h3>
      <p class="card__sub">${t.href || ''}</p>
      <div class="card__footer">
        <button class="btn btn-secondary btn-sm" onclick="openEditModal('tech', ${index})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteItem('tech', ${index})">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

document.getElementById('btnAddTech').addEventListener('click', () => {
  openAddModal('tech');
});

// --- GLOBAL DELETE & REORDER ---
window.deleteItem = async function (collection, index) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  const list = (await dataStore.getCollection(collection)) || [];
  list.splice(index, 1);
  await dataStore.saveCollection(collection, list);
  showToast('Item deleted successfully', 'success');
  if (currentTab === 'web') renderWebProjects();
  else if (currentTab === 'ai') renderAIProjects();
  else if (currentTab === 'python') renderPythonProjects();
  else if (currentTab === 'photos') renderPhotos();
  else if (currentTab === 'friends') renderFriends();
  else if (currentTab === 'tech') renderTech();
  updateOverview();
};

window.reorderItem = async function (collection, index, offset) {
  const list = (await dataStore.getCollection(collection)) || [];
  const target = index + offset;
  if (target < 0 || target >= list.length) return;
  const temp = list[index];
  list[index] = list[target];
  list[target] = temp;
  await dataStore.saveCollection(collection, list);
  if (currentTab === 'web') renderWebProjects();
  else if (currentTab === 'ai') renderAIProjects();
  else if (currentTab === 'python') renderPythonProjects();
};

// --- DYNAMIC MODAL LOGIC ---
window.openAddModal = function (type) {
  activeModalType = type;
  editingIndex = -1;
  projectModalTitle.textContent = `Add New ${type.toUpperCase()}`;
  buildModalForm(type, {});
  projectModalOverlay.classList.add('active');
};

window.openEditModal = async function (type, index) {
  activeModalType = type;
  editingIndex = index;
  projectModalTitle.textContent = `Edit ${type.toUpperCase()} Item`;

  let collectionName = `${type}_projects`;
  if (type === 'photos') collectionName = 'photos';
  if (type === 'friends') collectionName = 'friends';
  if (type === 'tech') collectionName = 'tech';

  const list = (await dataStore.getCollection(collectionName)) || [];
  const item = list[index] || {};
  buildModalForm(type, item);
  projectModalOverlay.classList.add('active');
};

function buildModalForm(type, item) {
  projectModalForm.innerHTML = '';

  if (type === 'web' || type === 'ai' || type === 'python') {
    projectModalForm.innerHTML = `
      <div class="form-group full">
        <label>Project Title</label>
        <input type="text" id="mTitle" value="${item.title || ''}" required />
      </div>
      <div class="form-group">
        <label>Category / Kind Badge</label>
        <input type="text" id="mKind" value="${item.kind || ''}" placeholder="Website build / iOS app / FastAPI" />
      </div>
      <div class="form-group">
        <label>Subtitle / Domain</label>
        <input type="text" id="mSub" value="${item.sub || ''}" />
      </div>
      <div class="form-group full">
        <label>Description</label>
        <textarea id="mDesc" rows="3">${item.desc || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Video File (e.g. project-2.mp4)</label>
        <input type="text" id="mVideo" value="${item.video || ''}" />
      </div>
      <div class="form-group">
        <label>Poster / Screenshot (e.g. project-2.webp)</label>
        <input type="text" id="mPoster" value="${item.poster || item.shot || ''}" />
      </div>
      <div class="form-group full">
        <label>Tags (comma separated)</label>
        <input type="text" id="mTags" value="${(item.tags || []).join(', ')}" />
      </div>
    `;
  } else if (type === 'photos') {
    projectModalForm.innerHTML = `
      <div class="form-group">
        <label>Photo Name / Title</label>
        <input type="text" id="mPhotoName" value="${item.n || ''}" required />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select id="mPhotoCat">
          <option value="Concert" ${item.c === 'Concert' ? 'selected' : ''}>Concert</option>
          <option value="Nature" ${item.c === 'Nature' ? 'selected' : ''}>Nature</option>
          <option value="Sports" ${item.c === 'Sports' ? 'selected' : ''}>Sports</option>
          <option value="Architecture" ${item.c === 'Architecture' ? 'selected' : ''}>Architecture</option>
          <option value="Product" ${item.c === 'Product' ? 'selected' : ''}>Product</option>
        </select>
      </div>
      <div class="form-group">
        <label>Thumbnail Path / URL (p/01.webp)</label>
        <input type="text" id="mPhotoThumb" value="${item.t || ''}" required />
      </div>
      <div class="form-group">
        <label>Full Image Path / URL (p/01-full.webp)</label>
        <input type="text" id="mPhotoFull" value="${item.f || ''}" required />
      </div>
      <div class="form-group">
        <label>Width (px)</label>
        <input type="number" id="mPhotoW" value="${item.w || 1280}" />
      </div>
      <div class="form-group">
        <label>Height (px)</label>
        <input type="number" id="mPhotoH" value="${item.h || 720}" />
      </div>
    `;
  } else if (type === 'friends') {
    projectModalForm.innerHTML = `
      <div class="form-group full">
        <label>Collaborator Name</label>
        <input type="text" id="mFriendName" value="${item.name || ''}" required />
      </div>
      <div class="form-group full">
        <label>Role</label>
        <input type="text" id="mFriendRole" value="${item.role || ''}" />
      </div>
      <div class="form-group full">
        <label>Short Bio</label>
        <textarea id="mFriendBio" rows="2">${item.bio || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Image Path (components/ronali-jena.jpg)</label>
        <input type="text" id="mFriendImage" value="${item.image || ''}" />
      </div>
      <div class="form-group">
        <label>Portfolio / GitHub URL</label>
        <input type="url" id="mFriendPortfolio" value="${item.portfolio || ''}" />
      </div>
    `;
  } else if (type === 'tech') {
    projectModalForm.innerHTML = `
      <div class="form-group">
        <label>Tech Title (e.g. Python, React)</label>
        <input type="text" id="mTechTitle" value="${item.title || ''}" required />
      </div>
      <div class="form-group">
        <label>Hover Accent Color (hex, e.g. #3776AB)</label>
        <input type="text" id="mTechColor" value="${item.hoverColor || '#C4B0B0'}" />
      </div>
      <div class="form-group full">
        <label>Official Website / URL</label>
        <input type="url" id="mTechHref" value="${item.href || ''}" />
      </div>
    `;
  }
}

// Modal save button
document.getElementById('btnSaveProjectModal').addEventListener('click', async () => {
  let collectionName = `${activeModalType}_projects`;
  if (activeModalType === 'photos') collectionName = 'photos';
  if (activeModalType === 'friends') collectionName = 'friends';
  if (activeModalType === 'tech') collectionName = 'tech';

  const list = (await dataStore.getCollection(collectionName)) || [];

  if (activeModalType === 'web' || activeModalType === 'ai' || activeModalType === 'python') {
    const rawTags = (document.getElementById('mTags')?.value || '').split(',').map(s => s.trim()).filter(Boolean);
    const itemData = {
      title: document.getElementById('mTitle').value.trim(),
      kind: document.getElementById('mKind').value.trim(),
      sub: document.getElementById('mSub').value.trim(),
      desc: document.getElementById('mDesc').value.trim(),
      video: document.getElementById('mVideo').value.trim(),
      poster: document.getElementById('mPoster').value.trim(),
      tags: rawTags
    };
    if (editingIndex >= 0) list[editingIndex] = Object.assign(list[editingIndex], itemData);
    else list.unshift(itemData);
  } else if (activeModalType === 'photos') {
    const photoData = {
      n: document.getElementById('mPhotoName').value.trim(),
      c: document.getElementById('mPhotoCat').value,
      t: document.getElementById('mPhotoThumb').value.trim(),
      f: document.getElementById('mPhotoFull').value.trim(),
      w: parseInt(document.getElementById('mPhotoW').value, 10) || 1280,
      h: parseInt(document.getElementById('mPhotoH').value, 10) || 720
    };
    if (editingIndex >= 0) list[editingIndex] = Object.assign(list[editingIndex], photoData);
    else list.unshift(photoData);
  } else if (activeModalType === 'friends') {
    const friendData = {
      name: document.getElementById('mFriendName').value.trim(),
      role: document.getElementById('mFriendRole').value.trim(),
      bio: document.getElementById('mFriendBio').value.trim(),
      image: document.getElementById('mFriendImage').value.trim(),
      portfolio: document.getElementById('mFriendPortfolio').value.trim()
    };
    if (editingIndex >= 0) list[editingIndex] = Object.assign(list[editingIndex], friendData);
    else list.push(friendData);
  } else if (activeModalType === 'tech') {
    const techData = {
      title: document.getElementById('mTechTitle').value.trim(),
      hoverColor: document.getElementById('mTechColor').value.trim(),
      href: document.getElementById('mTechHref').value.trim()
    };
    if (editingIndex >= 0) list[editingIndex] = Object.assign(list[editingIndex], techData);
    else list.push(techData);
  }

  await dataStore.saveCollection(collectionName, list);
  projectModalOverlay.classList.remove('active');
  showToast('Item saved successfully!', 'success');

  if (activeModalType === 'web') renderWebProjects();
  else if (activeModalType === 'ai') renderAIProjects();
  else if (activeModalType === 'python') renderPythonProjects();
  else if (activeModalType === 'photos') renderPhotos();
  else if (activeModalType === 'friends') renderFriends();
  else if (activeModalType === 'tech') renderTech();
  updateOverview();
});

document.getElementById('btnCloseProjectModal').addEventListener('click', () => {
  projectModalOverlay.classList.remove('active');
});
document.getElementById('btnCancelProjectModal').addEventListener('click', () => {
  projectModalOverlay.classList.remove('active');
});

// --- SUPABASE TAB ---
function loadSupabaseTab() {
  const config = dataStore.supabaseConfig || {};
  document.getElementById('supabaseUrl').value = config.url || '';
  document.getElementById('supabaseKey').value = config.key || '';

  // Load SQL
  fetch('../supabase_schema.sql')
    .then((r) => r.text())
    .then((sql) => {
      document.getElementById('sqlBox').textContent = sql;
    })
    .catch(() => {
      document.getElementById('sqlBox').textContent =
        '-- Run supabase_schema.sql found at the root of your project directory.';
    });
}

document.getElementById('btnSaveSupabase').addEventListener('click', async () => {
  const url = document.getElementById('supabaseUrl').value.trim();
  const key = document.getElementById('supabaseKey').value.trim();
  dataStore.saveSupabaseConfig(url, key);
  showToast('Supabase configuration saved locally', 'success');
  updateOverview();
});

document.getElementById('btnTestSupabase').addEventListener('click', async () => {
  const url = document.getElementById('supabaseUrl').value.trim();
  const key = document.getElementById('supabaseKey').value.trim();
  dataStore.saveSupabaseConfig(url, key);

  showToast('Testing connection to Supabase...', 'success');
  const res = await dataStore.testConnection();
  if (res.success) {
    showToast(res.message, 'success');
    updateOverview();
  } else {
    showToast(`Connection failed: ${res.message}`, 'error');
  }
});

document.getElementById('btnSyncToSupabase').addEventListener('click', async () => {
  if (!confirm('This will upload all current portfolio data to your Supabase cloud database. Continue?')) return;
  try {
    showToast('Pushing data to Supabase...', 'success');
    await dataStore.syncAllToSupabase();
    showToast('Successfully synchronized all 7 collections to Supabase!', 'success');
  } catch (e) {
    showToast(`Sync failed: ${e.message}`, 'error');
  }
});

document.getElementById('btnPullFromSupabase').addEventListener('click', async () => {
  if (!confirm('This will overwrite local edits with live data from Supabase. Continue?')) return;
  try {
    showToast('Pulling data from Supabase...', 'success');
    await dataStore.pullAllFromSupabase();
    showToast('Local state updated from Supabase!', 'success');
    updateOverview();
  } catch (e) {
    showToast(`Pull failed: ${e.message}`, 'error');
  }
});

document.getElementById('btnCopySql').addEventListener('click', () => {
  const sql = document.getElementById('sqlBox').textContent;
  navigator.clipboard.writeText(sql).then(() => {
    showToast('SQL Schema copied to clipboard!', 'success');
  });
});

document.getElementById('btnUpdatePasscode').addEventListener('click', () => {
  const code = document.getElementById('inputNewPasscode').value.trim();
  try {
    dataStore.setPasscode(code);
    showToast('Admin passcode updated successfully!', 'success');
    document.getElementById('inputNewPasscode').value = '';
  } catch (e) {
    showToast(e.message, 'error');
  }
});

document.getElementById('btnResetDefaults').addEventListener('click', () => {
  if (!confirm('Are you sure you want to revert all changes to default? This cannot be undone.')) return;
  dataStore.resetToDefaults();
  showToast('All data reverted to defaults.', 'success');
  setTimeout(() => location.reload(), 800);
});

// --- INITIALIZATION ---
function initDashboard() {
  updateOverview();
  loadSupabaseTab();
}

checkAuth();
if (sessionStorage.getItem('portfolio_admin_unlocked') === 'true') {
  initDashboard();
}
