document.addEventListener('DOMContentLoaded', () => {
  AOS.init({ duration: 600, easing: 'ease-out-cubic', once: true, offset: 50 });

  initNav();
  initMobileMenu();
  initCounters();
  initForm();
  initBackToTop();
});

/* ─── NAVBAR ─── */
function initNav() {
  const nav     = document.getElementById('siteNav');
  const links   = document.querySelectorAll('.nav-links a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(s => io.observe(s));
}

/* ─── MOBILE MENU ─── */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  function closeMenu() {
    links.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu() {
    links.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    /* no body overflow lock — menu is a small dropdown, not full-screen */
  }

  toggle.addEventListener('click', () => {
    links.classList.contains('open') ? closeMenu() : openMenu();
  });

  /* close on link click */
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  /* close when clicking outside menu + toggle */
  document.addEventListener('click', e => {
    if (
      links.classList.contains('open') &&
      !links.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      closeMenu();
    }
  });

  /* close on Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ─── COUNTERS ─── */
function initCounters() {
  const nums = document.querySelectorAll('.hstat-n[data-count]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = +e.target.dataset.count;
      const step   = 16;
      const inc    = target / (1400 / step);
      let cur      = 0;
      const t      = setInterval(() => {
        cur = Math.min(cur + inc, target);
        e.target.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(t);
      }, step);
    });
  }, { threshold: .6 });

  nums.forEach(n => io.observe(n));
}

/* ─── CONTACT FORM ─── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const btn     = form.querySelector('.btn-solid');
    const txt     = btn.querySelector('.btn-txt');
    const spin    = btn.querySelector('.btn-spin');
    const success = form.querySelector('.cform-success');

    txt.classList.add('d-none');
    spin.classList.remove('d-none');
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        success.classList.remove('d-none');
        form.reset();
        setTimeout(() => success.classList.add('d-none'), 5000);
      } else {
        alert('Something went wrong. Please email me directly at a.projeects@gmail.com');
      }
    } catch {
      alert('Network error. Please try again or email me directly.');
    } finally {
      txt.classList.remove('d-none');
      spin.classList.add('d-none');
      btn.disabled = false;
    }
  });
}

/* ─── BACK TO TOP ─── */
function initBackToTop() {
  const btn = document.getElementById('btt');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 420);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
