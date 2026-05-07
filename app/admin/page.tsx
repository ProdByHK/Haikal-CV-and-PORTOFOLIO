"use client";
import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    // Run the extracted script
    const script = document.createElement('script');
    script.src = '/admin_script.js';
    document.body.appendChild(script);
    
    // Set admin specific body styles that conflict with globals.css
    const originalBg = document.body.style.background;
    const originalOverflow = document.body.style.overflow;
    document.body.style.background = '#0D0D0D';
    document.body.style.overflow = 'hidden';

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      document.body.style.background = originalBg;
      document.body.style.overflow = originalOverflow;
    }
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
/* ══════════════════════════════════════
   ROOT VARIABLES & RESET
══════════════════════════════════════ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0D0D0D;
  --surface: #161616;
  --surface2: #1E1E1E;
  --text: #F0EDE6;
  --accent: #FF6B35;
  --muted: #888888;
  --border: #2A2A2A;
  --success: #28C76F;
  --danger: #EA5455;
  --font-head: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'Courier New', monospace;
  --ease-premium: cubic-bezier(0.23, 1, 0.32, 1);
  --sidebar-width: 240px;
}
html, body { height: 100%; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  overflow: hidden;
  cursor: none;
}

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
#cursor-dot {
  position: fixed; top: 0; left: 0;
  width: 8px; height: 8px;
  background: var(--accent); border-radius: 50%;
  pointer-events: none; z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.2s, height 0.2s, background 0.2s;
}
#cursor-ring {
  position: fixed; top: 0; left: 0;
  width: 32px; height: 32px;
  border: 1.5px solid rgba(255,107,53,0.5);
  border-radius: 50%;
  pointer-events: none; z-index: 99998;
  transform: translate(-50%, -50%);
}
body.cursor-hover #cursor-dot { width: 12px; height: 12px; }
body.cursor-hover #cursor-ring { width: 48px; height: 48px; border-color: var(--accent); }

/* ══════════════════════════════════════
   PASSWORD SCREEN
══════════════════════════════════════ */
#password-screen {
  position: fixed; inset: 0; z-index: 5000;
  background: var(--bg);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 32px;
  transition: opacity 0.5s, visibility 0.5s;
}
#password-screen.hidden { opacity: 0; visibility: hidden; }
.pw-logo {
  font-family: var(--font-head); font-size: 32px; font-weight: 700;
  color: var(--text);
}
.pw-logo span { color: var(--accent); }
.pw-card {
  background: var(--surface); border: 1px solid var(--border);
  padding: 48px; width: min(420px, 92vw);
  text-align: center;
}
.pw-title {
  font-family: var(--font-head); font-size: 24px; font-weight: 700;
  margin-bottom: 8px;
}
.pw-sub { font-size: 14px; color: var(--muted); margin-bottom: 32px; }
.pw-input {
  width: 100%; padding: 14px 16px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-family: var(--font-body); font-size: 15px;
  outline: none; transition: border-color 0.3s;
  margin-bottom: 16px; cursor: none;
}
.pw-input:focus { border-color: var(--accent); }
.pw-input::placeholder { color: var(--muted); }
.pw-btn {
  width: 100%; padding: 14px;
  background: var(--accent); border: none;
  color: var(--bg); font-size: 14px; font-weight: 600;
  letter-spacing: 0.08em; cursor: none;
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}
.pw-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(255,107,53,0.3); }
.pw-error {
  font-size: 13px; color: var(--danger);
  margin-top: 12px; min-height: 18px;
}

/* ══════════════════════════════════════
   MAIN PANEL LAYOUT
══════════════════════════════════════ */
#app {
  display: flex; height: 100vh;
  opacity: 0; transition: opacity 0.5s;
}
#app.visible { opacity: 1; }

