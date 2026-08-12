/**
 * Aliro Consulting - Full-Screen Vertical Swiper Engine
 * Uses GPU Hardware Acceleration for 60fps ultra-smooth vertical sliding.
 * Clean, modular structure for easy maintenance and readability.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Reset any native scroll offset the browser applied from hash anchors before Swiper takes over
  const swiperEl = document.querySelector(".main-swiper");
  const wrapperEl = document.querySelector(".swiper-wrapper");
  if (swiperEl) swiperEl.scrollTop = 0;
  if (wrapperEl) wrapperEl.scrollTop = 0;
  window.scrollTo(0, 0);

  // DOM Element Selectors
  const mainHeader = document.getElementById("mainHeader");
  const navItems = document.querySelectorAll(".nav-item");
  const scrollDownBtn = document.getElementById("scrollDownBtn");
  const hashLinks = document.querySelectorAll('a[href^="#section-"]');
  const continuumNodes = document.querySelectorAll(".sec-continuum__node");
  const return4icBtns = document.querySelectorAll(".btn-return-4ic");
  // Section IDs mapping in exact slide order
  const sectionIds = [
    "section-1",
    "section-2",
    "section-2b",
    "section-3",
    "section-4",
    "section-5",
    "section-6",
    "section-7",
    "section-8",
    "section-9",
    "section-9b",
    "section-10",
  ];

  // Section Background Colors for Global Morphing
  const sectionColors = [
    "#C5DAF3", // Section 1 (0) - Light Glow Blue
    "#ffffff", // Section 2 (1) - White Architect
    "#01103B", // Section 2b (2) - Dark Radial Highlights
    "#ffffff", // Section 3 (3) - White Framework
    "#1F6CA0", // Section 4 (4) - Dark Blue Orbit
    "#ffffff", // Section 5 (5) - White Pillar 1
    "#01103B", // Section 6 (6) - Dark Blue Pillar 2
    "#01103B", // Section 7 (7) - Dark Blue Pillar 3
    "#01103B", // Section 8 (8) - Dark Blue Pillar 4
    "#01103B", // Section 9 (9) - Dark Blue Arch
    "#ffffff", // Section 9b (10) - White Advisory
    "#ffffff", // Section 10 (11) - White Contact
  ];

  // Parse hash to slide index helper
  function hashToSlideIndex(hash) {
    if (!hash) return 0;
    const id = hash.replace("#", "");
    const idx = sectionIds.indexOf(id);
    if (idx === -1) return 0;
    // Skip section-2b (index 2): redirect to section-3
    return idx === 2 ? 3 : idx;
  }

  // Read initial target from URL Hash, fallback to 0 (Section 1)
  const initialTargetIndex = hashToSlideIndex(window.location.hash);

  const swiper = new Swiper(".main-swiper", {
    direction: "vertical",
    initialSlide: 0, // Always start at 0 to avoid Swiper layout desync
    slidesPerView: "auto", // Measure each slide's actual height (sec-2b = 400px, others = 100dvh)
    speed: 750,
    effect: "slide",
    autoHeight: false,
    mousewheel: {
      enabled: false, // Disabled: custom wheel handler skips section-2b
    },
    keyboard: {
      enabled: false, // Disabled: custom keydown handler skips section-2b
    },
    grabCursor: false,
    touchThreshold: 5,
    on: {
      // Called when Swiper finishes initializing
      init: function () {
        const swiperInstance = this;
        updateActiveState(swiperInstance.activeIndex);

        // Deferred navigation: wait until all assets are loaded so slide
        // heights are fully resolved before jumping to target section
        const navigateAndAnimate = () => {
          if (initialTargetIndex > 0) {
            swiperInstance.slideTo(initialTargetIndex, 0);
          }
          // Trigger entrance animation on the active slide
          if (
            swiperInstance.slides &&
            swiperInstance.slides[swiperInstance.activeIndex]
          ) {
            swiperInstance.slides[swiperInstance.activeIndex].classList.add(
              "slide-animated",
            );
          }
        };

        if (document.readyState === "complete") {
          // Layout already done, but use rAF to ensure paint cycle is complete
          requestAnimationFrame(() => navigateAndAnimate());
        } else {
          window.addEventListener("load", () => {
            requestAnimationFrame(() => navigateAndAnimate());
          });
        }
      },

      // Called as soon as a slide transition starts
      slideChangeTransitionStart: function () {
        if (this.activeIndex === 2 && window.innerWidth <= 991) {
          const goingDown = this.previousIndex < 2;
          this.slideTo(goingDown ? 3 : 1, 850);
        }
      },

      // Called as soon as a slide transition starts
      slideChange: function () {
        updateActiveState(this.activeIndex);

        // Sync URL Hash without triggering page jump/reload (#section-2b, #section-9b, etc.)
        const targetId =
          sectionIds[this.activeIndex] || `section-${this.activeIndex + 1}`;
        history.replaceState(null, "", `#${targetId}`);
        if (this.slides) {
          const targetSlide = this.slides[this.activeIndex];
          const prevColor = sectionColors[this.previousIndex];
          const targetColor = sectionColors[this.activeIndex];

          // Reset animation classes on inactive slides
          this.slides.forEach((slide, idx) => {
            if (idx !== this.activeIndex) {
              slide.classList.remove("slide-animated");
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

        // Pause on section-2b (index 2): when Swiper lands here via touch swipe on desktop, run intermediate pause transition
        if (this.activeIndex === 2) {
          if (window.innerWidth > 991) {
            if (!isPausingOnSec2b) {
              const goingDown = this.previousIndex < 2;
              runSec2bPauseTransition(goingDown);
            }
          }
          return;
        }

        // Cleanup inactive slides
        this.slides.forEach((slide, idx) => {
          if (idx !== this.activeIndex) {
            slide.classList.remove("slide-animated");
          }
        });

        // Trigger entrance animation immediately when the slide transition completes
        const currentSlide = this.slides[this.activeIndex];
        if (currentSlide) {
          currentSlide.classList.add("slide-animated");
        }
      },
    },
  });

  // --------------------------------------------------------------------------
  // 2. Active State Manager (Sync Navbar and Header Theme)
  // --------------------------------------------------------------------------
  function updateActiveState(index) {
    // Header theme switching: Light vs Dark Header
    const isDarkThemeGroup = [1, 3, 5, 10, 11].includes(index);

    if (isDarkThemeGroup) {
      if (mainHeader) mainHeader.classList.remove("light-theme");
    } else {
      if (mainHeader) mainHeader.classList.add("light-theme");
    }

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
  // 2b. Section 2b Intermediate Pause Handler (Center Position for 2s)
  // --------------------------------------------------------------------------
  let isPausingOnSec2b = false;
  let isIndefiniteHold = false;
  let sec2bPauseTimer = null;

  function clearSec2bTimer() {
    if (sec2bPauseTimer) {
      clearTimeout(sec2bPauseTimer);
      sec2bPauseTimer = null;
    }
  }

  function resumeFromSec2bToSection3(targetSlide = 3) {
    clearSec2bTimer();
    isPausingOnSec2b = false;
    isIndefiniteHold = false;
    swiper.slideTo(targetSlide, 650);
  }

  function runSec2bPauseTransition(goingDown) {
    clearSec2bTimer();
    isPausingOnSec2b = true;
    isIndefiniteHold = false;

    const viewportH = window.innerHeight;
    const h0 = swiper.slides[0] ? swiper.slides[0].offsetHeight : viewportH;
    const h1 = swiper.slides[1] ? swiper.slides[1].offsetHeight : viewportH;
    const h2 = swiper.slides[2] ? swiper.slides[2].offsetHeight : 400;

    const sec2bTop = h0 + h1;
    const desiredTopOnScreen = Math.max(0, (viewportH - h2) / 2);
    const intermediateTranslate = -(sec2bTop - desiredTopOnScreen);

    if (goingDown) {
      // Step 1: Smooth glide to intermediate position (Section 2b centered vertically in viewport)
      swiper.translateTo(intermediateTranslate, 800, true, true);
      if (swiper.slides[2]) {
        requestAnimationFrame(() => {
          swiper.slides[2].classList.add("slide-animated");
        });
      }

      // Step 2: AFTER glide completes (800ms), pause 2 seconds centered on screen
      sec2bPauseTimer = setTimeout(() => {
        sec2bPauseTimer = setTimeout(() => {
          if (!isIndefiniteHold && isPausingOnSec2b) {
            resumeFromSec2bToSection3(3);
          }
        }, 2000);
      }, 800);
    } else {
      // Going UP from Section 3
      swiper.translateTo(intermediateTranslate, 800, true, true);
      if (swiper.slides[2]) {
        requestAnimationFrame(() => {
          swiper.slides[2].classList.add("slide-animated");
        });
      }

      sec2bPauseTimer = setTimeout(() => {
        sec2bPauseTimer = setTimeout(() => {
          if (!isIndefiniteHold && isPausingOnSec2b) {
            resumeFromSec2bToSection3(1);
          }
        }, 2000);
      }, 800);
    }
  }

  // Click listener on Section 2b element and Document:
  let lastClickTime = 0;
  function handleSec2bClickOrTouch(e) {
    const now = Date.now();
    if (now - lastClickTime < 300) return; // Prevent double-firing within 300ms
    lastClickTime = now;

    if (isPausingOnSec2b) {
      if (!isIndefiniteHold) {
        // First click while stationary: cancel 2s auto-timer -> convert to INDEFINITE HOLD!
        clearSec2bTimer();
        isIndefiniteHold = true;
      } else {
        // Second click during indefinite hold: resume to Section 3!
        resumeFromSec2bToSection3(3);
      }
    }
  }

  // Single document-level click & touchstart listener for mobile and desktop
  document.addEventListener("click", handleSec2bClickOrTouch);
  document.addEventListener(
    "touchstart",
    (e) => {
      if (isPausingOnSec2b) {
        handleSec2bClickOrTouch(e);
      }
    },
    { passive: true },
  );

  // --------------------------------------------------------------------------
  // 2c. Custom Wheel Handler
  // --------------------------------------------------------------------------
  let wheelLocked = false;
  document.querySelector(".main-swiper").addEventListener(
    "wheel",
    (e) => {
      if (wheelLocked || swiper.animating) return;
      wheelLocked = true;

      const current = swiper.activeIndex;
      const delta = e.deltaY;
      const isSec2Transition =
        (current === 1 && delta > 0) || (current === 3 && delta < 0);

      if (isPausingOnSec2b) {
        resumeFromSec2bToSection3(delta > 0 ? 3 : 1);
      } else if (delta > 0) {
        // Scrolling DOWN
        if (current === 1) {
          if (window.innerWidth > 991) {
            runSec2bPauseTransition(true);
          } else {
            swiper.slideTo(3, 850);
          }
        } else {
          swiper.slideNext(650);
        }
      } else if (delta < 0) {
        // Scrolling UP
        if (current === 3) {
          if (window.innerWidth > 991) {
            runSec2bPauseTransition(false);
          } else {
            swiper.slideTo(1, 850);
          }
        } else {
          swiper.slidePrev(650);
        }
      }

      setTimeout(
        () => {
          wheelLocked = false;
        },
        isSec2Transition ? 950 : 800,
      );
    },
    { passive: true },
  );

  // --------------------------------------------------------------------------
  // 2d. Custom Keyboard Handler
  // --------------------------------------------------------------------------
  document.addEventListener("keydown", (e) => {
    if (swiper.animating) return;
    const current = swiper.activeIndex;

    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      if (isPausingOnSec2b) {
        clearSec2bTimer();
        isPausingOnSec2b = false;
        swiper.slideTo(3, 650);
      } else if (current === 1) {
        if (window.innerWidth > 991) {
          runSec2bPauseTransition(true);
        } else {
          swiper.slideTo(3, 850);
        }
      } else {
        swiper.slideNext(650);
      }
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      if (isPausingOnSec2b) {
        clearSec2bTimer();
        isPausingOnSec2b = false;
        swiper.slideTo(1, 650);
      } else if (current === 3) {
        if (window.innerWidth > 991) {
          runSec2bPauseTransition(false);
        } else {
          swiper.slideTo(1, 850);
        }
      } else {
        swiper.slidePrev(650);
      }
    }
  });

  function smartSlideTo(targetIndex) {
    if (targetIndex < 0 || targetIndex >= swiper.slides.length) return;

    const currentIndex = swiper.activeIndex;
    const distance = Math.abs(targetIndex - currentIndex);

    if (distance <= 1) {
      if (isPausingOnSec2b) {
        clearSec2bTimer();
        isPausingOnSec2b = false;
      }
      swiper.slideTo(targetIndex, 650);
    } else if (distance === 2) {
      if (currentIndex === 1 && targetIndex === 3) {
        if (window.innerWidth > 991) {
          runSec2bPauseTransition(true);
        } else {
          swiper.slideTo(3, 850);
        }
      } else if (currentIndex === 3 && targetIndex === 1) {
        if (window.innerWidth > 991) {
          runSec2bPauseTransition(false);
        } else {
          swiper.slideTo(1, 850);
        }
      } else {
        swiper.slideTo(targetIndex, 650);
      }
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

  // Intercept all # links (Logo, Navbar, CTA buttons) to prevent jump freeze
  const allHashLinks = document.querySelectorAll('a[href^="#"]');
  allHashLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const hash = href.replace("#", "");
        const targetIdx = sectionIds.indexOf(hash);
        if (targetIdx !== -1) {
          e.preventDefault();
          smartSlideTo(targetIdx);
        }
      }
    });
  });

  // Handle URL hash changes typed directly into the address bar
  window.addEventListener("hashchange", () => {
    const targetIdx = hashToSlideIndex(window.location.hash);
    if (targetIdx !== swiper.activeIndex) {
      // Reset native scroll offset that browser applied when jumping to hash anchor
      const wrapper = document.querySelector(".swiper-wrapper");
      if (wrapper) {
        wrapper.scrollTop = 0;
      }
      document.querySelector(".main-swiper").scrollTop = 0;
      smartSlideTo(targetIdx);
    }
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

  // Return to 4iC Button Click Handler (Sections 5, 6, 7, 8)
  return4icBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(btn.getAttribute("data-slide-target"), 10);
      smartSlideTo(!isNaN(targetIndex) ? targetIndex : 3);
    });
  });

  // --------------------------------------------------------------------------
  // Mobile Off-Canvas Navigation Drawer Toggle Logic
  // --------------------------------------------------------------------------
  const hamburgerToggle = document.getElementById("hamburgerToggle");
  const drawerClose = document.getElementById("drawerClose");
  const navDrawer = document.getElementById("navDrawer");
  const navBackdrop = document.getElementById("navBackdrop");

  const openMobileMenu = () => {
    if (navDrawer && navBackdrop) {
      navDrawer.classList.add("is-active");
      navBackdrop.classList.add("is-active");
      document.body.classList.add("no-scroll");
      if (hamburgerToggle)
        hamburgerToggle.setAttribute("aria-expanded", "true");
    }
  };

  const closeMobileMenu = () => {
    if (navDrawer && navBackdrop) {
      navDrawer.classList.remove("is-active");
      navBackdrop.classList.remove("is-active");
      document.body.classList.remove("no-scroll");
      if (hamburgerToggle)
        hamburgerToggle.setAttribute("aria-expanded", "false");
    }
  };

  if (hamburgerToggle) {
    hamburgerToggle.addEventListener("click", openMobileMenu);
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", closeMobileMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMobileMenu);
  }

  // Close drawer automatically when clicking any nav item or action button inside drawer
  const drawerLinks = document.querySelectorAll(
    ".nav-drawer .nav-item, .nav-drawer .btn-conversation",
  );
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  // Stop Swiper section slide change ONLY when wheeling over .sec-9b__card-body
  document.addEventListener(
    "wheel",
    (e) => {
      if (e.target.closest(".sec-9b__card-body")) {
        e.stopPropagation();
      }
    },
    { capture: true },
  );
});
