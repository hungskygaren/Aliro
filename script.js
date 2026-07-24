/**
 * Aliro Consulting - Full-Screen Vertical Swiper Engine
 * Uses GPU Hardware Acceleration for 60fps ultra-smooth vertical sliding.
 * Clean, modular structure for easy maintenance and readability.
 */

document.addEventListener("DOMContentLoaded", () => {
  // DOM Element Selectors
  const mainHeader = document.getElementById("mainHeader");
  const dotsNav = document.getElementById("dotsNav");
  const dots = document.querySelectorAll(".dot-item");
  const navItems = document.querySelectorAll(".nav-item");
  const scrollDownBtn = document.getElementById("scrollDownBtn");
  const hashLinks = document.querySelectorAll('a[href^="#section-"]');
  const continuumNodes = document.querySelectorAll(".sec-continuum__node");
  const return4icBtns = document.querySelectorAll(".btn-return-4ic");
  // Section Background Colors for Global Morphing
  const sectionColors = [
    "#123e6b", // Section 1 (0) - Deep Blue
    "#f7f9fc", // Section 2 (1) - Light Gray
    "#ffffff", // Section 3 (2) - White
    "#123e6b", // Section 4 (3) - Deep Blue
    "#123e6b", // Section 5 (4) - Deep Blue
    "#123e6b", // Section 6 (5) - Deep Blue
    "#123e6b", // Section 7 (6) - Deep Blue
    "#123e6b", // Section 8 (7) - Deep Blue
    "#225a8d", // Section 9 (8) - Architecture Blue
    "#f7f9fc", // Section 10 (9) - Light Gray
  ];

  // --------------------------------------------------------------------------
  // 1. Swiper 11 Vertical Engine Initialization
  // --------------------------------------------------------------------------
  const swiper = new Swiper(".main-swiper", {
    direction: "vertical",
    speed: 950,
    effect: "slide",
    autoHeight: false,
    mousewheel: {
      enabled: true,
      sensitivity: 1,
      thresholdDelta: 10,
    },
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    grabCursor: false,
    touchThreshold: 5,
    on: {
      // Called when Swiper finishes initializing
      init: function () {
        updateActiveState(this.activeIndex);
        if (this.slides && this.slides[this.activeIndex]) {
          this.slides[this.activeIndex].classList.add("slide-animated");
        }
        // Inject morph overlay for every slide
        if (this.slides) {
          this.slides.forEach((slide) => {
            let overlay = document.createElement("div");
            overlay.className = "morph-overlay";
            slide.appendChild(overlay);
          });
        }
      },

      // Called as soon as a slide transition starts
      slideChange: function () {
        updateActiveState(this.activeIndex);
        if (this.slides) {
          const targetSlide = this.slides[this.activeIndex];
          const prevColor = sectionColors[this.previousIndex];
          const targetColor = sectionColors[this.activeIndex];

          // Dynamic Two-Way Background Inheritance Algorithm (Overlay Based)
          if (targetSlide && prevColor && prevColor !== targetColor) {
            targetSlide.style.setProperty("--morph-color", prevColor);
            targetSlide.classList.add("morph-active");
          }

          // Reset animation classes and morph overlay on inactive slides
          this.slides.forEach((slide, idx) => {
            if (idx !== this.activeIndex) {
              slide.classList.remove("slide-animated");
              slide.classList.remove("morph-active");
            }
          });

          // Mark previous slide as visited
          if (this.slides[this.previousIndex]) {
            this.slides[this.previousIndex].classList.add("visited");
          }
        }
      },

      // Called when the slide transition completes (slide has fully stopped)
      slideChangeTransitionEnd: function () {
        if (!this.slides) return;

        // Cleanup inactive slides
        this.slides.forEach((slide, idx) => {
          if (idx !== this.activeIndex) {
            slide.classList.remove("slide-animated");
          }
        });

        const currentSlide = this.slides[this.activeIndex];
        if (!currentSlide) return;

        const currentIndex = this.activeIndex;

        // 4. Trigger morphing (Fade out the overlay to reveal actual content and background)
        currentSlide.classList.remove("morph-active");

        // 5. Sequential Content Reveal: Wait 150ms for background to morph before animating text
        setTimeout(() => {
          // Only animate if user hasn't scrolled away during the wait
          if (this.activeIndex === currentIndex) {
            currentSlide.classList.add("slide-animated");
          }
        }, 150);
      },
    },
  });

  // --------------------------------------------------------------------------
  // 2. Active State Manager (Sync Navigation Dots, Navbar, and Header Theme)
  // --------------------------------------------------------------------------
  function updateActiveState(index) {
    // Light Background Sections (Section 2 = index 1, Section 3 = index 2, Section 10 = index 9)
    const isLightSection = [1, 2, 9].includes(index);

    if (isLightSection) {
      if (dotsNav) dotsNav.classList.add("light-indicator");
      if (mainHeader) mainHeader.classList.add("light-theme");
    } else {
      if (dotsNav) dotsNav.classList.remove("light-indicator");
      if (mainHeader) mainHeader.classList.remove("light-theme");
    }

    // Update Side Dash Dots Active State
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });

    // Keep 'Home' (#section-1) permanently active as this is a single landing page
    const activeNavHref = "#section-1";
    navItems.forEach((navItem) => {
      navItem.classList.toggle(
        "active",
        navItem.getAttribute("href") === activeNavHref,
      );
    });
  }

  // --------------------------------------------------------------------------
  // 3. Navigation Helper (Native Hyper-Scroll)
  // --------------------------------------------------------------------------
  function smartSlideTo(targetIndex) {
    if (targetIndex < 0) return;

    // Native Swiper behavior: cuộn lướt qua mọi thứ trong 1 giây (1000ms)
    // Giữ code nhẹ nhàng, ổn định và tận dụng tối đa animation Play-Once.
    swiper.slideTo(targetIndex, 1000);
  }

  // --------------------------------------------------------------------------
  // 4. Interactive Click Handlers
  // --------------------------------------------------------------------------

  // Hero Scroll Down Button
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      smartSlideTo(1);
    });
  }

  // Side Dash Lines Navigation Dots
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(
        e.currentTarget.getAttribute("data-index"),
        10,
      );
      if (!isNaN(targetIndex)) {
        smartSlideTo(targetIndex);
      }
    });
  });

  // Intercept all #section- links (Logo, Navbar, CTA buttons) to prevent jump freeze
  hashLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      if (href) {
        const sectionNum = parseInt(href.replace("#section-", ""), 10);
        if (!isNaN(sectionNum) && sectionNum >= 1) {
          smartSlideTo(sectionNum - 1);
        }
      }
    });
  });

  // Section 4 Satellite Node Buttons Click Handler
  continuumNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(node.getAttribute("data-slide-target"), 10);
      if (!isNaN(targetIndex)) {
        smartSlideTo(targetIndex);
      }
    });
  });

  // Return to 4IC Button Click Handler (Sections 5, 6, 7, 8)
  return4icBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(btn.getAttribute("data-slide-target"), 10);
      smartSlideTo(!isNaN(targetIndex) ? targetIndex : 3);
    });
  });
});