/* ══ SIDEBAR ══ */
#sidebar {
  width: var(--sidebar-width); flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  overflow-y: auto;
}
.sidebar-logo {
  padding: 28px 24px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-head); font-size: 20px; font-weight: 700;
}
.sidebar-logo span { color: var(--accent); }
.sidebar-label {
  font-family: var(--font-mono); font-size: 10px;
  color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase;
  padding: 20px 24px 8px;
}
.sidebar-nav { list-style: none; padding: 0 12px; flex: 1; }
.sidebar-nav li a {
  display: flex; align-items: center; gap: 12px;
  padding: 12px; width: 100%;
  color: var(--muted); text-decoration: none;
  font-size: 13px; font-weight: 500;
  border-radius: 0; cursor: none;
  transition: color 0.2s, background 0.2s;
  position: relative;
}
.sidebar-nav li a::before {
  content: '';
  position: absolute; left: 0;
  top: 50%; transform: translateY(-50%);
  width: 2px; height: 0;
  background: var(--accent);
  transition: height 0.3s var(--ease-premium);
}
.sidebar-nav li a.active, .sidebar-nav li a:hover { color: var(--text); background: rgba(255,107,53,0.06); }
.sidebar-nav li a.active::before { height: 60%; }
.sidebar-icon { font-size: 16px; width: 20px; text-align: center; }
.sidebar-bottom {
  padding: 20px 12px;
  border-top: 1px solid var(--border);
}
.preview-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px; width: 100%;
  background: var(--accent); border: none;
  color: var(--bg); font-size: 13px; font-weight: 600;
  letter-spacing: 0.05em; cursor: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.preview-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,107,53,0.3); }

/* ══ MAIN CONTENT ══ */
#main {
  flex: 1; overflow-y: auto;
  display: flex; flex-direction: column;
}
.main-topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 24px 40px;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  position: sticky; top: 0; z-index: 10;
  flex-shrink: 0;
}
.topbar-title {
  font-family: var(--font-head); font-size: 22px; font-weight: 700;
}
.topbar-actions { display: flex; gap: 12px; }
.panel-content {
  flex: 1; padding: 40px;
  display: none;
}
.panel-content.active { display: block; }

/* ══════════════════════════════════════
   FORM ELEMENTS
══════════════════════════════════════ */
.form-group { margin-bottom: 24px; }
.form-label {
  display: block; font-size: 12px; font-weight: 500;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 8px;
  font-family: var(--font-mono);
}
.form-input, .form-textarea, .form-select {
  width: 100%; padding: 12px 16px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-family: var(--font-body); font-size: 14px;
  outline: none; cursor: none;
  transition: border-color 0.3s;
}
.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--accent);
}
.form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
.form-textarea { resize: vertical; min-height: 120px; }
.form-select { appearance: none; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-hint { font-size: 12px; color: var(--muted); margin-top: 6px; }

/* ══ SECTION DIVIDER ══ */
.panel-section {
  border: 1px solid var(--border);
  background: var(--surface); padding: 28px;
  margin-bottom: 24px;
}
.panel-section-title {
  font-family: var(--font-head); font-size: 16px; font-weight: 700;
  margin-bottom: 20px; padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  display: flex; justify-content: space-between; align-items: center;
}

/* ══ BUTTONS ══ */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; font-size: 13px; font-weight: 600;
  border: none; cursor: none; letter-spacing: 0.03em;
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
}
.btn:hover { transform: translateY(-1px); }
.btn-save { background: var(--accent); color: var(--bg); }
.btn-save:hover { box-shadow: 0 8px 20px rgba(255,107,53,0.3); }
.btn-add { background: var(--surface2); border: 1px solid var(--border); color: var(--text); }
.btn-add:hover { border-color: var(--accent); color: var(--accent); }
.btn-remove {
  background: none; border: 1px solid var(--border);
  color: var(--danger); padding: 6px 12px; font-size: 12px;
}
.btn-remove:hover { border-color: var(--danger); background: rgba(234,84,85,0.08); }
.btn-reset { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); }
.btn-reset:hover { border-color: var(--danger); color: var(--danger); }
.btn-danger { background: var(--danger); color: #fff; }

/* ══ CHIPS EDITOR ══ */
.chips-editor { display: flex; flex-direction: column; gap: 24px; }
.skill-cat-block {
  border: 1px solid var(--border); padding: 20px;
  background: var(--bg);
}
.skill-cat-header {
  display: flex; align-items: center; gap: 12px; margin-bottom: 16px;
}
.cat-name-input {
  flex: 1; padding: 8px 12px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-family: var(--font-mono); font-size: 12px;
  letter-spacing: 0.1em; outline: none; cursor: none;
  transition: border-color 0.3s;
}
.cat-name-input:focus { border-color: var(--accent); }
.chip-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
.chip-tag {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; background: var(--surface2);
  border: 1px solid var(--border); font-size: 13px;
}
.chip-tag button {
  background: none; border: none; color: var(--muted);
  cursor: none; font-size: 16px; line-height: 1;
  padding: 0; transition: color 0.2s;
}
.chip-tag button:hover { color: var(--danger); }
.add-chip-row { display: flex; gap: 8px; }
.add-chip-input {
  flex: 1; padding: 8px 12px;
  background: var(--surface2); border: 1px solid var(--border);
  color: var(--text); font-size: 13px; outline: none; cursor: none;
  transition: border-color 0.3s;
}
.add-chip-input:focus { border-color: var(--accent); }

/* ══ EXPERIENCE / PORTFOLIO ENTRIES ══ */
.entries-list { display: flex; flex-direction: column; gap: 20px; }
.entry-card {
  border: 1px solid var(--border); background: var(--bg); padding: 24px;
}
.entry-card-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px;
}
.entry-num {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--accent); letter-spacing: 0.15em;
}
.bullets-list { display: flex; flex-direction: column; gap: 8px; }
.bullet-row { display: flex; gap: 8px; align-items: center; }
.bullet-row .form-input { flex: 1; padding: 8px 12px; font-size: 13px; }

