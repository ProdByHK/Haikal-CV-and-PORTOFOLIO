"use client";
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Run the extracted script
    const script = document.createElement('script');
    script.src = '/script.js';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `

<!-- ══ CURSOR ══ -->
<div id="cursor-dot"></div>
<div id="cursor-ring"></div>

<!-- ══ NAVBAR ══ -->
<nav id="navbar" role="navigation" aria-label="Main navigation">
  <a href="#hero" class="nav-logo" id="nav-logo">A<span>.</span>M</a>
  <ul class="nav-links" id="nav-links">
    <li><a href="#about" class="nav-link">About</a></li>
    <li><a href="#skills" class="nav-link">Skills</a></li>
    <li><a href="#experience" class="nav-link">Experience</a></li>
    <li><a href="#portfolio" class="nav-link">Work</a></li>
    <li><a href="#contact" class="nav-link">Contact</a></li>
  </ul>
  <button class="nav-hamburger" id="hamburger" aria-label="Open menu">
    <span></span><span></span><span></span>
  </button>
</nav>
<div id="drawer-overlay"></div>
<nav id="nav-drawer" aria-label="Mobile navigation">
  <a href="#about" class="drawer-link">About</a>
  <a href="#skills" class="drawer-link">Skills</a>
  <a href="#experience" class="drawer-link">Experience</a>
  <a href="#portfolio" class="drawer-link">Work</a>
  <a href="#contact" class="drawer-link">Contact</a>
</nav>

<!-- ══ HERO ══ -->
<section id="hero" aria-label="Hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-content">
    <p class="hero-eyebrow" id="hero-eyebrow">Portfolio — 2024</p>
    <h1 id="hero-name" aria-label="haikal pasha"></h1>
    <div class="hero-subtitle">
      <span class="typewriter-prefix">I am a </span>
      <span id="typewriter-text"></span>
    </div>
    <div class="hero-cta-group">
      <a href="#portfolio" class="btn-primary hoverable">View My Work</a>
      <a href="#contact" class="btn-outline hoverable">Get In Touch</a>
    </div>
  </div>
  <div class="scroll-indicator" aria-hidden="true">
    <span>Scroll</span>
    <div class="scroll-arrow"></div>
  </div>
</section>

<!-- ══ ABOUT ══ -->
<section id="about" aria-label="About">
  <div class="container">
    <p class="section-label reveal">01 — About Me</p>
    <div class="about-grid">
      <div class="reveal">
        <h2 class="section-title" style="margin-bottom:32px">Crafting Bold<br>Visual Worlds</h2>
        <div class="divider"></div>
        <div class="about-bio" id="about-bio-content">
          <p>I craft <strong>bold visual identities</strong> and digital experiences that people remember. Based in [City], working worldwide.</p>
          <p>Every project starts with a simple idea: what story needs to be told, and how can design make it unforgettable?</p>
        </div>
        <div class="about-stats" id="about-stats"></div>
      </div>
      <div class="about-visual reveal">
        <div class="initials-block" id="about-initials-block">
          <img id="about-photo-img" alt="Profile photo"
               style="display:none;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2">
          <div class="initials-text" id="about-initials">AM</div>
          <div class="initials-overlay">
            <div class="initials-name" id="about-name-card">haikal pasha</div>
            <div class="initials-role" id="about-role-card">Creative Designer</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ══ SKILLS ══ -->
<section id="skills" aria-label="Skills">
  <div class="container">
    <p class="section-label reveal">02 — Skills & Tools</p>
    <h2 class="section-title reveal">My Toolkit</h2>
    <div class="skills-grid" id="skills-grid"></div>
  </div>
</section>

<!-- ══ EXPERIENCE ══ -->
<section id="experience" aria-label="Experience">
  <div class="container">
    <p class="section-label reveal">03 — Experience</p>
    <h2 class="section-title reveal">Where I've<br>Made an Impact</h2>
    <div class="timeline" id="timeline">
      <div class="timeline-line" id="timeline-line"></div>
      <div id="timeline-entries"></div>
    </div>
  </div>
</section>

<!-- ══ PORTFOLIO ══ -->
<section id="portfolio" aria-label="Portfolio">
  <div class="container">
    <p class="section-label reveal">04 — Selected Work</p>
    <h2 class="section-title reveal">Projects That<br>Define Me</h2>
    <div class="portfolio-grid" id="portfolio-grid"></div>
  </div>
</section>

<!-- ══ CONTACT ══ -->
<section id="contact" aria-label="Contact">
  <div class="container">
    <div class="contact-heading" id="contact-heading" aria-label="Let's Talk">
      <span class="split-word" style="transition-delay:0s">Let's</span>&nbsp;<span class="split-word" style="transition-delay:0.15s">Talk</span>
    </div>
    <p class="contact-sub" id="contact-sub">Have a project in mind? I'd love to collaborate and bring your vision to life.</p>
    <a href="#" class="contact-email-btn hoverable" id="contact-email-link" aria-label="Send email">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
      <span id="contact-email-text">haikalpasha207@gmail.com</span>
    </a>
    <ul class="social-row" id="social-row"></ul>
    <div class="contact-footer">
      <span id="footer-name">haikal pasha</span> &nbsp;·&nbsp; © <span id="footer-year">2024</span> &nbsp;·&nbsp; All rights reserved
    </div>
  </div>
</section>

` }} />
  );
}
