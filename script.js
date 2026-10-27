/* =========================================================
   NEO-BRUTALIST PORTFOLIO + ARTCRAFT SCROLL HUD — script.js
   Smooth inertia scrolling + Precision Vernier Scale ruler
   ========================================================= */

let lenisInstance = null;

/* --- 1. Lenis Smooth Momentum Scroll (ArtCraft aesthetic) --- */
function initLenis() {
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/* --- 2. ArtCraft Precision Vernier Scroll Ruler & HUD --- */
function initArtCraftRuler() {
  const rulerEl = document.getElementById('artcraft-ruler');
  const rulerTrack = document.getElementById('ruler-track');
  const needle = document.getElementById('ruler-needle');
  const needleBadge = document.getElementById('ruler-needle-badge');
  const percentVal = document.getElementById('ruler-percent-val');
  const ghost = document.getElementById('ruler-ghost');
  const dirLinks = document.querySelectorAll('.artcraft-dir-list .dir-item');

  if (!rulerTrack || !needle || !percentVal) return;

  // Generate precision tick marks from 0% to 100%
  const fragment = document.createDocumentFragment();
  const majorStep = 10;
  const mediumStep = 5;
  const minorStep = 2.5;

  for (let p = 0; p <= 100; p += minorStep) {
    const isMajor = Math.abs(p % majorStep) < 0.01;
    const isMedium = !isMajor && Math.abs(p % mediumStep) < 0.01;

    const tick = document.createElement('div');
    tick.className = `ruler-tick ${isMajor ? 'major' : isMedium ? 'medium' : 'minor'}`;
    tick.style.top = `${p}%`;

    if (isMajor) {
      const numSpan = document.createElement('span');
      numSpan.className = 'ruler-tick-num';
      numSpan.textContent = Math.round(p);
      tick.appendChild(numSpan);
    }

    const mark = document.createElement('span');
    mark.className = 'ruler-tick-mark';
    tick.appendChild(mark);

    fragment.appendChild(tick);
  }
  rulerTrack.appendChild(fragment);

  // Section list
  const sectionIds = ['home', 'about', 'skills', 'projects', 'experience', 'research', 'contact'];

  // Update needle and directory on scroll
  function updateRuler() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
    const percent = ratio * 100;

    needle.style.top = `${percent}%`;
    percentVal.textContent = Math.round(percent).toString().padStart(2, '0');

    // Section highlighting
    const scrollMiddle = scrollY + window.innerHeight * 0.35;
    let activeIdx = 0;

    sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop;
        if (scrollMiddle >= top) {
          activeIdx = idx;
        }
      }
    });

    dirLinks.forEach((link, idx) => {
      if (idx === activeIdx) {
        link.classList.add('active');
        link.classList.remove('passed');
      } else if (idx < activeIdx) {
        link.classList.remove('active');
        link.classList.add('passed');
      } else {
        link.classList.remove('active');
        link.classList.remove('passed');
      }
    });
  }

  window.addEventListener('scroll', updateRuler, { passive: true });
  updateRuler();

  // Ghost indicator on mouse hover
  if (rulerEl && ghost) {
    rulerEl.addEventListener('mousemove', (e) => {
      const rect = rulerEl.getBoundingClientRect();
      const y = e.clientY - rect.top;
      ghost.style.top = `${y}px`;
    });
  }

  // Click & drag scrub
  let isDragging = false;

  function handleScrub(e) {
    const rect = rulerEl.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const targetRatio = Math.max(0, Math.min(1, clickY / rect.height));
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = targetRatio * maxScroll;

    if (lenisInstance) {
      lenisInstance.scrollTo(targetScroll);
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }

  if (rulerEl) {
    rulerEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      handleScrub(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) handleScrub(e);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  // Directory links smooth scroll
  dirLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const offset = 70;
        const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
        if (lenisInstance) {
          lenisInstance.scrollTo(targetTop);
        } else {
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }
    });
  });
}

/* --- 3. Reveal elements on scroll --- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
  els.forEach(el => io.observe(el));
}

/* --- 4. Skill cards around portrait --- */
function initSkillCards() {
  const cards = document.querySelectorAll('.skill-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        cards.forEach((card, i) => {
          setTimeout(() => card.classList.add('is-visible'), i * 120);
        });
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const hero = document.getElementById('home');
  if (hero) io.observe(hero);
}

/* --- 5. Active nav link on scroll --- */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => io.observe(s));
}

/* --- 6. Header shadow on scroll --- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* --- 7. Mobile menu toggle --- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  if (!btn || !drawer) return;
  btn.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => drawer.classList.remove('open'));
  });
}

/* --- 8. Contact form: mailto submit --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name']?.value || '';
    const email = form.elements['email']?.value || '';
    const message = form.elements['message']?.value || '';
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    window.location.href = `mailto:peelachakradhar@gmail.com?subject=${subject}&body=${body}`;
  });
}

/* --- Boot --- */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initArtCraftRuler();
  initReveal();
  initSkillCards();
  initNavHighlight();
  initHeaderScroll();
  initMobileMenu();
  initContactForm();
});
