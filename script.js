async function loadSharedHeader() {
  const mainHeader = document.getElementById("mainHeader");
  if (!mainHeader) return;

  try {
    const res = await fetch("components/header.html");
    if (res.ok) {
      mainHeader.innerHTML = await res.text();
    } else {
      console.error("Failed to load components/header.html, status:", res.status);
    }
  } catch (err) {
    console.error("Error loading components/header.html:", err);
  }

  highlightActiveNav();

  bindNavEvents();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  let activeKey = "home";

  if (currentPath.includes("about")) {
    activeKey = "about";
  } else if (currentPath.includes("contact")) {
    activeKey = "contact";
  } else if (
    currentPath.includes("phase-0") ||
    currentPath.includes("diagnostic")
  ) {
    activeKey = "phase0";
  } else if (
    currentPath.includes("thirdeye") ||
    currentPath.includes("third-eye")
  ) {
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
    const parentServices = document.querySelector(
      '.nav-item[data-nav="services"]',
    );
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

  const nonClickableItems = document.querySelectorAll(
    '.nav-item--dropdown, .nav-item[data-nav="4ic"]',
  );
  nonClickableItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  const drawerLinks = document.querySelectorAll(
    ".nav-drawer .nav-item:not(.nav-item--dropdown), .nav-drawer .nav-dropdown-item, .nav-drawer .btn-conversation",
  );
  drawerLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

async function loadSharedFooter() {
  const footerTargets = document.querySelectorAll(
    "[data-shared-footer], #sharedFooter, .shared-footer-container",
  );
  if (!footerTargets.length) return;

  try {
    const res = await fetch("components/footer.html");
    if (res.ok) {
      const footerHTML = await res.text();
      footerTargets.forEach((target) => {
        target.innerHTML = footerHTML;
      });
    } else {
      console.error("Failed to load components/footer.html, status:", res.status);
    }
  } catch (err) {
    console.error("Error loading components/footer.html:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {

  await Promise.all([loadSharedHeader(), loadSharedFooter()]);

  const swiperEl = document.querySelector(".main-swiper");
  const wrapperEl = document.querySelector(".swiper-wrapper");
  if (swiperEl) swiperEl.scrollTop = 0;
  if (wrapperEl) wrapperEl.scrollTop = 0;
  window.scrollTo(0, 0);

  const mainHeader = document.getElementById("mainHeader");
  const scrollDownBtn = document.getElementById("scrollDownBtn");
  const continuumNodes = document.querySelectorAll(".sec-continuum__node");
  const return4icBtns = document.querySelectorAll(".btn-return-4ic");

  const domSlides = Array.from(
    document.querySelectorAll(".main-swiper .swiper-slide"),
  );
  const sectionIds = domSlides.map(
    (slide, idx) => slide.id || `section-${idx + 1}`,
  );

  const sectionColors = [
    "#C5DAF3",
    "#ffffff",
    "#0E6CC7",
    "#ffffff",
    "#1F6CA0",
    "#ffffff",
    "#01103B",
    "#ffffff",
    "#01103B",
    "#ffffff",
    "#ffffff",
    "#f7f9fc",
  ];

  function hashToSlideIndex(hash) {
    if (!hash) return 0;
    const id = hash.replace("#", "");
    const idx = sectionIds.indexOf(id);
    return idx === -1 ? 0 : idx;
  }

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
            const initialSlide =
              swiperInstance.slides[swiperInstance.activeIndex];
            initialSlide.classList.add("slide-animated");
            triggerCounterAnimations(initialSlide);
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
            const prevSlide = this.slides[this.previousIndex];
            prevSlide.classList.add("visited");

            prevSlide.querySelectorAll("[data-counter]").forEach((el) => {
              if (el._counterTimeoutId) clearTimeout(el._counterTimeoutId);
              if (el._counterAnimId) cancelAnimationFrame(el._counterAnimId);
              const target = el.getAttribute("data-counter");
              const suffix = el.getAttribute("data-suffix") || "";
              const prefix = el.getAttribute("data-prefix") || "";
              if (target) {
                el.textContent = `${prefix}${target}${suffix}`;
                el._counterDone = true;
                el.setAttribute("data-counter-done", "true");
              }
            });
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
          triggerCounterAnimations(currentSlide);
        }
      },
    },
  });

  function triggerCounterAnimations(container) {
    if (!container) return;
    const counterElements = container.querySelectorAll("[data-counter]");
    if (!counterElements.length) return;

    counterElements.forEach((el) => {
      if (el._counterDone || el.getAttribute("data-counter-done") === "true") {
        return;
      }

      const target = parseInt(el.getAttribute("data-counter"), 10);
      const suffix = el.getAttribute("data-suffix") || "";
      const prefix = el.getAttribute("data-prefix") || "";
      const start = parseInt(el.getAttribute("data-start"), 10) || 1;
      const duration = parseInt(el.getAttribute("data-duration"), 10) || 1200;
      const delay = parseInt(el.getAttribute("data-delay"), 10) || 300;

      if (isNaN(target)) return;

      el.textContent = `${prefix}${start}${suffix}`;

      if (el._counterAnimId) {
        cancelAnimationFrame(el._counterAnimId);
      }
      if (el._counterTimeoutId) {
        clearTimeout(el._counterTimeoutId);
      }

      el._counterTimeoutId = setTimeout(() => {
        let startTime = null;

        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);

          const easeOutProgress = 1 - Math.pow(1 - progress, 1.4);

          const current = Math.floor(
            start + (target - start) * easeOutProgress,
          );

          el.textContent = `${prefix}${current}${suffix}`;

          if (progress < 1) {
            el._counterAnimId = requestAnimationFrame(animate);
          } else {
            el.textContent = `${prefix}${target}${suffix}`;
            el._counterAnimId = null;
            el._counterDone = true;
            el.setAttribute("data-counter-done", "true");
          }
        }

        el._counterAnimId = requestAnimationFrame(animate);
      }, delay);
    });
  }

  function updateHeaderTheme(index) {
    if (!mainHeader) return;

    const activeSlide = domSlides[index];
    if (activeSlide) {
      if (
        activeSlide.classList.contains("sec-about-bg-dark") ||
        activeSlide.classList.contains("sec-phase0-bg-dark") ||
        activeSlide.classList.contains("sec-thirdeye-bg-dark") ||
        activeSlide.classList.contains("sec-market-bg-dark") ||
        activeSlide.classList.contains("sec-operational-bg-dark") ||
        activeSlide.classList.contains("sec-digital-bg-dark") ||
        activeSlide.classList.contains("sec-capacity-bg-dark") ||
        activeSlide.classList.contains("sec-contact-bg-dark") ||
        activeSlide.classList.contains("sec-contact-form")
      ) {
        mainHeader.classList.add("light-theme");
        return;
      } else if (
        activeSlide.classList.contains("sec-about-bg-light") ||
        activeSlide.classList.contains("sec-phase0-bg-light") ||
        activeSlide.classList.contains("sec-thirdeye-bg-light") ||
        activeSlide.classList.contains("sec-market-bg-light") ||
        activeSlide.classList.contains("sec-operational-bg-light") ||
        activeSlide.classList.contains("sec-digital-bg-light") ||
        activeSlide.classList.contains("sec-capacity-bg-light") ||
        activeSlide.classList.contains("sec-contact-bg-light")
      ) {
        mainHeader.classList.remove("light-theme");
        return;
      }
    }

    const isLightBg = [1, 3, 5, 7, 9, 10, 11].includes(index);
    mainHeader.classList.toggle("light-theme", !isLightBg);
  }

  function smartSlideTo(targetIndex) {
    if (targetIndex < 0 || targetIndex >= sectionIds.length) return;
    swiper.slideTo(targetIndex, 750);
  }

  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      smartSlideTo(1);
    });
  }

  const isHomePage =
    !document.body.classList.contains("page-about") &&
    !document.body.classList.contains("page-phase-0") &&
    !document.body.classList.contains("page-thirdeye") &&
    !document.body.classList.contains("page-market-intelligence") &&
    !document.body.classList.contains("page-contact");

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

  continuumNodes.forEach((node) => {
    node.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(node.getAttribute("data-slide-target"), 10);
      if (!isNaN(targetIndex)) {
        smartSlideTo(targetIndex);
      }
    });
  });

  return4icBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(btn.getAttribute("data-slide-target"), 10);
      smartSlideTo(!isNaN(targetIndex) ? targetIndex : 4);
    });
  });

  document.addEventListener(
    "wheel",
    (e) => {
      if (e.target.closest(".sec-9b__card-body")) {
        e.stopPropagation();
      }
    },
    { capture: true },
  );

  const sec9bCards = document.querySelectorAll(".sec-9b__card[data-href]");
  sec9bCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".sec-9b__card-btn")) return;
      const href = card.getAttribute("data-href");
      if (href) {
        window.location.href = href;
      }
    });
  });
});
