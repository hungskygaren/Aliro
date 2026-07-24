/**
 * Aliro Consulting - Full-Screen Vertical Swiper Engine
 * Uses GPU Hardware Acceleration for 60fps ultra-smooth vertical sliding.
 */

document.addEventListener("DOMContentLoaded", () => {
  const dotsNav = document.getElementById("dotsNav");
  const dots = document.querySelectorAll(".dot-item");
  const navItems = document.querySelectorAll(".nav-item");
  const scrollDownBtn = document.getElementById("scrollDownBtn");
  const sectionBackgrounds = new WeakMap();
  let clearBackgroundTransition = null;

  document.querySelectorAll(".scroll-section").forEach((section) => {
    sectionBackgrounds.set(section, getComputedStyle(section).backgroundColor);
  });

  function transitionIncomingBackground(swiperInstance, duration) {
    const transitionDuration = Number.isFinite(duration)
      ? duration
      : swiperInstance.params.speed;

    if (transitionDuration <= 0 || !swiperInstance.slides) return;

    if (clearBackgroundTransition) clearBackgroundTransition();

    const outgoingSlide = swiperInstance.slides[swiperInstance.previousIndex];
    const incomingSlide = swiperInstance.slides[swiperInstance.activeIndex];
    const fromBackground = outgoingSlide
      ? getComputedStyle(outgoingSlide).backgroundColor
      : null;
    const toBackground = incomingSlide
      ? sectionBackgrounds.get(incomingSlide)
      : null;

    if (
      !incomingSlide ||
      !fromBackground ||
      !toBackground ||
      fromBackground === toBackground
    ) {
      return;
    }

    const originalBackground = incomingSlide.style.backgroundColor;
    const originalTransition = incomingSlide.style.transition;
    let animationFrameId = null;
    let timeoutId = null;

    const cleanup = () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (timeoutId !== null) clearTimeout(timeoutId);
      incomingSlide.removeEventListener("transitionend", handleTransitionEnd);
      incomingSlide.style.backgroundColor = originalBackground;
      incomingSlide.style.transition = originalTransition;
      if (clearBackgroundTransition === cleanup) {
        clearBackgroundTransition = null;
      }
    };

    const handleTransitionEnd = (event) => {
      if (
        event.target === incomingSlide &&
        event.propertyName === "background-color"
      ) {
        cleanup();
      }
    };

    incomingSlide.style.transition = "none";
    incomingSlide.style.backgroundColor = fromBackground;
    void incomingSlide.offsetWidth;

    incomingSlide.addEventListener("transitionend", handleTransitionEnd);
    animationFrameId = requestAnimationFrame(() => {
      incomingSlide.style.transition =
        "background-color " +
        transitionDuration +
        "ms cubic-bezier(0.16, 1, 0.3, 1)";
      incomingSlide.style.backgroundColor = toBackground;
    });
    timeoutId = setTimeout(cleanup, transitionDuration + 100);
    clearBackgroundTransition = cleanup;
  }

  // 1. Initialize Swiper 11 Vertical Slider Engine
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
      beforeTransitionStart: function (_, duration) {
        transitionIncomingBackground(this, duration);
      },
      init: function () {
        updateActiveState(this.activeIndex);
        if (this.slides && this.slides[this.activeIndex]) {
          this.slides[this.activeIndex].classList.add("slide-animated");
        }
      },
      slideChange: function () {
        updateActiveState(this.activeIndex);
        if (this.slides) {
          this.slides.forEach((slide) =>
            slide.classList.remove("slide-animated"),
          );
          if (this.slides[this.previousIndex]) {
            this.slides[this.previousIndex].classList.add("visited");
          }
        }
      },
      slideChangeTransitionEnd: function () {
        if (this.slides) {
          this.slides.forEach((slide) =>
            slide.classList.remove("slide-animated"),
          );
          if (this.slides[this.activeIndex]) {
            this.slides[this.activeIndex].classList.add("slide-animated");
          }
        }
      },
    },
  });

  // 2. Active State Manager (Sync Side Dash Lines, Navbar, and Contrast Theme)
  function updateActiveState(index) {
    // Light Background Sections (Section 2 = Index 1, Section 3 = Index 2, Section 10 = Index 9)
    const mainHeader = document.getElementById("mainHeader");
    const isLightSection = [1, 2, 9].includes(index);

    if (isLightSection) {
      if (dotsNav) dotsNav.classList.add("light-indicator");
      if (mainHeader) mainHeader.classList.add("light-theme");
    } else {
      if (dotsNav) dotsNav.classList.remove("light-indicator");
      if (mainHeader) mainHeader.classList.remove("light-theme");
    }

    // Update Side Dash Lines
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // Keep 'Home' (#section-1) permanently active as this is the homepage
    const activeNavHref = "#section-1";

    navItems.forEach((navItem) => {
      if (navItem.getAttribute("href") === activeNavHref) {
        navItem.classList.add("active");
      } else {
        navItem.classList.remove("active");
      }
    });
  }

  // 3. Apple-Style Smart Skip Jump Navigation Helper
  function smartSlideTo(targetIndex) {
    if (targetIndex < 0) return;
    const currentIndex = swiper.activeIndex;
    const distance = Math.abs(targetIndex - currentIndex);

    if (distance <= 1) {
      swiper.slideTo(targetIndex, 950);
    } else {
      const preLandingIndex =
        targetIndex > currentIndex ? targetIndex - 1 : targetIndex + 1;
      swiper.slideTo(preLandingIndex, 0);
      requestAnimationFrame(() => {
        setTimeout(() => {
          swiper.slideTo(targetIndex, 950);
        }, 30);
      });
    }
  }

  // 4. Scroll Down Button Action
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      smartSlideTo(1);
    });
  }

  // 5. Side Dash Lines Click Action
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

  // 6. Section Hash Links Click Action (Intercept all #section- links to prevent default jump scroll freeze)
  const hashLinks = document.querySelectorAll('a[href^="#section-"]');
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

  // 7. Section 4 Continuum Satellite Node Buttons Click & Hover Action
  const continuumNodes = document.querySelectorAll(".sec-continuum__node");
  continuumNodes.forEach((node) => {
    const btn = node.querySelector(".node-circle-btn");
    node.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(node.getAttribute("data-slide-target"), 10);
      if (!isNaN(targetIndex)) {
        smartSlideTo(targetIndex);
      }
    });
    // JS-driven hover to bypass Chromium mousewheel pointer-events lock
    if (btn) {
      node.addEventListener("mouseenter", () =>
        btn.classList.add("is-hovered"),
      );
      node.addEventListener("mouseleave", () =>
        btn.classList.remove("is-hovered"),
      );
    }
  });

  // 8. Return to 4IC Button Click Action (Sections 5, 6, 7, 8)
  const return4icBtns = document.querySelectorAll(".btn-return-4ic");
  return4icBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetIndex = parseInt(btn.getAttribute("data-slide-target"), 10);
      smartSlideTo(!isNaN(targetIndex) ? targetIndex : 3);
    });
  });
});
