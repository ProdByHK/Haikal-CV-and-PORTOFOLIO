
/* ══════════════════════════════════════
   UPSTASH CONFIG (Moved to server-side .env.local)
══════════════════════════════════════ */

/* ══════════════════════════════════════
   DEFAULT DATA
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
      { platform: "LinkedIn",  icon: "in",  url: "#" },
      { platform: "Behance",   icon: "Bē",  url: "#" },
      { platform: "Instagram", icon: "📷",  url: "#" }
    ]
  }
};

/* ══════════════════════════════════════
   LOAD DATA FROM UPSTASH
══════════════════════════════════════ */
async function getData() {
  try {
    const res = await fetch(`/api/cv`);
    const json = await res.json();
    if (json.result) {
      return Object.assign({}, DEFAULT_DATA, JSON.parse(json.result));
    }
  } catch(e) { console.warn('Upstash fetch failed, using defaults:', e); }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/* ══════════════════════════════════════
   RENDER DYNAMIC CONTENT
══════════════════════════════════════ */
async function renderAll() {
  const d = await getData();
  renderHero(d.hero);
  renderAbout(d.about);
  renderSkills(d.skills);
  renderExperience(d.experience);
  renderPortfolio(d.portfolio);
  renderContact(d.contact);
}

function renderHero(h) {
  // Name spans
  const nameEl = document.getElementById('hero-name');
  const name = h.name || 'haikal pasha';
  nameEl.setAttribute('aria-label', name);
  nameEl.innerHTML = '';
  let delay = 0.4;
  name.split('').forEach(ch => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = ch === ' ' ? '\u00a0' : ch;
    span.style.animationDelay = delay + 's';
    delay += 0.05;
    nameEl.appendChild(span);
  });
  // Update nav logo
  const parts = name.split(' ');
  const initials = parts.map(p => p[0]).join('');
  document.getElementById('nav-logo').innerHTML = initials[0] + '<span>.</span>' + (initials[1] || '');
  document.getElementById('about-initials').textContent = initials;
  // Update browser tab title + meta
  const role = h.title || 'Creative Designer';
  document.title = name + ' — ' + role;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', name + ' — ' + role + '. Portfolio and CV.');
  document.getElementById('about-name-card').textContent = name;
  document.getElementById('about-role-card').textContent = h.title || 'Creative Designer';
  document.querySelector('.hero-eyebrow').textContent = 'Portfolio — ' + new Date().getFullYear();
  document.getElementById('footer-name').textContent = name;
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  // Start typewriter with roles
  if (h.roles && h.roles.length) startTypewriter(h.roles);
}

function renderAbout(a) {
  // Bio
  const el = document.getElementById('about-bio-content');
  const text = (a && a.bio) || DEFAULT_DATA.about.bio;
  el.innerHTML = text.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');

  // Stats
  const s = (a && a.stats) || DEFAULT_DATA.about.stats;
  const labels = ['Years Experience','Projects Delivered','Happy Clients','Awards Won'];
  const vals = [s.years, s.projects, s.clients, s.awards];
  const statsEl = document.getElementById('about-stats');
  if (statsEl) {
    // Only render stats that have a non-empty value
    statsEl.innerHTML = vals
      .map((v, i) => v && v.trim() ? `
        <div class="stat-item">
          <div class="stat-number">${v.trim()}</div>
          <div class="stat-label">${labels[i]}</div>
        </div>` : '')
      .join('');
  }

  // Photo
  const photoImg = document.getElementById('about-photo-img');
  if (photoImg) {
    if (a && a.photo) {
      photoImg.src = a.photo;
      photoImg.style.display = 'block';
    } else {
      photoImg.style.display = 'none';
    }
  }
}

function renderSkills(skills) {
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = '';
  (skills || DEFAULT_DATA.skills).forEach(cat => {
    const div = document.createElement('div');
    div.className = 'reveal';
    div.innerHTML = `<div class="skill-category-label">${cat.category}</div>
    <div class="chips-row">${cat.items.map(i => `<span class="chip hoverable">${i}</span>`).join('')}</div>`;
    grid.appendChild(div);
  });
}

