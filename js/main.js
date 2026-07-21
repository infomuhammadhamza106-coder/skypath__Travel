/* ==========================================================================
   Euro Path Travel — Main JavaScript
   ========================================================================== */

// Web3Forms API Key — Replace with your own from https://web3forms.com
const WEB3FORMS_KEY = '928235df-5d4d-4fe7-bce0-ea703df89a52';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollAnimations();
  initFAQ();
  initTestimonialSlider();
  initCounterAnimation();
  initBackToTop();
  initSearchTabs();
  initMultiStepForm();
  initFilterButtons();
  initVisaInquiryForm();
  initQuickEnquiry();
  initContactForm();
  initQueryModal();
  initConsultationModal();
});

/* ---------- Web3Forms Submission Helper ---------- */
async function submitToWeb3Forms(formData, formElement, successCallback) {
  // Add API key — Web3Forms rejects the request if the key appears twice
  // (some forms already include it as a hidden input)
  if (!formData.has('access_key')) {
    formData.append('access_key', WEB3FORMS_KEY);
  }
  
  // Find submit button
  const submitBtn = formElement.querySelector('[type="submit"], .btn-submit');
  const originalText = submitBtn ? submitBtn.textContent : '';
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      console.log('Form submitted successfully:', result);
      if (successCallback) successCallback();
    } else {
      console.error('Form submission failed:', result);
      alert('Something went wrong. Please try again or call us directly.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
      }
    }
  } catch (error) {
    console.error('Network error:', error);
    alert('Network error. Please check your connection and try again.');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.opacity = '1';
    }
  }
}

/* ---------- Header Scroll Effect ---------- */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('scrolled');
      header.classList.add('transparent');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (!hamburger || !overlay) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ---------- Scroll Reveal Animations ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- FAQ Accordion ---------- */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Open clicked if it was closed
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---------- Testimonial Slider ---------- */
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  let cardsPerView = getCardsPerView();

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function updateSlider() {
    const gap = 24;
    const cardWidth = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = Math.max(0, currentIndex - 1);
    updateSlider();
  });

  nextBtn.addEventListener('click', () => {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    currentIndex = Math.min(maxIndex, currentIndex + 1);
    updateSlider();
  });

  // Auto-slide
  let autoSlide = setInterval(() => {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
    updateSlider();
  }, 5000);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.parentElement.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      const maxIndex = Math.max(0, cards.length - cardsPerView);
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateSlider();
    }, 5000);
  });

  window.addEventListener('resize', () => {
    cardsPerView = getCardsPerView();
    currentIndex = 0;
    updateSlider();
  });
}

/* ---------- Counter Animation ---------- */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const startTime = Date.now();

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    
    el.textContent = current.toLocaleString() + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Search Tabs ---------- */
