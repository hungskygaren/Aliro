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
    "#C5DAF3", // Section 1 (0) - Light Glow Blue (#C5DAF3)
    "#ffffff", // Section 2 (1) - White (Updated)
    "#ffffff", // Section 3 (2) - White
    "#1F6CA0", // Section 4 (3) - New Dark Blue
    "#ffffff", // Section 5 (4) - White
    "#01103B", // Section 6 (5) - New Dark Blue
    "#01103B", // Section 7 (6) - New Dark Blue
    "#01103B", // Section 8 (7) - New Dark Blue
    "#01103B", // Section 9 (8) - New Dark Blue
    "#f7f9fc", // Section 10 (9) - Light Gray
  ];

  // Read initial slide index from URL Hash (#section-X), fallback to 0 (Section 1)
  const initialSlideIndex = (() => {
    if (window.location.hash) {
      const match = window.location.hash.match(/#section-(\d+)/);
      if (match && match[1]) {
        const secIndex = parseInt(match[1], 10) - 1;
        if (secIndex >= 0 && secIndex <= 9) return secIndex;
      }
    }
    return 0; // Default: Section 1
  })();

  const swiper = new Swiper(".main-swiper", {
    direction: "vertical",
    initialSlide: initialSlideIndex,
    speed: 650,
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

        // Wait for all assets (especially hero images) to fully load before triggering the entrance animation
        const startHeroAnimation = () => {
          if (this.slides && this.slides[this.activeIndex]) {
            this.slides[this.activeIndex].classList.add("slide-animated");
          }
        };

        if (document.readyState === "complete") {
          startHeroAnimation();
        } else {
          window.addEventListener("load", startHeroAnimation);
        }
      },

      // Called as soon as a slide transition starts
      slideChange: function () {
        updateActiveState(this.activeIndex);

        // Sync URL Hash without triggering page jump/reload
        history.replaceState(null, "", `#section-${this.activeIndex + 1}`);
        if (this.slides) {
          const targetSlide = this.slides[this.activeIndex];
          const prevColor = sectionColors[this.previousIndex];
          const targetColor = sectionColors[this.activeIndex];

          // Dynamic Two-Way Background Inheritance Algorithm (Overlay Based) (Temporarily disabled)
          /*
          if (targetSlide && prevColor && prevColor !== targetColor) {
            targetSlide.style.setProperty("--morph-color", prevColor);
            targetSlide.classList.add("morph-active");
          }
          */

          // Reset animation classes and morph overlay on inactive slides (Temporarily disabled morph-active)
          this.slides.forEach((slide, idx) => {
            if (idx !== this.activeIndex) {
              slide.classList.remove("slide-animated");
              // slide.classList.remove("morph-active");
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

        // Trigger entrance animation immediately when the slide transition completes (no setTimeout delay)
        const currentSlide = this.slides[this.activeIndex];
        if (currentSlide) {
          currentSlide.classList.add("slide-animated");
        }
      },
    },
  });

  // --------------------------------------------------------------------------
  // 2. Active State Manager (Sync Navigation Dots, Navbar, and Header Theme)
  // --------------------------------------------------------------------------
  function updateActiveState(index) {
    // Sections 1, 2, 3, 5, 7, 10 (indices: 0, 1, 2, 4, 6, 9):
    // - Header: Thanh menu MÀU TỐI (#01103B)
    // - Dots Navigation: Dot MÀU TỐI (light-indicator)
    const isDarkThemeGroup = [0, 1, 2, 4, 6, 9].includes(index);

    if (isDarkThemeGroup) {
      if (mainHeader) mainHeader.classList.remove("light-theme");
      if (dotsNav) dotsNav.classList.add("light-indicator");
    } else {
      if (mainHeader) mainHeader.classList.add("light-theme");
      if (dotsNav) dotsNav.classList.remove("light-indicator");
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

  function smartSlideTo(targetIndex) {
    if (targetIndex < 0 || targetIndex >= swiper.slides.length) return;

    const currentIndex = swiper.activeIndex;
    const distance = Math.abs(targetIndex - currentIndex);

    if (distance <= 1) {
      swiper.slideTo(targetIndex, 650);
    } else if (distance === 2) {
      swiper.slideTo(targetIndex, 650);
    } else {
      const nearTargetIndex =
        targetIndex > currentIndex ? targetIndex - 1 : targetIndex + 1;

      swiper.slideTo(nearTargetIndex, 0);
      requestAnimationFrame(() => {
        swiper.slideTo(targetIndex, 650);
      });
    }
  }

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