/* ══ COLOR PICKER ══ */
.color-field {
  display: flex; gap: 10px; align-items: center;
}
.color-preview {
  width: 36px; height: 36px; border: 1px solid var(--border);
  flex-shrink: 0;
}
input[type="color"] {
  width: 40px; height: 36px; border: 1px solid var(--border);
  background: none; padding: 0; cursor: none;
}

/* ══ TOAST ══ */
#toast {
  position: fixed; bottom: 32px; right: 32px; z-index: 9999;
  display: flex; align-items: center; gap: 12px;
  padding: 16px 24px;
  background: var(--surface); border: 1px solid var(--border);
  border-left: 3px solid var(--success);
  font-size: 14px; font-weight: 500;
  transform: translateY(80px); opacity: 0;
  transition: transform 0.4s var(--ease-premium), opacity 0.4s;
  pointer-events: none;
}
#toast.show { transform: translateY(0); opacity: 1; }
#toast.error { border-left-color: var(--danger); }
.toast-icon { font-size: 18px; }

/* ══ SETTINGS ══ */
.settings-warning {
  background: rgba(255,107,53,0.08); border-left: 2px solid var(--accent);
  padding: 14px 18px; font-size: 13px; color: var(--muted);
  margin-bottom: 24px;
}

/* ══ PASSWORD CHANGE ══ */
.pw-change-row { display: flex; gap: 12px; }
.pw-change-row .form-input { flex: 1; }

/* ══ SCROLLBAR ══ */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

/* ══ SOCIAL LINK EDITOR CARDS ══ */
#socials-editor { display: flex; flex-direction: column; gap: 16px; }
.social-edit-card {
  border: 1px solid var(--border);
  background: var(--bg);
  overflow: hidden;
  transition: border-color 0.3s;
}
.social-edit-card:hover { border-color: rgba(255,107,53,0.3); }
.social-edit-header {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 20px;
  background: var(--surface2);
  border-bottom: 1px solid var(--border);
}
.social-edit-preview {
  width: 38px; height: 38px;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head); font-size: 16px; font-weight: 700;
  color: var(--text); flex-shrink: 0;
  transition: background 0.2s, border-color 0.2s;
}
.social-edit-card:hover .social-edit-preview {
  background: rgba(255,107,53,0.12);
  border-color: var(--accent);
}
.social-edit-name {
  flex: 1; font-size: 14px; font-weight: 600; color: var(--text);
}
.social-edit-body { padding: 18px 20px; }

/* ══════════════════════════════════════
   RESPONSIVE — ADMIN PANEL
   Laptop 1024+ | Tablet 768–1023 |
   Mobile-L 480–767 | Mobile-S < 480
══════════════════════════════════════ */

/* ── Touch: restore normal cursor, make inputs usable ── */
@media (pointer: coarse) {
  #cursor-dot, #cursor-ring { display: none; }
  body { cursor: auto; }
  button, input, textarea, a, .btn { cursor: pointer; }
  .pw-input, .form-input, .form-textarea,
  .cat-name-input, .add-chip-input { cursor: text; }
}

/* ── LAPTOP (1024px – 1279px) ── */
@media (max-width: 1279px) and (min-width: 1024px) {
  :root { --sidebar-width: 210px; }
  .panel-content { padding: 32px; }
  .main-topbar { padding: 20px 32px; }
}

