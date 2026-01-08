/**
 * A1 Student Arrowsmith - Interactive JavaScript
 * Calm, smooth interactions for an accessible experience
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initHeader();
  initMobileMenu();
  initFaqAccordion();
  initSmoothScroll();
  initAnimateOnScroll();
});

/**
 * Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const body = document.body;
  
  if (!menuToggle || !mobileNav) return;
  
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('mobile-nav--open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    body.style.overflow = isOpen ? 'hidden' : '';
    
    // Animate hamburger to X
    const spans = menuToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  
  // Close menu when clicking a link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('mobile-nav--open');
      body.style.overflow = '';
      menuToggle.setAttribute('aria-expanded', 'false');
      
      const spans = menuToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });
}

/**
 * FAQ Accordion
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (!question || !answer) return;
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('faq-item--open');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('faq-item--open');
          otherItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      item.classList.toggle('faq-item--open');
      question.setAttribute('aria-expanded', !isOpen);
    });
    
    // Keyboard accessibility
    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Animate elements when they come into view
 */
function initAnimateOnScroll() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe cards and other elements
  document.querySelectorAll('.card, .testimonial, .process-step, .team-member, .program-card, .stat').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
}

/**
 * Form validation helper
 */
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.classList.add('form-input--error');
    } else {
      field.classList.remove('form-input--error');
    }
  });
  
  // Email validation
  const emailField = form.querySelector('[type="email"]');
  if (emailField && emailField.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
      isValid = false;
      emailField.classList.add('form-input--error');
    }
  }
  
  return isValid;
}

/**
 * Handle form submission
 */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    if (!validateForm(this)) {
      e.preventDefault();
      return;
    }
    
    // For demo purposes - in production, this would submit to a server
    // e.preventDefault();
    // alert('Thank you for your message! We will be in touch soon.');
  });
});

/**
 * Video Lightbox
 */
const videoLightbox = document.getElementById('video-lightbox');
const lightboxVideo = document.getElementById('lightbox-video');
const videoCards = document.querySelectorAll('.video-card');

if (videoLightbox && lightboxVideo && videoCards.length > 0) {
  // Open lightbox when video card is clicked
  videoCards.forEach(card => {
    card.addEventListener('click', function() {
      const videoUrl = this.dataset.video;
      if (videoUrl) {
        lightboxVideo.src = videoUrl;
        videoLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close lightbox when clicking overlay or close button
  const closeBtn = videoLightbox.querySelector('.video-lightbox__close');
  const overlay = videoLightbox.querySelector('.video-lightbox__overlay');

  function closeLightbox() {
    videoLightbox.classList.remove('active');
    lightboxVideo.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (overlay) overlay.addEventListener('click', closeLightbox);

  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && videoLightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}
