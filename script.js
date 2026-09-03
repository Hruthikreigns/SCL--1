/* =========================================================
   SANTHIPURAM CHAMPIONS LEAGUE — SEASON 1
   script.js
   ========================================================= */

'use strict';

/* =====================================================
   TEAMS DATA
   To add real teams, fill in the objects below.
   Each object accepts:
     name      (string)  — team display name
     abbr      (string)  — 2-3 char abbreviation for the crest
     captain   (string)  — captain name or "TBC"
     color     (string)  — CSS color for the accent strip
     squad     (number)  — squad size once confirmed, default 15
   ===================================================== */
const TEAMS = [
  /* INSERT REAL TEAMS BELOW — example format:
  {
    name: "Royal Challengers",
    abbr: "RC",
    captain: "Player Name",
    color: "#D00000",
    squad: 15
  },
  */
  { name:"Team 01", abbr:"T1", captain:"TBC", color:"#D4AF37", squad:15 },
  { name:"Team 02", abbr:"T2", captain:"TBC", color:"#D00000", squad:15 },
  { name:"Team 03", abbr:"T3", captain:"TBC", color:"#4488FF", squad:15 },
  { name:"Team 04", abbr:"T4", captain:"TBC", color:"#44CC88", squad:15 },
  { name:"Team 05", abbr:"T5", captain:"TBC", color:"#CC44AA", squad:15 },
  { name:"Team 06", abbr:"T6", captain:"TBC", color:"#FF8A3A", squad:15 },
  { name:"Team 07", abbr:"T7", captain:"TBC", color:"#AA44CC", squad:15 },
  { name:"Team 08", abbr:"T8", captain:"TBC", color:"#44CCCC", squad:15 },
  { name:"Team 09", abbr:"T9", captain:"TBC", color:"#CCCC44", squad:15 },
  { name:"Team 10", abbr:"T10", captain:"TBC", color:"#FF4466", squad:15 },
  { name:"Team 11", abbr:"T11", captain:"TBC", color:"#888888", squad:15 },
  { name:"Team 12", abbr:"T12", captain:"TBC", color:"#CC8844", squad:15 },
];

/* =====================================================
   GOLDEN SPARK PARTICLES
   ===================================================== */
(function initSparks () {
  const canvas = document.getElementById('sparks');
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx  = canvas.getContext('2d');
  let W, H, rafId;
  const particles = [];
  const MAX = 55;

  function resize () {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Spark {
    constructor () { this.reset(true) }
    reset (init) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 6;
      this.vx = (Math.random() - .5) * .55;
      this.vy = -(Math.random() * .9 + .25);
      this.r  = Math.random() * 2.1 + .5;
      this.a  = Math.random() * .7 + .25;
      this.life = 0;
      this.maxLife = Math.random() * 220 + 140;
      // gold through red-gold hue range
      const hue = 36 + Math.random() * 26;
      this.color = `hsl(${hue},96%,68%)`;
    }
    update () {
      this.x += this.vx + Math.sin(this.life * .045) * .28;
      this.y += this.vy;
      this.life++;
      if (this.y < -10 || this.life > this.maxLife) this.reset(false);
    }
    draw () {
      const prog = this.life / this.maxLife;
      const alpha = this.a * Math.sin(prog * Math.PI);
      ctx.globalAlpha = alpha;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 8;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < MAX; i++) particles.push(new Spark());

  function loop () {
    ctx.clearRect(0, 0, W, H);
    ctx.shadowBlur = 0;
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize, { passive:true });
  resize();
  loop();

  // Pause when tab is hidden to save CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else loop();
  });
})();


/* =====================================================
   HEADER — sticky class + active nav link
   ===================================================== */
(function initHeader () {
  const header = document.getElementById('siteHeader');
  const links  = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  function onScroll () {
    header.classList.toggle('is-stuck', window.scrollY > 48);

    // Highlight the active section link
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 120) current = '#' + sec.id;
    });
    links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === current));
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();
})();


/* =====================================================
   HAMBURGER NAVIGATION
   ===================================================== */
(function initNav () {
  const toggle = document.getElementById('navToggle');
  const nav    = document.getElementById('primaryNav');
  if (!toggle || !nav) return;

  const menuIcon = toggle.querySelector('.ico use');
  const openIcon = '#i-menu';
  const closeIcon = '#i-close';

  function setOpen (open) {
    toggle.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open);
    menuIcon.setAttribute('href', open ? closeIcon : openIcon);
    document.body.classList.toggle('no-scroll', open);
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('is-open')) {
      setOpen(false);
    }
  });
})();


/* =====================================================
   INTERSECTION-OBSERVER — reveal on scroll
   ===================================================== */
