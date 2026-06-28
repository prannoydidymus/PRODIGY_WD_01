document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('mainHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const waitlistForm = document.getElementById('waitlistForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  /* ==========================================================================
     1. Scroll Event (Header Shrink & Background Change)
     ========================================================================== */
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load in case page is refreshed while scrolled down
  handleScroll();
  window.addEventListener('scroll', handleScroll);

  /* ==========================================================================
     2. Mobile Navigation Toggle
     ========================================================================== */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    menuToggle.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     3. Scroll Spy (Active Section Highlighting)
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  
  if (sections.length > 0 && navLinks.length > 0) {
    // Only apply ScrollSpy on page that contains sections (index.html)
    // We filter nav links that refer to hash links on the same page
    const spyLinks = Array.from(navLinks).filter(link => {
      const href = link.getAttribute('href');
      return href.startsWith('#') || href.includes('index.html#');
    });

    const scrollSpy = () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 120; // offset for nav height

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        spyLinks.forEach(link => {
          link.classList.remove('active');
          const href = link.getAttribute('href');
          if (href.endsWith(`#${currentSectionId}`)) {
            link.classList.add('active');
          }
        });
      }
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial call
  }

  /* ==========================================================================
     4. Form Interactivity & Validation (Waitlist)
     ========================================================================== */
  if (waitlistForm) {
    waitlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();

      // Reset message
      formMessage.className = 'form-message';
      formMessage.textContent = '';

      // Simple validation
      if (!firstName || !lastName || !email) {
        showMessage('Please fill out all fields.', 'error');
        return;
      }

      if (!validateEmail(email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate API submit (Loading state)
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing request...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Early Access';
        
        // Show success message
        showMessage(`Success! Welcome to Aether, ${firstName}. We've sent a reservation confirmation to ${email}.`, 'success');
        
        // Reset form inputs
        waitlistForm.reset();
      }, 1500);
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.classList.add(type);
    
    // Smooth scroll to form message if not visible
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
