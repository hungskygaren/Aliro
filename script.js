/**
 * Aliro Consulting - Full-Screen Vertical Swiper Engine & Reusable Navigation
 * Loads standalone components/header.html for clean, decoupled architecture.
 */

// ----------------------------------------------------------------------------
// 1. Standalone Header Component Loader
// ----------------------------------------------------------------------------
async function loadSharedHeader() {
  const mainHeader = document.getElementById("mainHeader");
  if (!mainHeader) return;

  try {
    const res = await fetch("components/header.html");
    if (res.ok) {
      mainHeader.innerHTML = await res.text();
    }
  } catch (err) {
    // Fallback for file:// protocol direct browser open where AJAX fetch is blocked
    console.info(
      "Using local header template fallback for direct file:// access.",
    );
    mainHeader.innerHTML = `
      <div class="navbar-container">
        <a href="index.html#section-1" class="logo-brand" aria-label="Aliro Consulting Home">
          <img src="assets/logo.webp" alt="Aliro Consulting Logo" class="logo-img" />
        </a>
        <button class="hamburger-toggle" id="hamburgerToggle" aria-label="Toggle Navigation Menu" aria-expanded="false">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
        <div class="nav-drawer" id="navDrawer">
          <button class="drawer-close" id="drawerClose" aria-label="Close navigation menu">&times;</button>
          <nav class="nav-menu" id="navMenu">
            <a href="index.html#section-1" class="nav-item" data-nav="home">Home</a>
            <div class="nav-dropdown-wrapper">
              <a href="market-intelligence.html" class="nav-item" data-nav="4ic" aria-haspopup="true" aria-expanded="false">4iC</a>
              <div class="nav-dropdown-menu" role="menu">
                <a href="market-intelligence.html" class="nav-dropdown-item" data-nav="market" role="menuitem">Market Intelligence</a>
                <a href="javascript:void(0)" class="nav-dropdown-item" data-nav="operational" role="menuitem">Operational Intelligence</a>
                <a href="javascript:void(0)" class="nav-dropdown-item" data-nav="digital" role="menuitem">Digital Intelligence</a>
                <a href="javascript:void(0)" class="nav-dropdown-item" data-nav="capacity" role="menuitem">Capacity Capability Intelligence</a>
              </div>
            </div>
            <div class="nav-dropdown-wrapper">
              <a href="phase-0-diagnostic.html" class="nav-item" data-nav="services" aria-haspopup="true" aria-expanded="false">Services</a>
              <div class="nav-dropdown-menu" role="menu">
                <a href="phase-0-diagnostic.html" class="nav-dropdown-item" data-nav="phase0" role="menuitem">Phase 0 Diagnostic</a>
                <a href="thirdeye.html" class="nav-dropdown-item" data-nav="thirdeye" role="menuitem">ThirdEye</a>
              </div>
            </div>
            <a href="about.html" class="nav-item" data-nav="about">About Us</a>
            <a href="contact.html" class="nav-item" data-nav="contact">Contact</a>
          </nav>
          <div class="nav-actions">
            <a href="contact.html" class="btn-conversation">Start a Conversation</a>
          </div>
        </div>
        <div class="nav-backdrop" id="navBackdrop"></div>
      </div>
    `;
  }

  // Auto-highlight active navigation item based on current URL path
  highlightActiveNav();

  // Attach all mobile drawer toggle & click events
  bindNavEvents();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  let activeKey = "home";

  if (currentPath.includes("about")) {
    activeKey = "about";
  } else if (currentPath.includes("contact")) {
    activeKey = "contact";
  } else if (currentPath.includes("phase-0") || currentPath.includes("diagnostic")) {
    activeKey = "phase0";
  } else if (currentPath.includes("thirdeye") || currentPath.includes("third-eye")) {
    activeKey = "thirdeye";
  } else if (currentPath.includes("services")) {
    activeKey = "phase0";
  } else if (currentPath.includes("market-intelligence")) {
    activeKey = "market";
  } else if (currentPath.includes("operational-intelligence")) {
    activeKey = "operational";
  } else if (currentPath.includes("digital-intelligence")) {
    activeKey = "digital";
  } else if (
    currentPath.includes("capacity-capability-intelligence") ||
    currentPath.includes("capacity")
  ) {
    activeKey = "capacity";
  }

  const is4iC = ["market", "operational", "digital", "capacity"].includes(
    activeKey,
  );
  const isServices = ["phase0", "thirdeye"].includes(activeKey);

  document
    .querySelectorAll(".nav-menu .nav-item, .nav-menu .nav-dropdown-item")
    .forEach((item) => item.classList.remove("active"));

  if (is4iC) {
    const parent4iC = document.querySelector('.nav-item[data-nav="4ic"]');
    if (parent4iC) parent4iC.classList.add("active");
    const subItem = document.querySelector(
      `.nav-dropdown-item[data-nav="${activeKey}"]`,
    );
    if (subItem) subItem.classList.add("active");
  } else if (isServices) {
    const parentServices = document.querySelector('.nav-item[data-nav="services"]');
    if (parentServices) parentServices.classList.add("active");
    const subItem = document.querySelector(
      `.nav-dropdown-item[data-nav="${activeKey}"]`,
    );
    if (subItem) subItem.classList.add("active");
  } else {
    const activeItem = document.querySelector(
      `.nav-item[data-nav="${activeKey}"]`,
    );
    if (activeItem) activeItem.classList.add("active");
  }
}

