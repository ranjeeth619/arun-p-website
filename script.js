// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Highlight nav links: click + smooth scroll with temporary suppression of scroll handler
const navAnchors = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('header[id], section[id]');
let suppressScrollUpdate = false;

navAnchors.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();

    // mark clicked link active immediately
    navAnchors.forEach(x => x.classList.remove('active'));
    e.currentTarget.classList.add('active');

    // close mobile menu if open
    hamburger?.classList.remove('active');
    navLinks.classList.remove('active');

    // perform smooth scroll and suppress scroll handler while animating
    const target = document.querySelector(e.currentTarget.getAttribute('href'));
    if (!target) return;

    suppressScrollUpdate = true;
    target.scrollIntoView({ behavior: 'smooth' });

    // un-suppress after animation (adjust timeout if needed)
    setTimeout(() => { suppressScrollUpdate = false; }, 900);
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize Swiper
const swiper = new Swiper('.mySwiper', {
  loop: true,
  autoplay: {
    delay: 3000,
  },
  pagination: {
    el: '.swiper-pagination',
  },
});

// Update active nav on manual scroll (ignored during programmatic scroll)
window.addEventListener('scroll', () => {
  if (suppressScrollUpdate) return;

  const fromTop = window.scrollY + 90; // adjust for fixed navbar height
  sections.forEach(sec => {
    const id = sec.id;
    if (!id) return;
    const link = document.querySelector('.nav-links a[href="#' + id + '"]');
    if (!link) return;
    if (sec.offsetTop <= fromTop && (sec.offsetTop + sec.offsetHeight) > fromTop) {
      navAnchors.forEach(x => x.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

// Contact form submit (local demo, no backend)
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // simple client validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    if (!name || !email || !message) {
      // flash border on missing fields
      [ 'name','email','message' ].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value.trim()) {
          el.style.boxShadow = '0 6px 18px rgba(220,38,38,0.12)';
          setTimeout(()=> el.style.boxShadow = '', 1200);
        }
      });
      return;
    }

    // show success message with AOS animation
    contactSuccess.style.display = 'block';
    contactSuccess.setAttribute('aria-hidden','false');
    contactSuccess.classList.add('aos-animate');
    contactForm.reset();

    // optionally hide success after 4s
    setTimeout(() => {
      contactSuccess.style.display = 'none';
      contactSuccess.setAttribute('aria-hidden','true');
    }, 4000);
  });
}

// Ensure AOS is initialized (if not already)
if (window.AOS) {
  AOS.init({ duration: 700, easing: 'ease-out-quart', once: true });
}