(function initReveal () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


/* =====================================================
   ANIMATED COUNTERS
   ===================================================== */
(function initCounters () {
  function formatIN (n) {
    // Indian number formatting: 1,00,000
    const s = Math.round(n).toString();
    if (s.length <= 3) return s;
    const last3 = s.slice(-3);
    const rest   = s.slice(0, -3);
    return rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el      = entry.target;
      const target  = +el.dataset.count;
      const prefix  = el.dataset.prefix  || '';
      const suffix  = el.dataset.suffix  || '';
      const fmt     = el.dataset.format  || 'plain';
      const dur     = 1800;
      const start   = performance.now();

      function tick (now) {
        const prog  = Math.min((now - start) / dur, 1);
        const ease  = 1 - Math.pow(1 - prog, 3); // ease-out cubic
        const value = Math.round(ease * target);
        el.textContent = prefix + (fmt === 'in' ? formatIN(value) : value) + suffix;
        if (prog < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.count').forEach(el => io.observe(el));
})();


/* =====================================================
   TEAMS GRID
   ===================================================== */
(function renderTeams () {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;

  TEAMS.forEach((team, idx) => {
    const card = document.createElement('article');
    card.className = 'team-card reveal';
    card.style.setProperty('--team', team.color);

    card.innerHTML = `
      <div class="team-crest" style="background:linear-gradient(140deg,${darken(team.color,.4)},${team.color} 55%,${lighten(team.color,.25)})" aria-hidden="true">
        ${team.abbr}
      </div>
      <h3>${team.name}</h3>
      <span class="team-tag">SCL Season 1</span>
      <ul class="team-meta">
        <li><b>Captain</b><span>${team.captain}</span></li>
        <li><b>Squad</b><span>${team.squad} members</span></li>
      </ul>
    `;

    grid.appendChild(card);
  });

  // Re-run reveal observer for the newly added cards
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  grid.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Helpers
  function darken (hex, amt) { return shiftColor(hex, -amt) }
  function lighten (hex, amt) { return shiftColor(hex,  amt) }
  function shiftColor (hex, amt) {
    const h = hex.replace('#','');
    const num = parseInt(h.length === 3
      ? h.split('').map(c=>c+c).join('') : h, 16);
    const r = clampByte(((num>>16)&0xFF) + Math.round(amt * 255));
    const g = clampByte(((num>>8) &0xFF) + Math.round(amt * 255));
    const b = clampByte(( num     &0xFF) + Math.round(amt * 255));
    return `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
  }
  function clampByte (v) { return Math.max(0, Math.min(255, v)) }
})();


/* =====================================================
   GALLERY FILTERS
   ===================================================== */
(function initGallery () {
  const buttons = document.querySelectorAll('.filter');
  const shots   = document.querySelectorAll('.shot');
  const empty   = document.getElementById('galleryEmpty');

  function applyFilter (filter) {
    let visible = 0;
    shots.forEach(shot => {
      const cats = (shot.dataset.cat || '').split(' ');
      const show = filter === 'all' || cats.includes(filter);
      shot.classList.toggle('is-hidden', !show);
      if (show) visible++;
    });
    empty && (empty.hidden = visible > 0);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-selected','false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected','true');
      applyFilter(btn.dataset.filter);
    });
  });
})();


/* =====================================================
   LIGHTBOX
   ===================================================== */
(function initLightbox () {
  const lb     = document.getElementById('lightbox');
  const img    = document.getElementById('lightboxImg');
  const cap    = document.getElementById('lightboxCap');
  const close  = document.getElementById('lightboxClose');
  if (!lb) return;

  let prevFocus;

  function open (src, caption, alt) {
    prevFocus = document.activeElement;
    img.src = src;
    img.alt = alt || caption || '';
    cap.textContent = caption || '';
    lb.hidden = false;
    document.body.classList.add('no-scroll');
    close.focus();
    lb.addEventListener('keydown', trap);
  }

  function closeLb () {
    lb.hidden = true;
    document.body.classList.remove('no-scroll');
    lb.removeEventListener('keydown', trap);
    if (prevFocus) prevFocus.focus();
  }

  function trap (e) {
    if (e.key === 'Escape') closeLb();
    if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
  }

  close.addEventListener('click', closeLb);
  lb.addEventListener('click', e => { if (e.target === lb || e.target.tagName === 'FIGURE') closeLb(); });

  document.querySelectorAll('.shot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const full    = btn.dataset.full;
      const caption = btn.dataset.caption;
      const alt     = btn.querySelector('img')?.alt || '';
      open(full, caption, alt);
    });
  });
})();


/* =====================================================
   RULEBOOK — open one rule at a time on mobile
   ===================================================== */
(function initRules () {
  const rules = document.querySelectorAll('.rule');
  rules.forEach(rule => {
    rule.addEventListener('toggle', () => {
      if (rule.open && window.innerWidth < 820) {
        rules.forEach(r => { if (r !== rule && r.open) r.open = false; });
      }
    });
  });
})();


/* =====================================================
   SMOOTH SCROLL (for browsers that don't support it natively)
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id  = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior:'smooth', block:'start' });
    // Update URL without triggering scroll
    history.pushState(null, '', '#' + id);
  });
});


/* =====================================================
   FOOTER — current year
   ===================================================== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
