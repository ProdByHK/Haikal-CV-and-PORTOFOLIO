
/* ══════════════════════════════════════
   UPSTASH CONFIG
══════════════════════════════════════ */
const UPSTASH_URL = 'https://exciting-woodcock-67255.upstash.io';
const UPSTASH_WRITE_TOKEN = 'gQAAAAAAAQa3AAIncDEzNzkzYzE5NTdjM2M0M2RlOTI3MTYxZjRmMDk3NmQ5NXAxNjcyNTU';

/* ══════════════════════════════════════
   DEFAULT DATA (mirrors index.html)
══════════════════════════════════════ */
const DEFAULT_DATA = {
  hero: {
    name: "haikal pasha",
    title: "Creative Designer",
    roles: ["Creative Designer", "Brand Strategist", "Visual Storyteller"]
  },
  about: {
    bio: "I craft <strong>bold visual identities</strong> and digital experiences that people remember. Based in [City], working worldwide.\n\nEvery project starts with a simple idea: what story needs to be told, and how can design make it unforgettable?",
    stats: { years: "5+", projects: "60+", clients: "30+", awards: "12" },
    photo: null
  },
  skills: [
    { category: "Design Tools", items: ["Figma", "Adobe Suite", "Illustrator", "Photoshop"] },
    { category: "Motion & 3D", items: ["After Effects", "Spline", "Cinema 4D"] },
    { category: "Development", items: ["Framer", "Webflow", "HTML/CSS"] }
  ],
  experience: [
    {
      company: "Studio Forma",
      role: "Lead Creative Designer",
      dates: "2022 — Present",
      bullets: [
        "Led brand identity projects for 20+ global clients, increasing engagement by 45%",
        "Built and mentored a 5-person design team across three continents",
        "Developed a modular design system adopted across all company products"
      ]
    },
    {
      company: "Pixel & Co.",
      role: "Senior Visual Designer",
      dates: "2019 — 2022",
      bullets: [
        "Designed award-winning campaigns for Fortune 500 brands in FMCG & Tech",
        "Produced motion graphics and brand films viewed 10M+ times across platforms",
        "Collaborated with dev teams to implement pixel-perfect digital experiences"
      ]
    }
  ],
  portfolio: [
    {
      name: "VANTAGE Brand Identity",
      category: "Brand Strategy",
      description: "A complete visual identity system for a luxury real estate firm — from logo to environmental design.",
      color: "#1A1A2E",
      url: "#"
    },
    {
      name: "Orbit Motion Reel",
      category: "Motion Design",
      description: "A 90-second brand film exploring product storytelling through kinetic typography and 3D animation.",
      color: "#0F2027",
      url: "#"
    },
    {
      name: "Pulse App UI",
      category: "Digital Design",
      description: "Health & wellness app redesign — achieving a 38% uplift in user retention post-launch.",
      color: "#1A0A0A",
      url: "#"
    }
  ],
  contact: {
    email: "haikalpasha207@gmail.com",
    socials: [
      { platform: "LinkedIn",  icon: "in",  url: "https://linkedin.com/in/" },
      { platform: "Behance",   icon: "Bē",  url: "https://behance.net/" },
      { platform: "Instagram", icon: "📷",  url: "https://instagram.com/" }
    ]
  }
};

/* ══════════════════════════════════════
   STORAGE HELPERS (Upstash REST API)
══════════════════════════════════════ */
const PW_KEY = 'cv_admin_pw';