function initSearchTabs() {
  const tabs = document.querySelectorAll('.search-tab');
  const panels = document.querySelectorAll('.search-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });
}

/* ---------- Multi-Step Form ---------- */
function initMultiStepForm() {
  const forms = document.querySelectorAll('.multistep-form');
  
  forms.forEach(form => {
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = form.querySelectorAll('.progress-step');
    const progressBar = form.querySelector('.progress-bar-fill');
    let currentStep = 0;

    // Trip type toggle
    const tripTypeBtns = form.querySelectorAll('.trip-type-btn');
    tripTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Only toggle within the same group
        const parent = btn.parentElement;
        parent.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update hidden input if exists
        const hiddenInput = parent.nextElementSibling;
        if (hiddenInput && hiddenInput.type === 'hidden') {
          hiddenInput.value = btn.dataset.trip;
        }
        
        const returnDateGroup = form.querySelector('.return-date-group');
        if (returnDateGroup && btn.dataset.trip) {
          returnDateGroup.style.display = btn.dataset.trip === 'oneway' ? 'none' : 'block';
        }
      });
    });

    // Passenger counters
    form.querySelectorAll('.counter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const counter = btn.parentElement.querySelector('.counter-value');
        let val = parseInt(counter.textContent);
        const min = parseInt(btn.dataset.min || 0);
        const max = parseInt(btn.dataset.max || 9);
        
        if (btn.classList.contains('counter-minus')) {
          val = Math.max(min, val - 1);
        } else {
          val = Math.min(max, val + 1);
        }
        counter.textContent = val;
      });
    });

    // Navigation
    form.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep(steps[currentStep])) {
          goToStep(currentStep + 1);
        }
      });
    });

    form.querySelectorAll('.btn-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(currentStep - 1);
      });
    });

    // Submit
    const submitBtn = form.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateStep(steps[currentStep])) {
          handleFormSubmit(form);
        }
      });
    }

    function goToStep(step) {
      steps[currentStep].classList.remove('active');
      currentStep = step;
      steps[currentStep].classList.add('active');
      
      progressSteps.forEach((ps, i) => {
        ps.classList.remove('active', 'completed');
        if (i < currentStep) ps.classList.add('completed');
        if (i === currentStep) ps.classList.add('active');
      });
      
      if (progressBar) {
        const percent = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = percent + '%';
      }

      // Scroll to form top
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(step) {
      let valid = true;
      const inputs = step.querySelectorAll('[required]');
      
      inputs.forEach(input => {
        const error = input.parentElement.querySelector('.form-error');
        
        if (!input.value.trim()) {
          input.classList.add('error');
          if (error) error.classList.add('show');
          valid = false;
        } else {
          input.classList.remove('error');
          if (error) error.classList.remove('show');
        }

        // Email validation
        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            input.classList.add('error');
            if (error) {
              error.textContent = 'Please enter a valid email address';
              error.classList.add('show');
            }
            valid = false;
          }
        }
      });

      return valid;
    }

    function handleFormSubmit(formContainer) {
      const formEl = formContainer.querySelector('form');
      const formData = new FormData();
      
      // Collect all form inputs
      formEl.querySelectorAll('input, select, textarea').forEach(input => {
        if (input.name && input.name !== 'website') { // Skip honeypot
          formData.append(input.name, input.value);
        }
      });
      
      // Collect passenger counter values
      formContainer.querySelectorAll('.passenger-counter').forEach(counter => {
        const label = counter.querySelector('.passenger-info h4').textContent;
        const value = counter.querySelector('.counter-value').textContent;
        formData.append(label.toLowerCase(), value);
      });

      // Check honeypot
      const honeypot = formEl.querySelector('input[name="website"]');
      if (honeypot && honeypot.value.trim() !== '') {
        return; // Bot detected
      }

      // Determine form type for subject line
      const pageTitle = document.title;
      let subject = 'New Enquiry from Euro Path Travel Website';
      if (pageTitle.includes('Flight')) {
        subject = '✈ New Flight Enquiry — Euro Path Travel';
        formData.append('form_type', 'Flight Enquiry');
      } else if (pageTitle.includes('Holiday')) {
        subject = '🏝 New Holiday Package Enquiry — Euro Path Travel';
        formData.append('form_type', 'Holiday Package Enquiry');
      }
      formData.append('subject', subject);
      
      // Submit to Web3Forms
      submitToWeb3Forms(formData, formContainer, () => {
        // Show confirmation
        const confirmation = formContainer.querySelector('.form-confirmation');
        const stepsContainer = formContainer.querySelector('.form-steps-container');
        const progress = formContainer.querySelector('.form-progress');
        const progressBarTrack = formContainer.querySelector('.progress-bar-track');
        
        if (confirmation) {
          if (stepsContainer) stepsContainer.style.display = 'none';
          if (progress) progress.style.display = 'none';
          if (progressBarTrack) progressBarTrack.style.display = 'none';
          confirmation.style.display = 'block';
        }
      });
    }
  });

  // Real-time validation — remove error on input
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        const error = input.parentElement.querySelector('.form-error');
        if (error) error.classList.remove('show');
      }
    });
  });
}

/* ---------- Filter Buttons ---------- */
function initFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.filter;
      
      filterItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ---------- Quick Enquiry (Homepage callback form) ---------- */