function renderExperience(jobs) {
  const container = document.getElementById('timeline-entries');
  container.innerHTML = '';
  (jobs || DEFAULT_DATA.experience).forEach(job => {
    const entry = document.createElement('div');
    entry.className = 'timeline-entry reveal-left';
    entry.innerHTML = `
      <div class="timeline-company">${job.company}</div>
      <div class="timeline-role">${job.role}</div>
      <div class="timeline-dates">${job.dates}</div>
      <ul class="timeline-bullets">
        ${job.bullets.map(b => `<li>${b}</li>`).join('')}
      </ul>`;
    container.appendChild(entry);
  });
}

function renderPortfolio(projects) {
  const grid = document.getElementById('portfolio-grid');
  grid.innerHTML = '';
  const colors = ['#1A1A2E','#0F2027','#1A0A0A'];
  (projects || DEFAULT_DATA.portfolio).forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal hoverable';
    card.dataset.index = i;
    const col = p.color || colors[i % colors.length];
    card.innerHTML = `
      <div class="project-color-block">
        <div class="color-bg" style="background:${col}">
          <span class="project-number">0${i+1}</span>
        </div>
        <a href="${p.url || '#'}" class="project-overlay" target="_blank" rel="noopener" aria-label="View ${p.name}" style="text-decoration:none">
          <span class="project-overlay-text">View Project →</span>
        </a>
      </div>
      <div class="project-body">
        <div class="project-tag">${p.category}</div>
        <div class="project-name">${p.name}</div>
        <div class="project-desc">${p.description}</div>
      </div>`;
    grid.appendChild(card);
  });
  // Magnetic effect
  initMagnetic();
}

function renderContact(c) {
  const d = c || DEFAULT_DATA.contact;
  const emailLink = document.getElementById('contact-email-link');
  emailLink.href = 'mailto:' + (d.email || 'haikalpasha207@gmail.com');
  document.getElementById('contact-email-text').textContent = d.email || 'haikalpasha207@gmail.com';

  // Build socials array — support new format and legacy flat keys
  let socials = [];
  if (d.socials && Array.isArray(d.socials)) {
    socials = d.socials;
  } else {
    // Legacy migration
    if (d.linkedin) socials.push({ platform: 'LinkedIn',  icon: 'in',  url: d.linkedin });
    if (d.behance)  socials.push({ platform: 'Behance',   icon: 'Bē',  url: d.behance });
    if (d.instagram) socials.push({ platform: 'Instagram', icon: '📷',  url: d.instagram });
  }

  const row = document.getElementById('social-row');
  row.innerHTML = '';
  socials.forEach((s, i) => {
    if (!s.url || s.url === '#') return; // skip empty
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = s.url;
    a.className = 'hoverable';
    a.setAttribute('aria-label', s.platform || 'Social link');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
    a.style.opacity = '0';
    a.style.transform = 'translateY(20px)';
    a.textContent = s.icon || s.platform.slice(0,2);
    li.appendChild(a);
    row.appendChild(li);
    // Animate in with stagger
    setTimeout(() => { a.classList.add('social-visible'); }, 200 + i * 120);
  });
}

/* ══════════════════════════════════════
   TYPEWRITER EFFECT
══════════════════════════════════════ */
function startTypewriter(roles) {
  const el = document.getElementById('typewriter-text');
  let roleIdx = 0, charIdx = 0, deleting = false;
  let timeout;
  function type() {
    const current = roles[roleIdx % roles.length];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        timeout = setTimeout(() => { deleting = true; type(); }, 1800);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx++;
        timeout = setTimeout(type, 350);
        return;
      }
    }
    timeout = setTimeout(type, deleting ? 45 : 95);
  }
  setTimeout(type, 1500);
}