async function getData() {
  try {
    const res = await fetch(`${UPSTASH_URL}/get/cv_data`, {
      headers: { Authorization: `Bearer ${UPSTASH_WRITE_TOKEN}` }
    });
    const json = await res.json();
    if (json.result) {
      return Object.assign({}, DEFAULT_DATA, JSON.parse(json.result));
    }
  } catch(e) { console.warn('Upstash get failed:', e); }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

async function setData(data) {
  await fetch(`${UPSTASH_URL}/set/cv_data`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_WRITE_TOKEN}`,
      'Content-Type': 'text/plain'
    },
    body: JSON.stringify(data)
  });
}

function getPassword() {
  return localStorage.getItem(PW_KEY) || 'admin123';
}

/* ══════════════════════════════════════
   PASSWORD GATE
══════════════════════════════════════ */
const pwScreen = document.getElementById('password-screen');
const appEl = document.getElementById('app');
const pwInput = document.getElementById('pw-input');
const pwError = document.getElementById('pw-error');

function attemptLogin() {
  const val = pwInput.value;
  if (!val) { pwError.textContent = 'Please enter the password.'; return; }
  if (val === getPassword()) {
    pwScreen.classList.add('hidden');
    appEl.classList.add('visible');
    document.body.style.overflow = '';
    loadAllPanels();
  } else {
    pwError.textContent = 'Incorrect password. Redirecting...';
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  }
}

document.getElementById('pw-submit').addEventListener('click', attemptLogin);
pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptLogin(); });

/* ══════════════════════════════════════
   SIDEBAR NAVIGATION
══════════════════════════════════════ */
const panels = document.querySelectorAll('.panel-content');
const navLinks = document.querySelectorAll('#sidebar-nav a');
const topbarTitle = document.getElementById('topbar-title');
const titleMap = {
  hero: 'Hero', about: 'About', skills: 'Skills & Tools',
  experience: 'Experience', portfolio: 'Portfolio', contact: 'Contact', settings: 'Settings'
};

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const panelId = link.dataset.panel;
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + panelId).classList.add('active');
    topbarTitle.textContent = titleMap[panelId] || '';
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
  });
});

// Mobile toggle
document.getElementById('mobile-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

/* ══════════════════════════════════════
   TOAST
══════════════════════════════════════ */
let toastTimer;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').textContent = isError ? '✕' : '✓';
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ══════════════════════════════════════
   LOAD ALL PANELS
══════════════════════════════════════ */
async function loadAllPanels() {
  const d = await getData();
  loadHero(d.hero);
  loadAbout(d.about);
  loadSkills(d.skills);
  loadExperience(d.experience);
  loadPortfolio(d.portfolio);
  loadContact(d.contact);
}

/* ══════════════════════════════════════
   HERO PANEL
══════════════════════════════════════ */
function loadHero(h) {
  document.getElementById('hero-name').value = h.name || '';
  document.getElementById('hero-title').value = h.title || '';
  document.getElementById('hero-roles').value = (h.roles || []).join('\n');
  // Update admin tab title
  if (h.name) document.title = h.name + ' — Admin';
}
async function saveHero() {
  const d = await getData();
  d.hero = {
    name: document.getElementById('hero-name').value.trim(),
    title: document.getElementById('hero-title').value.trim(),
    roles: document.getElementById('hero-roles').value.split('\n').map(r => r.trim()).filter(Boolean)
  };
  await setData(d);
  showToast('Hero section saved!');
}

/* ══════════════════════════════════════
   ABOUT PANEL
══════════════════════════════════════ */
let pendingPhoto = undefined; // undefined = no change, null = remove, string = new base64

function loadAbout(a) {
  document.getElementById('about-bio').value = (a && a.bio) ? a.bio : '';
  const s = (a && a.stats) || DEFAULT_DATA.about.stats;
  document.getElementById('stat-years').value = s.years || '';
  document.getElementById('stat-projects').value = s.projects || '';
  document.getElementById('stat-clients').value = s.clients || '';
  document.getElementById('stat-awards').value = s.awards || '';
  // Photo
  pendingPhoto = undefined;
  const initEl = document.getElementById('photo-preview-initials');
  const imgEl = document.getElementById('photo-preview-img');
  if (a && a.photo) {
    imgEl.src = a.photo; imgEl.style.display = 'block';
    initEl.style.display = 'none';
  } else {
    imgEl.style.display = 'none';
    initEl.style.display = 'block';
    // Show current initials
    const name = document.getElementById('hero-name') && document.getElementById('hero-name').value;
    if (name) { const parts = name.split(' '); initEl.textContent = parts.map(p=>p[0]).join(''); }
  }
}

async function saveAbout() {
  const d = await getData();
  d.about = {
    bio: document.getElementById('about-bio').value,
    stats: {
      years: document.getElementById('stat-years').value.trim(),
      projects: document.getElementById('stat-projects').value.trim(),
      clients: document.getElementById('stat-clients').value.trim(),
      awards: document.getElementById('stat-awards').value.trim()
    },
    photo: pendingPhoto !== undefined ? pendingPhoto : (d.about && d.about.photo ? d.about.photo : null)
  };
  await setData(d);
  pendingPhoto = undefined;
  showToast('About section saved!');
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(ev) {
    const img = new Image();
    img.onload = function() {
      // Compress: max 480px, JPEG 0.82
      const MAX = 480;
      let w = img.width, h = img.height;
      if (w > h && w > MAX) { h = Math.round(h * MAX / w); w = MAX; }
      else if (h > w && h > MAX) { w = Math.round(w * MAX / h); h = MAX; }
      else if (w === h && w > MAX) { w = h = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      const b64 = canvas.toDataURL('image/jpeg', 0.82);
      pendingPhoto = b64;
      // Show preview
      const imgEl = document.getElementById('photo-preview-img');
      const initEl = document.getElementById('photo-preview-initials');
      imgEl.src = b64; imgEl.style.display = 'block';
      initEl.style.display = 'none';
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
  // Reset input so same file can be re-picked
  e.target.value = '';
}

function removePhoto() {
  pendingPhoto = null;
  const imgEl = document.getElementById('photo-preview-img');
  const initEl = document.getElementById('photo-preview-initials');
  imgEl.src = ''; imgEl.style.display = 'none';
  initEl.style.display = 'block';
  showToast('Photo removed — click Save to confirm.');
}

/* ══════════════════════════════════════
   SKILLS PANEL
══════════════════════════════════════ */
let skillsData = [];

function loadSkills(skills) {
  skillsData = JSON.parse(JSON.stringify(skills || DEFAULT_DATA.skills));
  renderSkillsEditor();
}

function renderSkillsEditor() {
  const editor = document.getElementById('skills-editor');
  editor.innerHTML = '';
  skillsData.forEach((cat, ci) => {
    const block = document.createElement('div');
    block.className = 'skill-cat-block';
    block.innerHTML = `
      <div class="skill-cat-header">
        <input class="cat-name-input" type="text" value="${escHtml(cat.category)}" placeholder="Category name"
          oninput="skillsData[${ci}].category=this.value">
        <button class="btn btn-remove" onclick="removeCat(${ci})">✕ Remove Category</button>
      </div>
      <div class="chip-tags" id="chip-tags-${ci}">
        ${cat.items.map((item, ii) => `
          <div class="chip-tag">
            <span>${escHtml(item)}</span>
            <button onclick="removeChip(${ci},${ii})" aria-label="Remove ${item}">×</button>
          </div>`).join('')}
      </div>
      <div class="add-chip-row">
        <input class="add-chip-input" type="text" placeholder="Add skill..." id="chip-input-${ci}">
        <button class="btn btn-add" onclick="addChip(${ci})">+ Add</button>
      </div>`;
    editor.appendChild(block);
  });
}

function addSkillCategory() {
  skillsData.push({ category: 'New Category', items: [] });
  renderSkillsEditor();
}
function removeCat(ci) {
  skillsData.splice(ci, 1);
  renderSkillsEditor();
}
function removeChip(ci, ii) {
  skillsData[ci].items.splice(ii, 1);
  renderSkillsEditor();
}
function addChip(ci) {
  const input = document.getElementById('chip-input-' + ci);
  const val = input.value.trim();
  if (!val) return;
  skillsData[ci].items.push(val);
  renderSkillsEditor();
  const newInput = document.getElementById('chip-input-' + ci);
  if (newInput) newInput.focus();
}

async function saveSkills() {
  const d = await getData();
  d.skills = JSON.parse(JSON.stringify(skillsData));
  await setData(d);
  showToast('Skills saved!');
}

/* ══════════════════════════════════════
   EXPERIENCE PANEL
══════════════════════════════════════ */
let expData = [];

function loadExperience(exp) {
  expData = JSON.parse(JSON.stringify(exp || DEFAULT_DATA.experience));
  renderExperienceEditor();
}

function renderExperienceEditor() {
  const editor = document.getElementById('experience-editor');
  editor.innerHTML = '';
  expData.forEach((job, ji) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-num">JOB ${String(ji + 1).padStart(2,'0')}</span>
        <button class="btn btn-remove" onclick="removeExp(${ji})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Company</label>
          <input type="text" class="form-input" value="${escHtml(job.company)}" placeholder="Company name"
            oninput="expData[${ji}].company=this.value">
        </div>
        <div class="form-group">
          <label class="form-label">Role / Title</label>
          <input type="text" class="form-input" value="${escHtml(job.role)}" placeholder="Your role"
            oninput="expData[${ji}].role=this.value">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Date Range</label>
        <input type="text" class="form-input" value="${escHtml(job.dates)}" placeholder="2022 — Present"
          oninput="expData[${ji}].dates=this.value">
      </div>
      <div class="form-group">
        <label class="form-label">Impact Bullet Points</label>
        <div class="bullets-list" id="bullets-${ji}">
          ${job.bullets.map((b, bi) => `
            <div class="bullet-row">
              <input type="text" class="form-input" value="${escHtml(b)}" placeholder="Bullet point..."
                oninput="expData[${ji}].bullets[${bi}]=this.value">
              <button class="btn btn-remove" style="white-space:nowrap" onclick="removeBullet(${ji},${bi})">✕</button>
            </div>`).join('')}
        </div>
        <button class="btn btn-add" style="margin-top:8px" onclick="addBullet(${ji})">+ Add Bullet</button>
      </div>`;
    editor.appendChild(card);
  });
}

