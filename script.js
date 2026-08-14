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
  const continuumNodes = document.querySelectorAll(".sec-continuum__node");
  const return4icBtns = document.querySelectorAll(".btn-return-4ic");

  // Section IDs mapping in exact slide order (12 sections)
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
    "#0E6CC7", // Section 2b (2) - Dark Radial Highlights
    "#ffffff", // Section 3 (3) - White Framework
    "#1F6CA0", // Section 4 (4) - Dark Blue Orbit
    "#ffffff", // Section 5 (5) - White Pillar 1
    "#01103B", // Section 6 (6) - Dark Blue Pillar 2
    "#ffffff", // Section 7 (7) - White Pillar 3
    "#01103B", // Section 8 (8) - Dark Blue Pillar 4
    "#ffffff", // Section 9 (9) - Linear Gradient with White Left
    "#ffffff", // Section 9b (10) - White Advisory
    "#f7f9fc", // Section 10 (11) - White/Light Contact
  ];

  // Parse hash to slide index helper
  function hashToSlideIndex(hash) {
    if (!hash) return 0;
    const id = hash.replace("#", "");
    const idx = sectionIds.indexOf(id);
    return idx === -1 ? 0 : idx;
  }

  // Read initial target from URL Hash, fallback to 0 (Section 1)
  const initialTargetIndex = hashToSlideIndex(window.location.hash);

  const swiper = new Swiper(".main-swiper", {
    direction: "vertical",
    initialSlide: initialTargetIndex,
    slidesPerView: 1,
    speed: 750,
    effect: "slide",
    autoHeight: false,
    mousewheel: {
      enabled: true,
      releaseOnEdges: false,
      thresholdDelta: 20,
    },
    keyboard: {
      enabled: true,
    },
    grabCursor: false,
    touchThreshold: 5,
    on: {
      init: function () {
        const swiperInstance = this;
        updateActiveState(swiperInstance.activeIndex);

        requestAnimationFrame(() => {
          if (
            swiperInstance.slides &&
            swiperInstance.slides[swiperInstance.activeIndex]
          ) {
            swiperInstance.slides[swiperInstance.activeIndex].classList.add(
              "slide-animated",
            );
          }
        });
      },

      slideChange: function () {
        updateActiveState(this.activeIndex);

        const targetId =
          sectionIds[this.activeIndex] || `section-${this.activeIndex + 1}`;
        history.replaceState(null, "", `#${targetId}`);

        if (this.slides) {
          this.slides.forEach((slide, idx) => {
            if (idx !== this.activeIndex) {
              slide.classList.remove("slide-animated");
            }
          });

          if (this.slides[this.previousIndex]) {
            this.slides[this.previousIndex].classList.add("visited");
          }
        }
      },

      slideChangeTransitionEnd: function () {
        if (!this.slides) return;

        this.slides.forEach((slide, idx) => {
          if (idx !== this.activeIndex) {
            slide.classList.remove("slide-animated");
          }
        });

        const currentSlide = this.slides[this.activeIndex];
        if (currentSlide) {
          currentSlide.classList.add("slide-animated");
        }
      },
    },
  });

  // --------------------------------------------------------------------------
  // Active State Manager (Sync Navbar and Header Theme)
  // --------------------------------------------------------------------------
  function updateActiveState(index) {
    // Sections with white/light backgrounds have dark header icons & text (no .light-theme class on header)
    const isDarkThemeGroup = [1, 3, 5, 7, 9, 10, 11].includes(index);

    if (isDarkThemeGroup) {
      if (mainHeader) mainHeader.classList.remove("light-theme");
    } else {
      if (mainHeader) mainHeader.classList.add("light-theme");
    }

    // Active Nav Link highlighting based on current slide index
    let activeNavHref = "#section-1";
    if (index === 0) {
      activeNavHref = "#section-1";
    } else if (index === 1 || index === 2 || index === 3) {
      activeNavHref = "#section-2";
    } else if (index === 4) {
      activeNavHref = "#section-4";
    } else if (index >= 5 && index <= 10) {
      activeNavHref = "#section-9b";
    } else if (index === 11) {
      activeNavHref = "#section-10";
    }

    navItems.forEach((navItem) => {
      navItem.classList.toggle(
        "active",
        navItem.getAttribute("href") === activeNavHref,
      );
    });
  }

  function smartSlideTo(targetIndex) {
    if (targetIndex < 0 || targetIndex >= sectionIds.length) return;
    swiper.slideTo(targetIndex, 750);
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
      smartSlideTo(!isNaN(targetIndex) ? targetIndex : 4);
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