function bindNavEvents() {
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

  const drawerLinks = document.querySelectorAll(
    ".nav-drawer .nav-item, .nav-drawer .nav-dropdown-item, .nav-drawer .btn-conversation",
  );
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

// ----------------------------------------------------------------------------
// 2. Swiper Initialization & Interactive Engine
// ----------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", async () => {
  // Load standalone header component from components/header.html
  await loadSharedHeader();

  // Reset any native scroll offset the browser applied from hash anchors before Swiper takes over
  const swiperEl = document.querySelector(".main-swiper");
  const wrapperEl = document.querySelector(".swiper-wrapper");
  if (swiperEl) swiperEl.scrollTop = 0;
  if (wrapperEl) wrapperEl.scrollTop = 0;
  window.scrollTo(0, 0);

  // DOM Element Selectors
  const mainHeader = document.getElementById("mainHeader");
  const scrollDownBtn = document.getElementById("scrollDownBtn");
  const continuumNodes = document.querySelectorAll(".sec-continuum__node");
  const return4icBtns = document.querySelectorAll(".btn-return-4ic");

  // Collect section IDs dynamically in exact slide order from DOM
  const domSlides = Array.from(
    document.querySelectorAll(".main-swiper .swiper-slide"),
  );
  const sectionIds = domSlides.map(
    (slide, idx) => slide.id || `section-${idx + 1}`,
  );

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
        updateHeaderTheme(swiperInstance.activeIndex);

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
        updateHeaderTheme(this.activeIndex);

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
  // Header Theme Switcher (Sync Header text/icon color with Section background)
  // --------------------------------------------------------------------------
  function updateHeaderTheme(index) {
    if (!mainHeader) return;

    const activeSlide = domSlides[index];
    if (activeSlide) {
      if (
        activeSlide.classList.contains("sec-mockup-bg-dark") ||
        activeSlide.classList.contains("sec-about-bg-dark") ||
        activeSlide.classList.contains("sec-contact-form")
      ) {
        mainHeader.classList.add("light-theme");
        return;
      } else if (
        activeSlide.classList.contains("sec-mockup-bg-light") ||
        activeSlide.classList.contains("sec-about-bg-light") ||
        activeSlide.classList.contains("sec-contact-mockup")
      ) {
        mainHeader.classList.remove("light-theme");
        return;
      }
    }

    // Default Home Page Theme: Sections with white/light backgrounds -> dark header (remove .light-theme)
    const isLightBg = [1, 3, 5, 7, 9, 10, 11].includes(index);
    mainHeader.classList.toggle("light-theme", !isLightBg);
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

  // Intercept all hash links (including index.html# links on Home page) to prevent jump freeze
  const isHomePage =
    !document.body.classList.contains("page-about") &&
    !document.body.classList.contains("page-mockup");

  const allNavLinks = document.querySelectorAll('a[href*="#"]');
  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#")) {
        const hash = href.replace("#", "");
        const targetIdx = sectionIds.indexOf(hash);
        if (targetIdx !== -1) {
          e.preventDefault();
          smartSlideTo(targetIdx);
        }
      } else if (href.startsWith("index.html#") && isHomePage) {
        const hash = href.replace("index.html#", "");
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
