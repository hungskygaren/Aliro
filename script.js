function getBasePath() {
  const path = window.location.pathname.replace(/\\/g, "/");
  if (path.includes("/4ic/") || path.includes("/services/")) {
    return "../";
  }
  return "";
}

async function loadSharedHeader() {
  const mainHeader = document.getElementById("mainHeader");
  if (!mainHeader) return;

  const basePath = getBasePath();

  try {
    const res = await fetch(basePath + "components/header.html");
    if (res.ok) {
      let html = await res.text();
      if (basePath) {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        temp.querySelectorAll("a[href]").forEach((link) => {
          const href = link.getAttribute("href");
          if (
            href &&
            !href.startsWith("http") &&
            !href.startsWith("#") &&
            !href.startsWith("javascript:") &&
            !href.startsWith("mailto:")
          ) {
            link.setAttribute("href", basePath + href);
          }
        });
        temp.querySelectorAll("img[src]").forEach((img) => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http") && !src.startsWith("data:")) {
            img.setAttribute("src", basePath + src);
          }
        });
        html = temp.innerHTML;
      }
      mainHeader.innerHTML = html;
    } else {
      console.error(
        "Failed to load components/header.html, status:",
        res.status,
      );
    }
  } catch (err) {
    console.error("Error loading components/header.html:", err);
  }

  highlightActiveNav();

  bindNavEvents();
}

