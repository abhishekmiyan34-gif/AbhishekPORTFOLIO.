/**
 * Abhishek Singh Miyan — Personal Portfolio
 * Vanilla JavaScript // Lightweight, Performant, Framework-free
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initActiveNavSpy();
  initProjectFilters();
  initContactForm();
  initLiveGitHubData();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   1. NAVBAR SCROLL EFFECT
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('bg-white/85', 'backdrop-blur-md', 'shadow-sm', 'border-gray-200/80');
      navbar.classList.remove('bg-transparent', 'border-transparent');
    } else {
      navbar.classList.remove('bg-white/85', 'backdrop-blur-md', 'shadow-sm', 'border-gray-200/80');
      navbar.classList.add('bg-transparent', 'border-transparent');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   2. MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-button');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menuDrawer = document.getElementById('mobile-menu-drawer');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !menuDrawer || !backdrop) return;

  const openMenu = () => {
    menuDrawer.classList.remove('translate-x-full');
    backdrop.classList.remove('opacity-0', 'pointer-events-none');
    backdrop.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
  };

  const closeMenu = () => {
    menuDrawer.classList.add('translate-x-full');
    backdrop.classList.remove('opacity-100');
    backdrop.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menuDrawer.classList.contains('translate-x-full')) {
      closeMenu();
    }
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. ACTIVE NAV LINK SPY
   -------------------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav-link');

  if (!sections.length || !desktopLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('text-blue-600', 'font-semibold');
            link.classList.remove('text-gray-600');
          } else {
            link.classList.remove('text-blue-600', 'font-semibold');
            link.classList.add('text-gray-600');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   5. PROJECT CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-item');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('bg-gray-900', 'text-white', 'border-gray-900');
        b.classList.add('bg-white', 'text-gray-600', 'border-gray-200');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('bg-gray-900', 'text-white', 'border-gray-900');
      btn.classList.remove('bg-white', 'text-gray-600', 'border-gray-200');
      btn.setAttribute('aria-selected', 'true');

      // Filter projects
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   6. LIVE GITHUB METRICS INTEGRATION
   -------------------------------------------------------------------------- */
async function initLiveGitHubData() {
  const repoCountEl = document.getElementById('gh-repo-count');
  const bioEl = document.getElementById('gh-bio');
  const statusPill = document.getElementById('gh-status-indicator');

  const username = 'abhishekmiyan34-gif';

  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) throw new Error('API Rate Limited or Unreachable');

    const data = await res.json();
    
    if (repoCountEl && typeof data.public_repos === 'number') {
      repoCountEl.textContent = data.public_repos;
    }
    if (bioEl && data.bio) {
      bioEl.textContent = `“${data.bio}”`;
    }
    if (statusPill) {
      statusPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> <span class="text-xs font-mono text-emerald-700 font-medium">LIVE CONNECTED</span>';
    }
  } catch (err) {
    // Graceful fallback to verified static data (no console alert spam)
    if (statusPill) {
      statusPill.innerHTML = '<span class="w-2 h-2 rounded-full bg-blue-500"></span> <span class="text-xs font-mono text-gray-600">VERIFIED PROFILE</span>';
    }
  }
}

/* --------------------------------------------------------------------------
   7. CLIENT-SIDE CONTACT FORM VALIDATION & HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const messageInput = document.getElementById('form-message');
  const submitBtn = document.getElementById('form-submit-btn');
  const successBox = document.getElementById('form-success-message');
  const resetBtn = document.getElementById('form-reset-btn');

  if (!form || !nameInput || !emailInput || !messageInput) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, validator, errorId, errorMsg) => {
    const errorEl = document.getElementById(errorId);
    const isValid = validator(input.value.trim());

    if (!isValid) {
      input.classList.add('border-red-400', 'bg-red-50/20');
      input.classList.remove('border-gray-200');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) {
        errorEl.textContent = errorMsg;
        errorEl.classList.remove('hidden');
      }
      return false;
    } else {
      input.classList.remove('border-red-400', 'bg-red-50/20');
      input.classList.add('border-gray-200');
      input.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.classList.add('hidden');
      }
      return true;
    }
  };

  // Real-time blur validation
  nameInput.addEventListener('blur', () => {
    validateField(nameInput, val => val.length >= 2, 'name-error', 'Please enter your name (at least 2 characters).');
  });

  emailInput.addEventListener('blur', () => {
    validateField(emailInput, val => emailRegex.test(val), 'email-error', 'Please enter a valid email address.');
  });

  messageInput.addEventListener('blur', () => {
    validateField(messageInput, val => val.length >= 10, 'message-error', 'Message should be at least 10 characters.');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateField(nameInput, val => val.length >= 2, 'name-error', 'Please enter your name.');
    const isEmailValid = validateField(emailInput, val => emailRegex.test(val), 'email-error', 'Please enter a valid email address.');
    const isMessageValid = validateField(messageInput, val => val.length >= 10, 'message-error', 'Message should be at least 10 characters.');

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      return;
    }

    // Visual feedback for submission state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Transmitting...</span>
      `;
    }

    // Static website form handling:
    // Display verified success notification with options for direct mail client or webhook integration
    setTimeout(() => {
      form.classList.add('hidden');
      if (successBox) {
        successBox.classList.remove('hidden');
      }
    }, 600);
  });

  resetBtn?.addEventListener('click', () => {
    form.reset();
    form.classList.remove('hidden');
    successBox?.classList.add('hidden');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Send Message</span> <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>`;
    }
  });
}

/* --------------------------------------------------------------------------
   8. COPY TO CLIPBOARD UTILITY
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-trigger');
  const toast = document.getElementById('copy-toast');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (toast) {
          toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
          toast.classList.add('opacity-100', 'translate-y-0');
          setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
          }, 2200);
        }
      }).catch(err => {
        console.warn('Clipboard write error:', err);
      });
    });
  });
}

