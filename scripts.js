// =========================================================
//    NOAH'S WAX N' WRENCH
//    JavaScript Functionality
// =========================================================

// =========================================================
//    MOBILE MENU TOGGLE
// =========================================================

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

// Ensure mobile nav is hidden on page load
if (mobileNav) {
  mobileNav.style.display = 'none';
  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    mobileNav.style.display = isExpanded ? 'none' : 'flex';
    
    // Animate burger menu
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
      if (!isExpanded) {
        if (index === 0) span.style.transform = 'rotate(45deg) translateY(12px)';
        if (index === 1) span.style.opacity = '0';
        if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-12px)';
      } else {
        span.style.transform = 'none';
        span.style.opacity = '1';
      }
    });
  });

  // Close mobile menu when a link is clicked
  const mobileNavLinks = mobileNav.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.style.display = 'none';
      const spans = menuToggle.querySelectorAll('span');
      spans.forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
      });
    });
  });
}

// =========================================================
//    PREVENT SCROLL POSITION JUMP ON PAGE LOAD
// =========================================================

window.addEventListener('load', () => {
  // Reset scroll to top on initial page load
  if (!sessionStorage.getItem('scrolled')) {
    window.scrollTo(0, 0);
    sessionStorage.setItem('scrolled', 'true');
  }
});

// Clear scroll position on fresh page load (not back button)
if (performance.navigation.type === 1) {
  window.scrollTo(0, 0);
  sessionStorage.removeItem('scrolled');
}

// =========================================================
//    CAROUSEL FUNCTIONALITY
// =========================================================

const carouselImage = document.getElementById('carouselImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselDots = document.getElementById('carouselDots');

// Sample images array - replace with your actual image paths
const images = [
  'Pictures/Audi-Exhaust-Fumes-Fix.JPEG',
  // Add more image paths here
];

let currentImageIndex = 0;

// Initialize carousel dots
function initDots() {
  carouselDots.innerHTML = '';
  images.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
    dot.setAttribute('aria-label', `Image ${index + 1}`);
    dot.addEventListener('click', () => {
      currentImageIndex = index;
      updateCarousel();
    });
    carouselDots.appendChild(dot);
  });
}

// Update carousel display
function updateCarousel() {
  if (images.length === 0) return;
  
  carouselImage.src = images[currentImageIndex];
  
  // Update dots
  document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentImageIndex);
  });
}

// Next image
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarousel();
  });
}

// Previous image
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateCarousel();
  });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateCarousel();
  }
  if (e.key === 'ArrowLeft') {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateCarousel();
  }
});

// Initialize carousel
initDots();

// =========================================================
//    FORM HANDLING
// =========================================================

const quoteForm = document.getElementById('quote-form');
const formMessages = document.getElementById('form-messages');

if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    const submitBtn = quoteForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    try {
      // Formspree handles the actual submission
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Show success message
        formMessages.textContent = '✓ Quote request sent successfully! We\'ll be in touch soon.';
        formMessages.className = 'form-message success';
        formMessages.hidden = false;

        // Reset form
        quoteForm.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
          formMessages.hidden = true;
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      // Show error message
      formMessages.textContent = '✗ Error sending quote request. Please try again or contact us directly.';
      formMessages.className = 'form-message error';
      formMessages.hidden = false;
      console.error('Error:', error);
    } finally {
      // Restore submit button
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

// =========================================================
//    SMOOTH SCROLL ANCHOR LINKS
// =========================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Don't prevent default for empty hash
    if (href === '#') {
      return;
    }

    const targetElement = document.querySelector(href);
    
    if (targetElement) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (mobileNav && mobileNav.style.display !== 'none') {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.style.display = 'none';
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      }

      // Scroll to element
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// =========================================================
//    INTERSECTION OBSERVER FOR ANIMATIONS
// =========================================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-grid article, .package-card, .gallery-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// =========================================================
//    ACTIVE NAV HIGHLIGHTING
// =========================================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

function updateActiveNav() {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// =========================================================
//    MOBILE NAV STYLING
// =========================================================

// Add styles to mobile nav
const mobileNavStyle = document.createElement('style');
mobileNavStyle.textContent = `
  .mobile-nav {
    display: none;
    position: absolute;
    top: 85px;
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: rgba(5, 7, 10, 0.95);
    border-bottom: 1px solid var(--line);
    backdrop-filter: blur(25px);
    z-index: 999;
    animation: slideDown 0.3s ease;
  }

  .mobile-nav a {
    padding: 16px 22px;
    color: var(--muted);
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 700;
    border-bottom: 1px solid var(--line);
    transition: all 0.2s ease;
  }

  .mobile-nav a:hover,
  .mobile-nav a.active {
    color: var(--accent);
    background: rgba(0, 217, 255, 0.05);
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    .mobile-nav {
      display: flex;
    }
  }
`;
document.head.appendChild(mobileNavStyle);

// =========================================================
//    UTILITY: SAFE NAVIGATION
// =========================================================

// Ensure page always loads at top
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});