function highlightActiveNav() {
  const currentPath = window.location.pathname
    .toLowerCase()
    .replace(/\\/g, "/");
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
  } else if (
    currentPath.includes("services/overview") ||
    currentPath.includes("overview") ||
    currentPath.endsWith("/services/") ||
    currentPath.endsWith("/services/index.html")
  ) {
    activeKey = "services-overview";
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
  const isServices = ["services-overview", "phase0", "thirdeye"].includes(
    activeKey,
  );

  document
    .querySelectorAll(".nav-menu .nav-item, .nav-menu .nav-dropdown-item")
    .forEach((item) => item.classList.remove("active"));

  if (is4iC) {
    const parent4iC = document.querySelector('.nav-item[data-nav="4ic"]');
    if (parent4iC) {
      parent4iC.classList.add("active");
      const wrapper = parent4iC.closest(".nav-dropdown-wrapper");
      if (wrapper) {
        wrapper.classList.add("is-open");
        parent4iC.setAttribute("aria-expanded", "true");
      }
    }
    const subItem = document.querySelector(
      `.nav-dropdown-item[data-nav="${activeKey}"]`,
    );
    if (subItem) subItem.classList.add("active");
  } else if (isServices) {
    const parentServices = document.querySelector(
      '.nav-item[data-nav="services"]',
    );
    if (parentServices) {
      parentServices.classList.add("active");
      const wrapper = parentServices.closest(".nav-dropdown-wrapper");
      if (wrapper) {
        wrapper.classList.add("is-open");
        parentServices.setAttribute("aria-expanded", "true");
      }
    }
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

  const dropdownToggles = document.querySelectorAll(
    '.nav-item--dropdown, .nav-item[data-nav="4ic"]',
  );
  dropdownToggles.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const wrapper = item.closest(".nav-dropdown-wrapper");
      if (!wrapper) return;

      const isCurrentlyOpen = wrapper.classList.contains("is-open");

      document
        .querySelectorAll(".nav-drawer .nav-dropdown-wrapper")
        .forEach((other) => {
          if (other !== wrapper) {
            other.classList.remove("is-open");
            const otherBtn = other.querySelector(".nav-item--dropdown");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
          }
        });

      if (isCurrentlyOpen) {
        wrapper.classList.remove("is-open");
        item.setAttribute("aria-expanded", "false");
      } else {
        wrapper.classList.add("is-open");
        item.setAttribute("aria-expanded", "true");
      }
    });
  });

  const drawerLinks = document.querySelectorAll(
    ".nav-drawer .nav-item:not(.nav-item--dropdown), .nav-drawer .nav-dropdown-item, .nav-drawer .btn-conversation",
  );
  drawerLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.classList.contains("nav-dropdown-item--disabled")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      closeMobileMenu();
    });
  });

  document.addEventListener("click", (e) => {
    const disabled = e.target.closest(".nav-dropdown-item--disabled");
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}

async function loadSharedFooter() {
  const footerTargets = document.querySelectorAll(
    "[data-shared-footer], #sharedFooter, .shared-footer-container",
  );
  if (!footerTargets.length) return;

  const basePath = getBasePath();

  try {
    const res = await fetch(basePath + "components/footer.html");
    if (res.ok) {
      let footerHTML = await res.text();
      if (basePath) {
        const temp = document.createElement("div");
        temp.innerHTML = footerHTML;
        temp.querySelectorAll("a[href]").forEach((link) => {
          const href = link.getAttribute("href");
          if (
            href &&
            !href.startsWith("http") &&
            !href.startsWith("#") &&
            !href.startsWith("javascript:") &&
            !href.startsWith("mailto:")
          ) {
            link.setAttribute("href", basePath + href);
          }
        });
        temp.querySelectorAll("img[src]").forEach((img) => {
          const src = img.getAttribute("src");
          if (src && !src.startsWith("http") && !src.startsWith("data:")) {
            img.setAttribute("src", basePath + src);
          }
        });
        footerHTML = temp.innerHTML;
      }
      footerTargets.forEach((target) => {
        target.innerHTML = footerHTML;
      });
    } else {
      console.error(
        "Failed to load components/footer.html, status:",
        res.status,
      );
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

  const isContactPage = document.body.classList.contains("page-contact");

  function setupContactMobileSlides() {
    if (!isContactPage) return;

    const stage = document.querySelector(".sec-contact-1__stage");
    const formBox = document.querySelector(".sec-contact-1__right");
    const sec1 = document.querySelector(".sec-contact-1");
    const sec3 = document.querySelector(".sec-contact-3");
    const wrapper = document.querySelector(".swiper-wrapper");
    if (!stage || !formBox || !sec1 || !sec3 || !wrapper) return;

    let placeholder = document.getElementById("contactFormPlaceholder");
    if (!placeholder) {
      placeholder = document.createElement("div");
      placeholder.id = "contactFormPlaceholder";
      placeholder.style.display = "none";
      stage.appendChild(placeholder);
    }

    let mobileSlide = document.getElementById("contactMobileSlide");
    if (!mobileSlide) {
      mobileSlide = document.createElement("section");
      mobileSlide.id = "contactMobileSlide";
      mobileSlide.className =
        "scroll-section swiper-slide sec-contact-form-slide sec-contact-bg-light";
      mobileSlide.setAttribute("data-section-index", "1");
      mobileSlide.innerHTML = `
        <div class="container flex-center-v">
          <div class="sec-contact-form-slide__stage"></div>
        </div>
      `;
    }

    const isMobile = window.innerWidth <= 1024;
    if (isMobile) {
      if (mobileSlide.parentNode !== wrapper) {
        wrapper.insertBefore(mobileSlide, sec3);
      }
      const formContainer = mobileSlide.querySelector(
        ".sec-contact-form-slide__stage",
      );
      if (formBox.parentNode !== formContainer) {
        formContainer.appendChild(formBox);
      }
      sec1.id = "contact-intro";
      mobileSlide.id = "contact-form";
      sec1.setAttribute("data-section-index", "0");
      mobileSlide.setAttribute("data-section-index", "1");
      sec3.setAttribute("data-section-index", "2");
    } else {
      if (formBox.parentNode !== stage) {
        stage.insertBefore(formBox, placeholder);
      }
      if (mobileSlide.parentNode === wrapper) {
        mobileSlide.remove();
      }
      sec1.id = "contact-form";
      sec1.setAttribute("data-section-index", "0");
      sec3.setAttribute("data-section-index", "1");
    }
  }

  setupContactMobileSlides();

  let domSlides = Array.from(
    document.querySelectorAll(".main-swiper .swiper-slide"),
  );
  let sectionIds = domSlides.map(
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

  let swiper = null;
  if (swiperEl) {
    swiper = new Swiper(".main-swiper", {
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

          const currentSlide = this.slides[this.activeIndex];
          if (currentSlide && !currentSlide.classList.contains("slide-animated")) {
            currentSlide.classList.add("slide-animated");
            triggerCounterAnimations(currentSlide);
          }
        },
      },
    });

    setupScrollDownButtons();

    if (isContactPage) {
      const mql = window.matchMedia("(max-width: 1024px)");
      mql.addEventListener("change", () => {
        setupContactMobileSlides();
        domSlides = Array.from(
          document.querySelectorAll(".main-swiper .swiper-slide"),
        );
        sectionIds = domSlides.map(
          (slide, idx) => slide.id || `section-${idx + 1}`,
        );
        if (swiper) {
          swiper.update();
          setupScrollDownButtons();
          updateHeaderTheme(swiper.activeIndex);
        }
      });
    }
  }

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

  function isCurrentSlideDark(index) {
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
        activeSlide.classList.contains("sec-services-bg-dark") ||
        activeSlide.classList.contains("sec-contact-form")
      ) {
        return true;
      } else if (
        activeSlide.classList.contains("sec-about-bg-light") ||
        activeSlide.classList.contains("sec-phase0-bg-light") ||
        activeSlide.classList.contains("sec-thirdeye-bg-light") ||
        activeSlide.classList.contains("sec-market-bg-light") ||
        activeSlide.classList.contains("sec-operational-bg-light") ||
        activeSlide.classList.contains("sec-digital-bg-light") ||
        activeSlide.classList.contains("sec-capacity-bg-light") ||
        activeSlide.classList.contains("sec-contact-bg-light") ||
        activeSlide.classList.contains("sec-contact-form-slide") ||
        activeSlide.classList.contains("sec-services-bg-light")
      ) {
        return false;
      }
    }

    const isLightBg = [1, 3, 5, 7, 9, 10, 11].includes(index);
    return !isLightBg;
  }

  function updateHeaderTheme(index) {
    if (!mainHeader) return;
    const isDark = isCurrentSlideDark(index);
    mainHeader.classList.toggle("light-theme", isDark);
  }

  function setupScrollDownButtons() {
    if (!swiper || !domSlides || domSlides.length <= 1) return;

    domSlides.forEach((slide, idx) => {
      const isFooter =
        idx >= domSlides.length - 1 ||
        slide.hasAttribute("data-shared-footer") ||
        slide.classList.contains("sec-10");

      if (isFooter) {
        const existingBtn = slide.querySelector(".scroll-down-btn");
        if (existingBtn) existingBtn.remove();
        return;
      }

      let btn = slide.querySelector(".scroll-down-btn");
      if (!btn) {
        btn = document.createElement("button");
        btn.className = "scroll-down-btn";
        btn.setAttribute("aria-label", `Scroll to section ${idx + 2}`);
        btn.innerHTML = `
          <span class="scroll-down-icon">
            <svg width="12" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
              <path d="M7.41 14.59L12 19.17l4.59-4.58L18 16l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
            </svg>
          </span>
        `;
        slide.appendChild(btn);
      }

      const isDark = isCurrentSlideDark(idx);
      if (!isDark) {
        btn.classList.add("scroll-down-btn--dark-text");
      } else {
        btn.classList.remove("scroll-down-btn--dark-text");
      }

      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        smartSlideTo(idx + 1);
      };
    });
  }

  function smartSlideTo(targetIndex) {
    if (!swiper) return;
    if (targetIndex < 0 || targetIndex >= sectionIds.length) return;
    swiper.slideTo(targetIndex, 750);
  }

  const isHomePage =
    !document.body.classList.contains("page-about") &&
    !document.body.classList.contains("page-phase-0") &&
    !document.body.classList.contains("page-phase-0-diagnostic") &&
    !document.body.classList.contains("page-thirdeye") &&
    !document.body.classList.contains("page-market-intelligence") &&
    !document.body.classList.contains("page-operational-intelligence") &&
    !document.body.classList.contains("page-digital-intelligence") &&
    !document.body.classList.contains(
      "page-capacity-capability-intelligence",
    ) &&
    !document.body.classList.contains("page-contact") &&
    !document.body.classList.contains("page-privacy-terms") &&
    !document.body.classList.contains("page-services-overview");

  const allNavLinks = document.querySelectorAll('a[href*="#"]');
  allNavLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href) return;

      if (swiper && href.startsWith("#")) {
        const hash = href.replace("#", "");
        const targetIdx = sectionIds.indexOf(hash);
        if (targetIdx !== -1) {
          e.preventDefault();
          smartSlideTo(targetIdx);
        }
      } else if (swiper && href.startsWith("index.html#") && isHomePage) {
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
    if (!swiper) return;
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