function initQuickEnquiry() {
  const form = document.getElementById('quick-enquiry-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    formData.append('subject', '📞 Quick Callback Request — Euro Path Travel');
    formData.append('form_type', 'Quick Callback');
    
    const btn = form.querySelector('.btn');
    
    submitToWeb3Forms(formData, form, () => {
      const originalText = btn.textContent;
      btn.textContent = '✓ Enquiry Sent!';
      btn.style.background = '#10B981';
      btn.disabled = false;
      btn.style.opacity = '1';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
  });
}

/* ---------- Schengen Visa Inquiry Form ---------- */
function initVisaInquiryForm() {
  const form = document.getElementById('visa-inquiry-form');
  if (!form) return;

  const step1 = document.getElementById('vstep-1');
  const step2 = document.getElementById('vstep-2');
  const progressSteps = document.querySelectorAll('.visa-progress-step');
  const confirm = document.getElementById('visa-confirm');
  const formBody = form.closest('.visa-form-body');

  function validateFields(stepEl) {
    let valid = true;
    stepEl.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('verr');
      if (!field.value.trim()) {
        field.classList.add('verr');
        valid = false;
      }
      if (field.type === 'email' && field.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          field.classList.add('verr');
          valid = false;
        }
      }
    });
    return valid;
  }

  function setProgress(activeStep) {
    progressSteps.forEach(ps => {
      const n = parseInt(ps.dataset.vstep);
      ps.classList.remove('active', 'done');
      if (n < activeStep) ps.classList.add('done');
      if (n === activeStep) ps.classList.add('active');
    });
  }

  // Next button
  const nextBtn = form.querySelector('.visa-next');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!validateFields(step1)) return;
      step1.classList.remove('active');
      step2.classList.add('active');
      setProgress(2);
      form.closest('.visa-form-card') && form.closest('.visa-form-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  // Back button
  const prevBtn = form.querySelector('.visa-prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      step2.classList.remove('active');
      step1.classList.add('active');
      setProgress(1);
    });
  }

  // Clear error on change
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('verr'));
    field.addEventListener('change', () => field.classList.remove('verr'));
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateFields(step2)) return;

    const formData = new FormData(form);

    submitToWeb3Forms(formData, form, () => {
      form.style.display = 'none';
      const card = form.closest('.visa-form-card');
      if (card) {
        const prog = card.querySelector('.visa-progress');
        if (prog) prog.style.display = 'none';
      }
      if (confirm) confirm.style.display = 'block';
    });
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('error');
        valid = false;
      } else {
        input.classList.remove('error');
      }
    });

    if (!valid) return;

    const formData = new FormData(form);
    const subject = formData.get('subject') || 'General Enquiry';
    formData.set('subject', `📩 ${subject} — Euro Path Travel`);
    formData.append('form_type', 'Contact Form');
    
    submitToWeb3Forms(formData, form, () => {
      window.location.href = 'thank-you.html';
    });
  });
}

/* ---------- Book Your Consultation Modal (Sitewide) ---------- */
function initConsultationModal() {
  const openBtns = document.querySelectorAll('.open-consultation-btn');
  const overlay = document.getElementById('consultation-modal-overlay');
  const closeBtn = document.getElementById('consultation-modal-close');
  const form = document.getElementById('consultation-form');
  const confirm = document.getElementById('consultation-confirm');
  if (!openBtns.length || !overlay || !form) return;

  function openModal() {
    overlay.classList.add('active');
    document.body.classList.add('query-modal-open');
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.classList.remove('query-modal-open');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  function validateFields() {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('verr');
      if (!field.value.trim()) {
        field.classList.add('verr');
        valid = false;
      }
      if (field.type === 'email' && field.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          field.classList.add('verr');
          valid = false;
        }
      }
    });
    return valid;
  }

  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('verr'));
    field.addEventListener('change', () => field.classList.remove('verr'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    const formData = new FormData(form);

    submitToWeb3Forms(formData, form, () => {
      form.style.display = 'none';
      if (confirm) confirm.style.display = 'block';

      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 1800);
    });
  });
}

/* ---------- Send a Query Modal (Homepage) ---------- */
function initQueryModal() {
  const openBtn = document.getElementById('open-query-btn');
  const overlay = document.getElementById('query-modal-overlay');
  const closeBtn = document.getElementById('query-modal-close');
  const form = document.getElementById('query-form');
  const confirm = document.getElementById('query-confirm');
  if (!openBtn || !overlay || !form) return;

  function openModal() {
    overlay.classList.add('active');
    document.body.classList.add('query-modal-open');
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.classList.remove('query-modal-open');
  }

  openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal();
  });

  function validateFields() {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      field.classList.remove('verr');
      if (!field.value.trim()) {
        field.classList.add('verr');
        valid = false;
      }
      if (field.type === 'email' && field.value.trim()) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
          field.classList.add('verr');
          valid = false;
        }
      }
    });
    return valid;
  }

  form.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('verr'));
    field.addEventListener('change', () => field.classList.remove('verr'));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    // Honeypot check
    const honeypot = form.querySelector('input[name="website"]');
    if (honeypot && honeypot.value.trim() !== '') return;

    const formData = new FormData(form);

    submitToWeb3Forms(formData, form, () => {
      form.style.display = 'none';
      if (confirm) confirm.style.display = 'block';

      setTimeout(() => {
        window.location.href = 'thank-you.html';
      }, 1800);
    });
  });
}

/* ---------- Smooth Scroll for Anchor Links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
