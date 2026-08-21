/* ==========================================================================
   MUSCLE EMPIRE GYMNASIUM - INTERACTION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  /* --------------------------------------------------------------------------
     1. STICKY NAVBAR BACKGROUND
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load in case page is refreshed

  /* --------------------------------------------------------------------------
     2. MOBILE MENU DRAWER
     -------------------------------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  const toggleMenu = () => {
    hamburgerBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  hamburgerBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. TESTIMONIAL SLIDER CAROUSEL
     -------------------------------------------------------------------------- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('sliderDots');
  let currentSlide = 0;
  
  if (slides.length > 0) {
    // Generate dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('span');
      dot.classList.add('testi-dot');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('data-index', idx);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
    
    const dots = document.querySelectorAll('.testi-dot');

    const updateSlider = () => {
      slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      
      dots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlider();
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSlider();
    };

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Optional autoplay every 6 seconds
    let autoplayInterval = setInterval(nextSlide, 6000);
    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(nextSlide, 6000);
    };

    prevBtn.addEventListener('click', resetAutoplay);
    nextBtn.addEventListener('click', resetAutoplay);
    dots.forEach(dot => dot.addEventListener('click', resetAutoplay));
  }

  /* --------------------------------------------------------------------------
     4. LOCATIONS ACCORDION & MAP SWITCHER
     -------------------------------------------------------------------------- */
  const accordions = document.querySelectorAll('.accordion-card');
  const maps = document.querySelectorAll('.map');

  accordions.forEach(accordion => {
    const heading = accordion.querySelector('.accordion-heading');
    heading.addEventListener('click', () => {
      const targetMapId = accordion.getAttribute('data-map');
      
      // Close other accordions
      accordions.forEach(acc => {
        if (acc !== accordion) {
          acc.classList.remove('active');
        }
      });

      // Toggle current accordion
      accordion.classList.toggle('active');
      
      // Handle Map Switching
      if (accordion.classList.contains('active')) {
        maps.forEach(map => {
          if (map.id === targetMapId) {
            map.classList.add('active');
          } else {
            map.classList.remove('active');
          }
        });
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. SCROLL REVEAL (INTERSECTION OBSERVER)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once animated, we don't need to observe it again
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add('revealed');
    });
  }

  /* --------------------------------------------------------------------------
     6. SCROLL SPY (ACTIVE NAV LINK HIGHLIGHT)
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  
  const scrollSpy = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // Offset for sticky header
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        if (activeLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);
  scrollSpy(); // Trigger on load

  /* --------------------------------------------------------------------------
     7. NUTRITION & MACRO CALCULATOR
     -------------------------------------------------------------------------- */
  const nutritionForm = document.getElementById('nutritionForm');
  const nutritionResults = document.getElementById('nutritionResults');
  
  if (nutritionForm) {
    nutritionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const gender = document.getElementById('nutrition-gender').value;
      const age = parseInt(document.getElementById('nutrition-age').value);
      const weight = parseFloat(document.getElementById('nutrition-weight').value);
      const height = parseFloat(document.getElementById('nutrition-height').value);
      const activity = parseFloat(document.getElementById('nutrition-activity').value);
      const goal = document.getElementById('nutrition-goal').value;
      
      // Mifflin-St Jeor Equation BMR
      let bmr = 0;
      if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }
      
      // Calculate TDEE
      let tdee = bmr * activity;
      
      // Adjust Calories for goal
      let targetCalories = Math.round(tdee);
      if (goal === 'lose') {
        targetCalories = Math.round(tdee - 500);
      } else if (goal === 'gain') {
        targetCalories = Math.round(tdee + 300);
      }
      
      // Safety limits (BMR baseline floor)
      const safetyFloor = gender === 'male' ? 1500 : 1200;
      if (targetCalories < safetyFloor) {
        targetCalories = safetyFloor;
      }
      
      // Macro Calculations
      // Protein: 2.0g per kg of bodyweight
      let proteinGrams = Math.round(weight * 2.0);
      let proteinCalories = proteinGrams * 4;
      
      // Fats: 25% of total target calories
      let fatCalories = targetCalories * 0.25;
      let fatGrams = Math.round(fatCalories / 9);
      
      // Carbs: remaining calories
      let carbCalories = targetCalories - proteinCalories - fatCalories;
      if (carbCalories < 0) carbCalories = 0;
      let carbGrams = Math.round(carbCalories / 4);
      
      // Render values in DOM
      document.getElementById('result-calories').innerText = targetCalories.toLocaleString();
      document.getElementById('result-protein').innerText = proteinGrams + 'g';
      document.getElementById('result-carbs').innerText = carbGrams + 'g';
      document.getElementById('result-fats').innerText = fatGrams + 'g';
      
      // Show results with entry animation
      nutritionResults.classList.add('active');
      
      // Dynamic Progress Bars percentages based on calorie contribution
      setTimeout(() => {
        const proteinPct = Math.min(100, Math.round((proteinCalories / targetCalories) * 100));
        const fatPct = Math.min(100, Math.round((fatCalories / targetCalories) * 100));
        const carbPct = Math.min(100, Math.round((carbCalories / targetCalories) * 100));
        
        document.getElementById('bar-protein').style.width = `${proteinPct}%`;
        document.getElementById('bar-carbs').style.width = `${carbPct}%`;
        document.getElementById('bar-fats').style.width = `${fatPct}%`;
      }, 100);
      
      // Smooth scroll to results
      setTimeout(() => {
        nutritionResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    });
  }

  /* --------------------------------------------------------------------------
     8. CONTACT FORM SUBMISSION WITH FADE TRANSITIONS
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const contactFormWrapper = document.getElementById('contactFormWrapper');
  const contactSuccessCard = document.getElementById('contactSuccessCard');
  const successUserName = document.getElementById('successUserName');
  const successUserPhone = document.getElementById('successUserPhone');
  const successResetBtn = document.getElementById('successResetBtn');

  if (contactForm && contactFormWrapper && contactSuccessCard) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const phone = document.getElementById('phone').value;
      
      // Update success card text dynamically
      if (successUserName) successUserName.innerText = name || 'Champion';
      if (successUserPhone) successUserPhone.innerText = phone || 'your number';
      
      // Animate: Fade out form wrapper
      contactFormWrapper.classList.add('fade-out');
      
      setTimeout(() => {
        // Hide form wrapper DOM space, show success card DOM space
        contactFormWrapper.style.display = 'none';
        contactSuccessCard.style.display = 'flex';
        
        // Trigger success card fade in
        requestAnimationFrame(() => {
          contactSuccessCard.classList.add('active');
        });
      }, 400); // matches style.css transition time (0.4s)
    });

    if (successResetBtn) {
      successResetBtn.addEventListener('click', () => {
        // Animate: Fade out success card
        contactSuccessCard.classList.remove('active');
        
        setTimeout(() => {
          // Reset form inputs
          contactForm.reset();
          
          // Toggle displays back
          contactSuccessCard.style.display = 'none';
          contactFormWrapper.style.display = 'block';
          
          // RequestAnimationFrame for fade in
          requestAnimationFrame(() => {
            contactFormWrapper.classList.remove('fade-out');
          });
        }, 400);
      });
    }
  }
});