function addExperienceEntry() {
  expData.push({ company: '', role: '', dates: '', bullets: [''] });
  renderExperienceEditor();
}
function removeExp(ji) {
  expData.splice(ji, 1);
  renderExperienceEditor();
}
function addBullet(ji) {
  expData[ji].bullets.push('');
  renderExperienceEditor();
}
function removeBullet(ji, bi) {
  expData[ji].bullets.splice(bi, 1);
  renderExperienceEditor();
}
async function saveExperience() {
  const d = await getData();
  d.experience = JSON.parse(JSON.stringify(expData));
  await setData(d);
  showToast('Experience saved!');
}

/* ══════════════════════════════════════
   PORTFOLIO PANEL
══════════════════════════════════════ */
let portData = [];

function loadPortfolio(port) {
  portData = JSON.parse(JSON.stringify(port || DEFAULT_DATA.portfolio));
  renderPortfolioEditor();
}

function renderPortfolioEditor() {
  const editor = document.getElementById('portfolio-editor');
  editor.innerHTML = '';
  portData.forEach((p, pi) => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-num">PROJECT ${String(pi + 1).padStart(2,'0')}</span>
        <button class="btn btn-remove" onclick="removePort(${pi})">✕ Remove</button>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project Name</label>
          <input type="text" class="form-input" value="${escHtml(p.name)}" placeholder="Project name"
            oninput="portData[${pi}].name=this.value">
        </div>
        <div class="form-group">
          <label class="form-label">Category Tag</label>
          <input type="text" class="form-input" value="${escHtml(p.category)}" placeholder="Brand Strategy"
            oninput="portData[${pi}].category=this.value">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Short Description</label>
        <textarea class="form-textarea" rows="2" placeholder="Brief description..."
          oninput="portData[${pi}].description=this.value">${escHtml(p.description)}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Project URL</label>
          <input type="url" class="form-input" value="${escHtml(p.url)}" placeholder="https://..."
            oninput="portData[${pi}].url=this.value">
        </div>
        <div class="form-group">
          <label class="form-label">Card Background Color</label>
          <div class="color-field">
            <div class="color-preview" id="color-prev-${pi}" style="background:${p.color||'#1A1A2E'}"></div>
            <input type="color" value="${p.color||'#1A1A2E'}"
              oninput="portData[${pi}].color=this.value;document.getElementById('color-prev-${pi}').style.background=this.value">
            <input type="text" class="form-input" value="${escHtml(p.color||'#1A1A2E')}" style="font-family:var(--font-mono);font-size:13px"
              oninput="portData[${pi}].color=this.value;document.getElementById('color-prev-${pi}').style.background=this.value">
          </div>
        </div>
      </div>`;
    editor.appendChild(card);
  });
}

function addPortfolioEntry() {
  portData.push({ name: '', category: '', description: '', color: '#1A1A2E', url: '#' });
  renderPortfolioEditor();
}
function removePort(pi) {
  portData.splice(pi, 1);
  renderPortfolioEditor();
}
async function savePortfolio() {
  const d = await getData();
  d.portfolio = JSON.parse(JSON.stringify(portData));
  await setData(d);
  showToast('Portfolio saved!');
}

/* ══════════════════════════════════════
   CONTACT PANEL — SOCIAL LINKS MANAGER
══════════════════════════════════════ */
let socialsData = [];

// Popular platforms for the quick-pick dropdown
const PLATFORM_PRESETS = [
  { platform: 'LinkedIn',   icon: 'in',  placeholder: 'https://linkedin.com/in/username' },
  { platform: 'Instagram',  icon: '📷',  placeholder: 'https://instagram.com/username' },
  { platform: 'Behance',    icon: 'Bē',  placeholder: 'https://behance.net/username' },
  { platform: 'Twitter/X',  icon: '𝕏',  placeholder: 'https://x.com/username' },
  { platform: 'GitHub',     icon: '⌥',  placeholder: 'https://github.com/username' },
  { platform: 'Dribbble',   icon: '◉',  placeholder: 'https://dribbble.com/username' },
  { platform: 'YouTube',    icon: '▶',  placeholder: 'https://youtube.com/@username' },
  { platform: 'TikTok',     icon: '♪',  placeholder: 'https://tiktok.com/@username' },
  { platform: 'Facebook',   icon: 'f',  placeholder: 'https://facebook.com/username' },
  { platform: 'Pinterest',  icon: '𝑃',  placeholder: 'https://pinterest.com/username' },
  { platform: 'Snapchat',   icon: '👻', placeholder: 'https://snapchat.com/add/username' },
  { platform: 'Discord',    icon: '◈',  placeholder: 'https://discord.gg/invite' },
  { platform: 'Website',    icon: '🌐', placeholder: 'https://yourwebsite.com' },
  { platform: 'Custom',     icon: '★',  placeholder: 'https://...' }
];

function loadContact(c) {
  const d = c || DEFAULT_DATA.contact;
  document.getElementById('contact-email').value = d.email || '';
  // Migrate legacy flat format → socials array
  if (d.socials && Array.isArray(d.socials)) {
    socialsData = JSON.parse(JSON.stringify(d.socials));
  } else {
    // Legacy: convert linkedin/behance/instagram keys
    socialsData = [];
    if (d.linkedin && d.linkedin !== '#') socialsData.push({ platform: 'LinkedIn',  icon: 'in',  url: d.linkedin });
    if (d.behance  && d.behance  !== '#') socialsData.push({ platform: 'Behance',   icon: 'Bē',  url: d.behance });
    if (d.instagram && d.instagram !== '#') socialsData.push({ platform: 'Instagram', icon: '📷',  url: d.instagram });
  }
  renderSocialsEditor();
}

function renderSocialsEditor() {
  const editor = document.getElementById('socials-editor');
  if (!editor) return;
  if (socialsData.length === 0) {
    editor.innerHTML = `<p style="font-size:13px;color:var(--muted);padding:16px 0">No social links yet. Click "+ Add Platform" to get started.</p>`;
    return;
  }
  editor.innerHTML = '';
  socialsData.forEach((s, idx) => {
    const card = document.createElement('div');
    card.className = 'social-edit-card';
    // Platform preset selector
    const presetOptions = PLATFORM_PRESETS.map(p =>
      `<option value="${escHtml(p.platform)}" ${s.platform === p.platform ? 'selected' : ''}>${escHtml(p.platform)}</option>`
    ).join('');
    card.innerHTML = `
      <div class="social-edit-header">
        <div class="social-edit-preview">${escHtml(s.icon || '★')}</div>
        <span class="social-edit-name">${escHtml(s.platform || 'Social Link')} <span style="color:var(--muted);font-size:11px;font-family:var(--font-mono)">#${idx+1}</span></span>
        <button class="btn btn-remove" onclick="removeSocialLink(${idx})">✕ Remove</button>
      </div>
      <div class="social-edit-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Platform</label>
            <select class="form-select social-platform-select" data-idx="${idx}" onchange="onPlatformPreset(${idx}, this.value)">${presetOptions}</select>
          </div>
          <div class="form-group">
            <label class="form-label">Display Icon / Text <span class="form-hint" style="display:inline">(1–3 chars or emoji)</span></label>
            <input type="text" class="form-input" value="${escHtml(s.icon)}" maxlength="4" placeholder="in"
              oninput="socialsData[${idx}].icon=this.value; renderSocialsEditor()" style="font-family:var(--font-head);font-size:18px;text-align:center">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Profile URL</label>
          <input type="url" class="form-input" value="${escHtml(s.url)}" placeholder="https://..."
            oninput="socialsData[${idx}].url=this.value">
        </div>
      </div>`;
    editor.appendChild(card);
  });
}

function onPlatformPreset(idx, platformName) {
  const preset = PLATFORM_PRESETS.find(p => p.platform === platformName);
  if (preset) {
    socialsData[idx].platform = preset.platform;
    socialsData[idx].icon     = preset.icon;
    if (!socialsData[idx].url || socialsData[idx].url === '#' || socialsData[idx].url === '') {
      socialsData[idx].url = preset.placeholder;
    }
  }
  renderSocialsEditor();
}

function addSocialLink() {
  const preset = PLATFORM_PRESETS[0]; // default to LinkedIn
  socialsData.push({ platform: preset.platform, icon: preset.icon, url: '' });
  renderSocialsEditor();
  // Scroll into view
  const editor = document.getElementById('socials-editor');
  if (editor) editor.lastElementChild && editor.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function removeSocialLink(idx) {
  socialsData.splice(idx, 1);
  renderSocialsEditor();
}

async function saveContact() {
  const d = await getData();
  d.contact = {
    email: document.getElementById('contact-email').value.trim(),
    socials: JSON.parse(JSON.stringify(socialsData))
  };
  await setData(d);
  showToast('Contact details saved!');
}

/* ══════════════════════════════════════
   SETTINGS
══════════════════════════════════════ */
function changePassword() {
  const current = document.getElementById('pw-current').value;
  const newPw = document.getElementById('pw-new').value;
  const confirm = document.getElementById('pw-confirm').value;
  if (current !== getPassword()) { showToast('Current password is incorrect.', true); return; }
  if (!newPw || newPw.length < 4) { showToast('New password must be at least 4 characters.', true); return; }
  if (newPw !== confirm) { showToast('Passwords do not match.', true); return; }
  localStorage.setItem(PW_KEY, newPw);
  document.getElementById('pw-current').value = '';
  document.getElementById('pw-new').value = '';
  document.getElementById('pw-confirm').value = '';
  showToast('Password updated successfully!');
}

async function confirmReset() {
  if (confirm('Are you sure? This will reset ALL CV content to the default placeholder content. This cannot be undone.')) {
    await setData(JSON.parse(JSON.stringify(DEFAULT_DATA)));
    await loadAllPanels();
    showToast('All content reset to defaults.');
  }
}

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  document.addEventListener('mousemove', e => { dotX = e.clientX; dotY = e.clientY; });
  function loop() {
    ringX += (dotX - ringX) * 0.1;
    ringY += (dotY - ringY) * 0.1;
    dot.style.left = dotX + 'px'; dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
    requestAnimationFrame(loop);
  }
  loop();
  ['a','button','input','textarea','.btn'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  });
})();

/* ══════════════════════════════════════
   CHIP INPUT — ENTER KEY SUPPORT
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('add-chip-input')) {
    const id = e.target.id.replace('chip-input-', '');
    addChip(parseInt(id));
  }
});

/* ══════════════════════════════════════
   UTILITY
══════════════════════════════════════ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