/* ══════════════════════════════════════
   HERO CANVAS — FLOATING SHAPES
══════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, shapes = [], mouse = { x: -9999, y: -9999 };

  const hero = document.getElementById('hero');

  function resize() {
    W = canvas.width  = hero.offsetWidth  || window.innerWidth;
    H = canvas.height = hero.offsetHeight || window.innerHeight;
  }


  function Shape(x, y, type) {
    this.x = x; this.y = y; this.type = type;
    this.size = 10 + Math.random() * 40;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.opacity = 0.03 + Math.random() * 0.08;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.005;
  }

  function initShapes() {
    shapes = [];
    const types = ['circle','triangle','rect'];
    for (let i = 0; i < 22; i++) {
      shapes.push(new Shape(Math.random() * W, Math.random() * H, types[i % 3]));
    }
  }

  function drawShape(s) {
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rotation);
    ctx.globalAlpha = s.opacity;
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (s.type === 'circle') {
      ctx.arc(0, 0, s.size, 0, Math.PI * 2);
    } else if (s.type === 'triangle') {
      ctx.moveTo(0, -s.size);
      ctx.lineTo(s.size * 0.87, s.size * 0.5);
      ctx.lineTo(-s.size * 0.87, s.size * 0.5);
      ctx.closePath();
    } else {
      ctx.rect(-s.size / 2, -s.size / 2, s.size, s.size);
    }
    ctx.stroke();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    shapes.forEach(s => {
      // Cursor repulsion
      const dx = s.x - mouse.x;
      const dy = s.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.8;
        s.vx += (dx / dist) * force;
        s.vy += (dy / dist) * force;
      }
      s.vx *= 0.98; s.vy *= 0.98;
      s.x += s.vx; s.y += s.vy;
      s.rotation += s.rotSpeed;
      if (s.x < -60) s.x = W + 60;
      if (s.x > W + 60) s.x = -60;
      if (s.y < -60) s.y = H + 60;
      if (s.y > H + 60) s.y = -60;
      drawShape(s);
    });
    requestAnimationFrame(animate);
  }

  resize(); initShapes(); animate();
  window.addEventListener('resize', () => { resize(); initShapes(); });
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
})();

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    dotX = e.clientX; dotY = e.clientY;
  });

  function loop() {
    ringX += (dotX - ringX) * 0.1;
    ringY += (dotY - ringY) * 0.1;
    dot.style.left = dotX + 'px';
    dot.style.top = dotY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    raf = requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .hoverable, .chip').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ══════════════════════════════════════
   NAVBAR SCROLL BEHAVIOUR
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // Active section highlight
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 140) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ══════════════════════════════════════
   HAMBURGER / DRAWER
══════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('nav-drawer');
const overlay = document.getElementById('drawer-overlay');

function toggleDrawer(open) {
  hamburger.classList.toggle('open', open);
  drawer.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('open')));
overlay.addEventListener('click', () => toggleDrawer(false));
document.querySelectorAll('.drawer-link').forEach(a => {
  a.addEventListener('click', () => toggleDrawer(false));
});

/* ══════════════════════════════════════
   SCROLL ANIMATIONS (IntersectionObserver)
══════════════════════════════════════ */
function initReveal() {
  // Generic reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));

  // Chip stagger
  const chipObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const chips = e.target.querySelectorAll('.chip');
        chips.forEach((chip, i) => {
          setTimeout(() => chip.classList.add('chip-visible'), i * 80);
        });
        chipObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.chips-row').forEach(row => chipObs.observe(row));

  // Timeline line
  const tlObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.getElementById('timeline-line').classList.add('drawn');
        tlObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  const tlSection = document.getElementById('experience');
  if (tlSection) tlObs.observe(tlSection);

  // Contact heading split reveal
  const contactObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.split-word').forEach(w => w.classList.add('visible'));
        // Social stagger
        document.querySelectorAll('.social-row a').forEach((a, i) => {
          setTimeout(() => a.classList.add('social-visible'), 300 + i * 120);
        });
        contactObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });

  const contactSection = document.getElementById('contact');
  if (contactSection) contactObs.observe(contactSection);
}

/* ══════════════════════════════════════
   MAGNETIC CARDS
══════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-8px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ══════════════════════════════════════
   EMAIL BTN RIPPLE
══════════════════════════════════════ */
document.getElementById('contact-email-link').addEventListener('click', function(e) {
  const btn = this;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
});

/* ══════════════════════════════════════
   SMOOTH SCROLL FOR NAV LINKS
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
renderAll().then(() => {
  // Small delay to allow fonts to load before running observer
  setTimeout(initReveal, 100);
});