/* ── TABLET LANDSCAPE (768px – 1023px): narrow sidebar ── */
@media (max-width: 1023px) and (min-width: 768px) {
  :root { --sidebar-width: 180px; }
  .sidebar-logo { padding: 20px 16px; font-size: 17px; }
  .sidebar-label { padding: 16px 16px 6px; }
  .sidebar-nav li a { padding: 10px 8px; font-size: 12px; gap: 8px; }
  .sidebar-bottom { padding: 16px 8px; }
  .panel-content { padding: 28px; }
  .main-topbar { padding: 18px 28px; }
  .topbar-title { font-size: 19px; }
  .panel-section { padding: 20px; }
}

/* ── iPAD / MOBILE (< 768px): slide-out sidebar ── */
@media (max-width: 767px) {
  body { overflow: auto; }
  #app { height: auto; min-height: 100vh; }
  #main { overflow: visible; }

  /* Sidebar: off-canvas */
  #sidebar {
    position: fixed; left: -100%; top: 0; bottom: 0; z-index: 200;
    transition: left 0.4s var(--ease-premium);
    width: 260px;
  }
  #sidebar.open { left: 0; }

  /* Backdrop for open sidebar */
  #sidebar.open::after {
    content: '';
    position: fixed; left: 260px; top: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5); z-index: -1;
  }

  #mobile-toggle { display: flex !important; }
  .main-topbar { padding: 14px 16px; position: sticky; top: 0; }
  .topbar-title { font-size: 18px; }
  .panel-content { padding: 20px 16px; }
  .panel-section { padding: 18px 14px; }
  .panel-section-title { flex-direction: column; align-items: flex-start; gap: 12px; }

  /* Forms: stack grid columns */
  .form-row { grid-template-columns: 1fr; gap: 0; }

  /* Entry cards */
  .entry-card { padding: 16px; }
  .bullet-row { flex-wrap: wrap; }

  /* Color field: stack */
  .color-field { flex-wrap: wrap; }

  /* Toast: full width at bottom */
  #toast {
    left: 12px; right: 12px; bottom: 16px;
    font-size: 13px; padding: 12px 16px;
  }

  /* Password card */
  .pw-card { padding: 32px 20px; }

  /* Skill cat header: wrap */
  .skill-cat-header { flex-wrap: wrap; }
}

/* ── MOBILE LARGE (480px – 767px) ── */
@media (max-width: 767px) and (min-width: 480px) {
  :root { --sidebar-width: 240px; }
  .panel-content { padding: 24px 20px; }
  .main-topbar { padding: 16px 20px; }
}

/* ── MOBILE SMALL (< 480px) ── */
@media (max-width: 479px) {
  :root { --sidebar-width: 220px; }
  .panel-content { padding: 16px 12px; }
  .main-topbar { padding: 12px 12px; }
  .topbar-title { font-size: 16px; }
  .panel-section { padding: 14px 12px; margin-bottom: 16px; }
  .panel-section-title { font-size: 14px; }
  .btn { padding: 9px 14px; font-size: 12px; }
  .btn-save, .btn-add { width: 100%; justify-content: center; }
  .chip-tag { font-size: 12px; padding: 5px 10px; }
  .form-input, .form-textarea { font-size: 16px; } /* prevent iOS zoom */
  #toast { font-size: 12px; padding: 10px 14px; }
  .pw-logo { font-size: 24px; }
  .pw-card { padding: 24px 16px; }
  .pw-title { font-size: 20px; }
}
#mobile-toggle {
  display: none; background: none; border: none;
  color: var(--text); cursor: none; margin-right: 12px;
  flex-direction: column; gap: 5px; padding: 4px;
}
#mobile-toggle span { display: block; width: 22px; height: 1.5px; background: currentColor; }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<!-- ══ CURSOR ══ -->
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>

<!-- ══ PASSWORD SCREEN ══ -->
<div id="password-screen">
  <div class="pw-logo">H<span>.</span>P Admin</div>
  <div class="pw-card">
    <div class="pw-title">Access Required</div>
    <p class="pw-sub">Enter your password to access the CV control panel</p>
    <input type="password" class="pw-input" id="pw-input" placeholder="Password" autocomplete="current-password">
    <button class="pw-btn" id="pw-submit">Enter Panel</button>
    <p class="pw-error" id="pw-error"></p>
  </div>
</div>

