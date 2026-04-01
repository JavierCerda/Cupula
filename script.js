/* ===== NAV SCROLL ===== */
const nav = document.getElementById('nav');
const fab = document.getElementById('fab');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  nav.classList.toggle('scrolled', scrolled);
  fab.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ===== MOBILE NAV ===== */
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ===== REVEAL ON SCROLL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (entry.target.dataset.delay || 0) * 1);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  // Stagger sibling reveals
  const parent = el.parentElement;
  const siblings = Array.from(parent.querySelectorAll(':scope > .reveal'));
  const siblingIndex = siblings.indexOf(el);
  el.style.transitionDelay = `${siblingIndex * 80}ms`;
  revealObserver.observe(el);
});

/* ===== REVIEWS CAROUSEL ===== */
const track = document.getElementById('resenasTrack');
const resenas = track ? track.querySelectorAll('.resena') : [];
const dotsContainer = document.getElementById('resenasDots');
const prevBtn = document.getElementById('resenaPrev');
const nextBtn = document.getElementById('resenaNext');

let currentResena = 0;
let itemsVisible = 3;

function getVisibleItems() {
  if (window.innerWidth <= 768) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function buildDots() {
  if (!dotsContainer) return;
  itemsVisible = getVisibleItems();
  const totalDots = Math.ceil(resenas.length / itemsVisible);
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('button');
    dot.className = 'resenas__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Página ${i + 1}`);
    dot.addEventListener('click', () => goToResena(i));
    dotsContainer.appendChild(dot);
  }
}

function goToResena(index) {
  itemsVisible = getVisibleItems();
  const totalPages = Math.ceil(resenas.length / itemsVisible);
  currentResena = Math.max(0, Math.min(index, totalPages - 1));
  const offset = currentResena * (100 / itemsVisible) * itemsVisible;
  track.style.transform = `translateX(-${(currentResena * 100)}%)`;

  // Update dots
  document.querySelectorAll('.resenas__dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentResena);
  });
}

function updateCarouselWidth() {
  itemsVisible = getVisibleItems();
  resenas.forEach(r => {
    r.style.minWidth = `calc(${100 / itemsVisible}% - 2rem)`;
  });
  buildDots();
  goToResena(0);
}

if (track && resenas.length) {
  prevBtn.addEventListener('click', () => goToResena(currentResena - 1));
  nextBtn.addEventListener('click', () => goToResena(currentResena + 1));
  updateCarouselWidth();
  window.addEventListener('resize', updateCarouselWidth, { passive: true });

  // Auto-advance
  setInterval(() => {
    const totalPages = Math.ceil(resenas.length / getVisibleItems());
    goToResena((currentResena + 1) % totalPages);
  }, 6000);
}

/* ===== SMOOTH ANCHOR SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

/* ===== GALLERY LIGHTBOX (simple) ===== */
const galItems = document.querySelectorAll('.galeria__item img');
galItems.forEach(img => {
  img.style.cursor = 'zoom-in';
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;cursor:zoom-out;animation:fadeIn 0.3s ease';
    const style = document.createElement('style');
    style.textContent = '@keyframes fadeIn{from{opacity:0}to{opacity:1}}';
    document.head.appendChild(style);
    const clone = document.createElement('img');
    clone.src = img.src;
    clone.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:2px;box-shadow:0 32px 80px rgba(0,0,0,0.5)';
    overlay.appendChild(clone);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', () => {
      document.body.removeChild(overlay);
      document.body.style.overflow = '';
    });
  });
});