<!-- ══ MAIN APP ══ -->
<div id="app">
  <!-- SIDEBAR -->
  <aside id="sidebar">
    <div class="sidebar-logo">A<span>.</span>M <small style="font-size:12px;font-weight:400;color:var(--muted)">Admin</small></div>
    <p class="sidebar-label">Sections</p>
    <ul class="sidebar-nav" id="sidebar-nav">
      <li><a href="#" class="active" data-panel="hero">
        <span class="sidebar-icon">◆</span> Hero
      </a></li>
      <li><a href="#" data-panel="about">
        <span class="sidebar-icon">◇</span> About
      </a></li>
      <li><a href="#" data-panel="skills">
        <span class="sidebar-icon">◈</span> Skills
      </a></li>
      <li><a href="#" data-panel="experience">
        <span class="sidebar-icon">◉</span> Experience
      </a></li>
      <li><a href="#" data-panel="portfolio">
        <span class="sidebar-icon">○</span> Portfolio
      </a></li>
      <li><a href="#" data-panel="contact">
        <span class="sidebar-icon">✉</span> Contact
      </a></li>
      <li><a href="#" data-panel="settings">
        <span class="sidebar-icon">⚙</span> Settings
      </a></li>
    </ul>
    <div class="sidebar-bottom">
      <button class="preview-btn" id="preview-btn" onclick="window.open('index.html','_blank')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Preview CV
      </button>
    </div>
  </aside>

  <!-- MAIN CONTENT -->
  <main id="main">
    <div class="main-topbar">
      <div style="display:flex;align-items:center;gap:12px">
        <button id="mobile-toggle" aria-label="Toggle menu"><span></span><span></span><span></span></button>
        <div class="topbar-title" id="topbar-title">Hero</div>
      </div>
      <div class="topbar-actions">
        <button class="btn btn-reset" id="reset-btn" style="display:none">↺ Reset All</button>
      </div>
    </div>

    <!-- ══ PANEL: HERO ══ -->
    <div class="panel-content active" id="panel-hero">
      <div class="panel-section">
        <div class="panel-section-title">Hero Content
          <button class="btn btn-save" onclick="saveHero()">Save Changes</button>
        </div>
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input type="text" class="form-input" id="hero-name" placeholder="haikal pasha">
        </div>
        <div class="form-group">
          <label class="form-label">Job Title (shown in initials card)</label>
          <input type="text" class="form-input" id="hero-title" placeholder="Creative Designer">
        </div>
        <div class="form-group">
          <label class="form-label">Typewriter Roles <span class="form-hint" style="display:inline">(one per line — cycles through these)</span></label>
          <textarea class="form-textarea" id="hero-roles" rows="4" placeholder="Creative Designer&#10;Brand Strategist&#10;Visual Storyteller"></textarea>
          <p class="form-hint">Each line becomes one role in the typewriter animation.</p>
        </div>
        <button class="btn btn-save" onclick="saveHero()">Save Changes</button>
      </div>
    </div>

    <!-- ══ PANEL: ABOUT ══ -->
    <div class="panel-content" id="panel-about">
      <div class="panel-section">
        <div class="panel-section-title">About Bio
          <button class="btn btn-save" onclick="saveAbout()">Save Changes</button>
        </div>
        <div class="form-group">
          <label class="form-label">Bio Text</label>
          <textarea class="form-textarea" id="about-bio" rows="8" placeholder="Your bio here..."></textarea>
          <p class="form-hint">Separate paragraphs with a blank line. You can use &lt;strong&gt; for bold text.</p>
        </div>
        <button class="btn btn-save" onclick="saveAbout()">Save Changes</button>
      </div>

      <!-- Stats -->
      <div class="panel-section">
        <div class="panel-section-title">About Stats</div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Years Experience</label>
            <input type="text" class="form-input" id="stat-years" placeholder="5+">
          </div>
          <div class="form-group">
            <label class="form-label">Projects Delivered</label>
            <input type="text" class="form-input" id="stat-projects" placeholder="60+">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Happy Clients</label>
            <input type="text" class="form-input" id="stat-clients" placeholder="30+">
          </div>
          <div class="form-group">
            <label class="form-label">Awards Won</label>
            <input type="text" class="form-input" id="stat-awards" placeholder="12">
          </div>
        </div>
        <button class="btn btn-save" onclick="saveAbout()">Save Changes</button>
      </div>

      <!-- Photo -->
      <div class="panel-section">
        <div class="panel-section-title">Profile Photo</div>
        <div style="display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap">
          <div id="photo-preview-wrap" style="width:140px;height:170px;background:var(--surface2);border:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
            <span id="photo-preview-initials" style="font-family:var(--font-head);font-size:36px;color:var(--muted);opacity:0.4">AM</span>
            <img id="photo-preview-img" alt="Preview" style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover">
          </div>
          <div style="flex:1">
            <div class="form-group">
              <label class="form-label">Upload Photo</label>
              <input type="file" id="photo-upload" accept="image/*" style="display:none" onchange="handlePhotoUpload(event)">
              <button class="btn btn-add" onclick="document.getElementById('photo-upload').click()">📁 Choose Image</button>
              <p class="form-hint" style="margin-top:8px">Recommended: square image, JPG or PNG. Will be compressed automatically.</p>
            </div>
            <div style="display:flex;gap:10px;flex-wrap:wrap">
              <button class="btn btn-save" onclick="saveAbout()">Save Changes</button>
              <button class="btn btn-remove" onclick="removePhoto()">✕ Remove Photo</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══ PANEL: SKILLS ══ -->
    <div class="panel-content" id="panel-skills">
      <div class="panel-section">
        <div class="panel-section-title">
          Skills & Tools
          <button class="btn btn-add" onclick="addSkillCategory()">+ Add Category</button>
        </div>
        <div class="chips-editor" id="skills-editor"></div>
        <br>
        <button class="btn btn-save" onclick="saveSkills()">Save Changes</button>
      </div>
    </div>

    <!-- ══ PANEL: EXPERIENCE ══ -->
    <div class="panel-content" id="panel-experience">
      <div class="panel-section">
        <div class="panel-section-title">
          Work Experience
          <button class="btn btn-add" onclick="addExperienceEntry()">+ Add Job</button>
        </div>
        <div class="entries-list" id="experience-editor"></div>
        <br>
        <button class="btn btn-save" onclick="saveExperience()">Save Changes</button>
      </div>
    </div>

    <!-- ══ PANEL: PORTFOLIO ══ -->
    <div class="panel-content" id="panel-portfolio">
      <div class="panel-section">
        <div class="panel-section-title">
          Portfolio Projects
          <button class="btn btn-add" onclick="addPortfolioEntry()">+ Add Project</button>
        </div>
        <div class="entries-list" id="portfolio-editor"></div>
        <br>
        <button class="btn btn-save" onclick="savePortfolio()">Save Changes</button>
      </div>
    </div>

    <!-- ══ PANEL: CONTACT ══ -->
    <div class="panel-content" id="panel-contact">
      <div class="panel-section">
        <div class="panel-section-title">Contact Details
          <button class="btn btn-save" onclick="saveContact()">Save Changes</button>
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" class="form-input" id="contact-email" placeholder="haikalpasha207@gmail.com">
        </div>
        <button class="btn btn-save" onclick="saveContact()">Save Changes</button>
      </div>

      <div class="panel-section">
        <div class="panel-section-title">
          Social Media Links
          <button class="btn btn-add" onclick="addSocialLink()">+ Add Platform</button>
        </div>
        <p style="font-size:13px;color:var(--muted);margin-bottom:20px">Add, edit, or remove social media profiles shown on your CV. Each link appears as an icon button in the contact section.</p>
        <div id="socials-editor"></div>
        <br>
        <button class="btn btn-save" onclick="saveContact()">Save Changes</button>
      </div>
    </div>

    <!-- ══ PANEL: SETTINGS ══ -->
    <div class="panel-content" id="panel-settings">
      <div class="panel-section">
        <div class="panel-section-title">Change Admin Password</div>
        <div class="settings-warning">
          ⚠ Make sure to remember your new password. There is no recovery mechanism.
        </div>
        <div class="form-group">
          <label class="form-label">Current Password</label>
          <input type="password" class="form-input" id="pw-current" placeholder="Current password">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">New Password</label>
            <input type="password" class="form-input" id="pw-new" placeholder="New password">
          </div>
          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input type="password" class="form-input" id="pw-confirm" placeholder="Confirm new password">
          </div>
        </div>
        <button class="btn btn-save" onclick="changePassword()">Update Password</button>
      </div>

      <div class="panel-section">
        <div class="panel-section-title">Data Management</div>
        <p style="font-size:14px;color:var(--muted);margin-bottom:20px">
          All CV data is stored locally in your browser's localStorage. 
          Resetting will restore all content to the built-in placeholder defaults.
        </p>
        <button class="btn btn-danger" onclick="confirmReset()">Reset All Content to Defaults</button>
      </div>
    </div>

  </main>
</div>

<!-- TOAST -->
<div id="toast">
  <span class="toast-icon" id="toast-icon">✓</span>
  <span id="toast-msg">Changes saved successfully</span>
</div>

` }} />
    </>
  );
}
