// -----------------------------
// 1. Generic Swipers (with attributes)
// -----------------------------
function initGenericSwipers() {
  document
    .querySelectorAll("[swiper-component] .swiper")
    .forEach((swiperEl) => {
      const getAttr = (name, fallback = null) =>
        swiperEl.getAttribute(name) ?? fallback;

      const slidesPerViewAttr = getAttr("swiper-slidesperview", "1");
      const slidesPerView =
        slidesPerViewAttr === "auto" ? "auto" : parseFloat(slidesPerViewAttr);

      const options = {
        slidesPerView,
        spaceBetween: parseFloat(getAttr("swiper-spacebetween", "0")),
        centeredSlides: getAttr("swiper-centeredslides") === "true",
        allowTouchMove: swiperEl.hasAttribute("swiper-allowtouch"),
        loop: getAttr("swiper-loop") === "true",
        speed: parseInt(getAttr("swiper-speed", "300")),
        keyboard: { enabled: getAttr("swiper-keyboard") === "true" },
        autoplay:
          getAttr("swiper-autplay") === "true"
            ? {
                delay: parseInt(getAttr("swiper-autplayduration", "3000")),
                disableOnInteraction: false,
              }
            : false,
      };

      // Add navigation if elements exist
      const nextEl = swiperEl.parentElement.querySelector(
        '[data-swiper-button="next"]'
      );
      const prevEl = swiperEl.parentElement.querySelector(
        '[data-swiper-button="prev"]'
      );
      if (nextEl || prevEl) {
        options.navigation = { nextEl, prevEl };
      }

      // Add pagination if element exists
      const paginationEl = swiperEl.parentElement.querySelector(
        "[swiper-pagination]"
      );
      if (paginationEl) {
        options.pagination = {
          el: paginationEl,
          clickable: true,
        };
      }

      // Initialize Swiper
      const swiperInstance = new Swiper(swiperEl, options);

      // Pause autoplay when out of view
      if (options.autoplay) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                swiperInstance.autoplay.start();
              } else {
                swiperInstance.autoplay.stop();
              }
            });
          },
          { threshold: 0.25 }
        );
        observer.observe(swiperEl);
      }
    });
}

// -----------------------------
// 2. CTA Slider
// -----------------------------
function initCTASlider() {
  const swiperElement = document.querySelector(".cta_slider.swiper");
  const buttons = document.querySelectorAll(".cta_slider_menu_button");

  if (!swiperElement || buttons.length === 0) return;

  const updateActiveButton = (activeIndex) => {
    buttons.forEach((btn, idx) =>
      btn.classList.toggle("is-active", idx === activeIndex)
    );
  };

  const ctaSwiper = new Swiper(swiperElement, {
    effect: "fade",
    fadeEffect: { crossFade: true },
    speed: 1000,
    navigation: {
      nextEl: "[cta-swiper='next']",
      prevEl: "[cta-swiper='prev']",
    },
    keyboard: { enabled: true, onlyInViewport: true },
    on: {
      slideChange() {
        updateActiveButton(this.activeIndex);
      },
      init() {
        updateActiveButton(this.activeIndex);
      },
    },
  });

  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (button.classList.contains("is-active")) return;
      ctaSwiper.slideTo(index);
      updateActiveButton(index);
    });

    button.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        button.click();
      }
    });
  });

  updateActiveButton(0);
}

// -----------------------------
// 4. Year Span
// -----------------------------
function initYearSpans() {
  const yearSpans = document.querySelectorAll(".year_span");
  const currentYear = new Date().getFullYear();
  yearSpans.forEach((span) => (span.textContent = currentYear));
}

// -----------------------------
// 5. Navigation Dropdown (GSAP)
// -----------------------------
function initNavMenu() {
  // Nav Menu
  // Grab elements
  let menuLink = $(".nav_menu_item");
  let content = $(".nav_dropdown_content");
  let menuBG = $(".nav_menu_bg");
  let dropdownWrap = $(".nav_menu_content");
  let menuArrow = $(".nav_menu_arrow");

  console.log("menuLink start running 223...", menuLink);

  // GSAP default settings
  gsap.defaults({
    duration: 0.3,
    ease: "cubic-bezier(0.47, 0, 0.23, 1.38)",
  });

  // Reveal dropdown (first open)
  function revealDropdown(currentLink, currentContent) {
    dropdownWrap.css("display", "flex");

    // Position arrow under link
    gsap.set(menuArrow, {
      width: currentLink.outerWidth(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Position and size background
    gsap.set(menuBG, {
      width: currentContent.outerWidth(),
      height: currentContent.outerHeight(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Reset all content
    gsap.set(content, { opacity: 0 });

    // Show active content
    gsap.set(currentContent, {
      opacity: 1,
      x: "0rem",
    });
  }

  // Switch dropdown (between links)
  function switchDropdown(currentLink, previousContent, currentContent) {
    // Animate arrow
    gsap.to(menuArrow, {
      width: currentLink.outerWidth(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Animate background
    gsap.to(menuBG, {
      width: currentContent.outerWidth(),
      height: currentContent.outerHeight(),
      x: currentLink.offset().left - dropdownWrap.offset().left,
    });

    // Slide direction logic
    let moveDistance = 2; // slide amount in rem
    if (currentContent.index() < previousContent.index()) {
      moveDistance = -moveDistance;
    }

    // Animate previous content out
    gsap.fromTo(
      previousContent,
      { opacity: 1, x: "0rem" },
      { opacity: 0, x: moveDistance * -1 + "rem", duration: 0.2 }
    );

    // Animate new content in
    gsap.fromTo(
      currentContent,
      { opacity: 0, x: moveDistance + "rem" },
      { opacity: 1, x: "0rem", duration: 0.2 }
    );
  }

  // Dropdown open/close timeline
  let showDropdown = gsap.timeline({
    paused: true,
    onReverseComplete: () => {
      dropdownWrap.css("display", "none");
      menuLink.removeClass("active");
    },
  });

  // Animation when showing dropdown
  showDropdown
    .from(dropdownWrap, { opacity: 0, rotateX: -10, duration: 0.2 })
    .to(menuArrow, { opacity: 1, duration: 0.2 }, "<");

  // Link hover in
  menuLink.on("mouseenter", function () {
    let previousLink = menuLink.filter(".active").removeClass("active");
    let currentLink = $(this).addClass("active");

    let previousContent = content.filter(".active").removeClass("active");
    let currentContent = content.eq($(this).index()).addClass("active");

    showDropdown.play();

    if (previousLink.length === 0) {
      revealDropdown(currentLink, currentContent);
    } else if (previousLink.index() !== currentLink.index()) {
      switchDropdown(currentLink, previousContent, currentContent);
    }
  });

  // Menu hover out (close dropdown)
  $(".nav_menu_wrapper").on("mouseleave", function () {
    showDropdown.reverse();
  });

  // Sub-link hover effect (dim siblings)
  $(".menu_dropdown_link").on("mouseenter mouseleave", function () {
    $(this).siblings(".menu_dropdown_link").toggleClass("low-opacity");
  });
}

// -----------------------------
// 6. Scroll Fade Text
// -----------------------------
function initScrollFadeText() {
  document.querySelectorAll("[scroll-fade-text]").forEach((element) => {
    const split = new SplitText(element, {
      type: "words, lines, chars",
      linesClass: "line++",
    });

    const scrollConfig = {
      trigger: element,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      toggleActions: "play play reverse reverse",
    };

    gsap.fromTo(
      split.chars,
      { opacity: 0.4 },
      { opacity: 1, duration: 0.3, stagger: 0.02, scrollTrigger: scrollConfig }
    );

    gsap.fromTo(
      split.chars,
      { color: "hsla(0, 0%, 100%, 0.5)" },
      {
        color: "hsla(0, 0%, 100%, 1)",
        duration: 0.3,
        stagger: 0.02,
        scrollTrigger: scrollConfig,
      }
    );
  });
}

// -----------------------------
// 7. vertical Tabs Accordion
// -----------------------------
function initVerticalTabs() {
  document
    .querySelectorAll('[vertical-tabs-element="section"]')
    .forEach((element) => {
      if (element.dataset.scriptInitialized) return;
      element.dataset.scriptInitialized = "true";

      document
        .querySelectorAll('[vertical-tabs-element="wrapper"]')
        .forEach((wrapper) => {
          const tabsVisualSwiper = new Swiper(
            wrapper.querySelector("[swiper-component]"),
            {
              slidesPerView: 1,
              loop: true,
              speed: 600,
              allowTouchMove: false,
              effect: "fade",
              fadeEffect: { crossFade: true },
            }
          );

          const accordions = wrapper.querySelectorAll(
            '[vertical-tabs-element="accordion"]'
          );
          if (accordions.length > 0) {
            accordions.forEach((acc, i) =>
              acc.classList.toggle("is-opened", i === 0)
            );
            tabsVisualSwiper.slideToLoop(0);
          }

          accordions.forEach((accordion, index) => {
            const btn = accordion.querySelector("button");
            if (!btn) return;
            btn.addEventListener("click", () => {
              const isOpen = accordion.classList.contains("is-opened");
              accordions.forEach((acc) => acc.classList.remove("is-opened"));
              if (!isOpen) {
                accordion.classList.add("is-opened");
                tabsVisualSwiper.slideToLoop(index);
              }
            });
          });
        });
    });
}

// -----------------------------
// INIT: Run everything on DOMContentLoaded
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  initGenericSwipers();
  initCTASlider();
  // initHeroSliders();
  initYearSpans();
  initNavMenu();
  initScrollFadeText();
  initVerticalTabs();
});

document.addEventListener("DOMContentLoaded", function () {
  $('[data-scroll-spli-el="section"]').each(function () {
    const texts = $(this).find('[data-scroll-spli-el="text"]');
    const images = $(this).find('[data-scroll-spli-el="image"]');
    let triggers = [];
    let isInitializing = false;

    // Set initial GSAP styles for images
    gsap.set(images, { opacity: 0 });

    function activate(index) {
      if (index >= 0 && index < texts.length && !isInitializing) {
        // Remove active class from all
        texts.removeClass("is-active");
        images.removeClass("is-active");

        // Add active class to current
        texts.eq(index).addClass("is-active");
        images.eq(index).addClass("is-active");

        // GSAP opacity animation
        gsap.to(images.not(images.eq(index)), {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
        gsap.to(images.eq(index), {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }

    function initTriggers() {
      if (isInitializing) return;
      isInitializing = true;

      // Clean old triggers
      triggers.forEach((t) => t.kill());
      triggers = [];

      texts.each(function (i) {
        const trig = ScrollTrigger.create({
          trigger: this,
          start: "top center",
          end: "bottom center",
          onToggle: ({ isActive }) => {
            if (isActive) {
              activate(i);
            }
          },
          // Add some performance optimizations
          invalidateOnRefresh: false,
          refreshPriority: -1,
        });
        triggers.push(trig);
      });

      isInitializing = false;
    }

    // Initialize first item
    activate(0);
    initTriggers();

    // Much more conservative MutationObserver
    let reinitTimeout;
    const debouncedReinit = () => {
      clearTimeout(reinitTimeout);
      reinitTimeout = setTimeout(() => {
        if (!isInitializing) {
          initTriggers();
        }
      }, 250); // Longer debounce
    };

    // Only observe critical changes
    const observer = new MutationObserver((mutations) => {
      const relevantChange = mutations.some((mutation) => {
        // Only reinit if elements with our data attributes are added/removed
        if (mutation.type === "childList") {
          const addedNodes = Array.from(mutation.addedNodes).filter(
            (node) =>
              node.nodeType === 1 &&
              (node.hasAttribute?.("data-scroll-spli-el") ||
                node.querySelector?.("[data-scroll-spli-el]"))
          );
          const removedNodes = Array.from(mutation.removedNodes).filter(
            (node) =>
              node.nodeType === 1 &&
              (node.hasAttribute?.("data-scroll-spli-el") ||
                node.querySelector?.("[data-scroll-spli-el]"))
          );
          return addedNodes.length > 0 || removedNodes.length > 0;
        }
        return false;
      });

      if (relevantChange) {
        debouncedReinit();
      }
    });

    observer.observe(this, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    $(window).on("beforeunload", () => {
      clearTimeout(reinitTimeout);
      observer.disconnect();
      triggers.forEach((t) => t.kill());
      gsap.killTweensOf(images);
    });
  });
});

document.querySelectorAll("[data-marquee]").forEach((marquee) => {
  const inner = marquee.querySelector("[data-marquee-inner]");
  const duration =
    parseFloat(marquee.getAttribute("data-marquee-duration")) || 12;

  // Clone all item elements to create seamless loop
  const items = inner.querySelectorAll("[data-marquee-item]");
  items.forEach((item) => {
    inner.append(item.cloneNode(true));
  });

  const animations = [];
  inner.querySelectorAll("[data-marquee-item]").forEach((item) => {
    const animation = gsap.to(item, {
      y: "-100%",
      repeat: -1,
      duration: duration,
      ease: "linear",
    });
    animations.push(animation);
  });

  marquee.addEventListener("mouseenter", () => {
    animations.forEach((anim) => anim.pause());
  });

  marquee.addEventListener("mouseleave", () => {
    animations.forEach((anim) => anim.play());
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const words = document.querySelectorAll(
    ".careers_stats_heading_rotate > span"
  );

  let main = new TimelineMax({ repeat: -1 });

  for (let i = 0; i < words.length; i++) {
    let delay = i - 1;
    let wordTL = new TimelineMax();
    if (i !== 0) {
      wordTL.from(words[i], 1, { y: "-100%", opacity: 0 });
    }

    if (i !== words.length - 1) {
      wordTL.to(words[i], 1, { y: "100%", opacity: 0 });
    }
    main.add(wordTL, delay);
  }

  gsap.fromTo(
    ".careers_hero_img",
    { width: "100%" },
    {
      width: "100vw", // target
      ease: "none", // tied directly to scroll
      scrollTrigger: {
        trigger: ".careers_hero_section", // section to watch
        start: "top top", // when top of element hits top of viewport
        end: "bottom bottom", // when bottom of element reaches bottom of viewport
        scrub: true, // link to scroll
      },
    }
  );

  gsap.fromTo(
    "[data-animate-opacity]",
    { opacity: 0 },
    {
      opacity: 1, // target
      ease: "none", // smooth, tied to scroll
      scrollTrigger: {
        trigger: ".careers_cta_track", // section to watch
        start: "top top", // when top of element hits top of viewport
        end: "70% bottom", // when bottom of element reaches top of viewport
        scrub: true, // link to scroll
      },
    }
  );
});

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(TextPlugin);

  // Grab the element and words from its attribute
  const textEl = document.querySelector('[data-typewritter="text"]');
  const wordsAttr = textEl.getAttribute("data-typewritter-words") || "";
  const words = wordsAttr
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

  // Cursor blink
  gsap.to('[data-typewritter="cursor"]', {
    opacity: 0,
    repeat: -1,
    yoyo: true,
    duration: 0.5,
    ease: "power2.inOut",
  });

  // Master timeline
  let tlMaster = gsap.timeline({ repeat: -1 });

  words.forEach((word) => {
    let tlText = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1 });
    tlText.to(textEl, { duration: 1, text: word });
    tlMaster.add(tlText);
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const images = document.querySelectorAll(
//     '[data-paralax-img="1"], [data-paralax-img="2"], [data-paralax-img="3"], [data-paralax-img="4"], [data-paralax-img="5"]'
//   );

//   const zStart = -200;
//   const zEndBase = 300;
//   const zOffset = 10;
//   const fadeRange = 10;

//   images.forEach((img, i) => {
//     const startTop = parseFloat(img.dataset.gsapStartTop) || 0;
//     const zEnd = zEndBase + i * zOffset;

//     gsap.fromTo(
//       img,
//       { z: `${zStart}dvh` },
//       {
//         z: `${zEnd}dvh`,
//         scrollTrigger: {
//           trigger: ".partners_track",
//           start: `${startTop}% top`,
//           end: "bottom bottom",
//           scrub: true,
//         },
//       }
//     );

//     gsap.fromTo(
//       img,
//       { opacity: 0 },
//       {
//         opacity: 1,
//         scrollTrigger: {
//           trigger: ".partners_track",
//           start: `${startTop}% top`,
//           end: `${startTop + fadeRange}% top`,
//           scrub: true,
//         },
//       }
//     );
//   });
// });

// gsap.fromTo(
//   ".partners_bg",
//   { opacity: 0 },
//   {
//     opacity: 1,
//     scrollTrigger: {
//       trigger: ".partners_track",
//       start: "top top",
//       end: "10% top",
//       scrub: true,
//     },
//   }
// );

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.querySelector('[data-instalment-price="total"]');

  const plan3 = document.querySelector('[plantype="MONTHS_3"]');
  const plan6 = document.querySelector('[plantype="MONTHS_6"]');
  const plan12 = document.querySelector('[plantype="MONTHS_12"]');

  async function fetchPlans(amount) {
    const url = `https://reno-core-api-test.azurewebsites.net/api/v2/payment-plan/view?amount=${amount}&projectPaymentType=RNPL`;

    try {
      console.log("ðŸŒ Fetching plans:", url);
      const res = await fetch(url);
      console.log("ðŸ”„ API status:", res.status);

      if (!res.ok) throw new Error("API error: " + res.status);

      const data = await res.json();
      console.log("âœ… API response:", data);

      // Helper: extract first INSTALLMENT amount
      const getMonthlyPayment = (planType) => {
        const plan = data.find((p) => p.planType === planType);
        if (!plan) return "â€”";
        const installment = plan.paymentSchedule.find(
          (s) => s.type === "INSTALLMENT"
        );
        return installment ? installment.amount : "â€”";
      };

      plan3.textContent = getMonthlyPayment("MONTHS_3");
      plan6.textContent = getMonthlyPayment("MONTHS_6");
      plan12.textContent = getMonthlyPayment("MONTHS_12");

      console.log("ðŸŽ¯ Updated UI:", {
        months3: plan3.textContent,
        months6: plan6.textContent,
        months12: plan12.textContent,
      });
    } catch (err) {
      console.error("âŒ Failed to fetch payment plans:", err);
    }
  }

  inputField.addEventListener("input", (e) => {
    const amount = parseInt(e.target.value, 10);
    if (!isNaN(amount)) {
      console.log("ðŸ‘€ Input changed:", amount);
      fetchPlans(amount);
    }
  });

  const initialAmount = parseInt(inputField.value, 10);
  if (!isNaN(initialAmount)) {
    fetchPlans(initialAmount);
  }
});

const portfolioSwiper = new Swiper("[data-portfolio-carousal]", {
  grabCursor: true,
  watchSlidesProgress: true,
  loop: true,
  speed: 400,
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
  slidesPerView: "auto",
  centeredSlides: true,
  slideToClickedSlide: true,

  // Breakpoints for spacing
  breakpoints: {
    0: {
      spaceBetween: 10, // Mobile â‰¤ 767px
    },
    768: {
      spaceBetween: 0, // Desktop â‰¥ 768px
    },
  },

  on: {
    progress(portfolioSwiper) {
      // Only run scaling if screen is wider than 767px
      if (window.innerWidth <= 767) {
        // Reset transform/opacity/zIndex on mobile
        for (let i = 0; i < portfolioSwiper.slides.length; i++) {
          portfolioSwiper.slides[i].style.transform = "";
          portfolioSwiper.slides[i].style.opacity = "";
          portfolioSwiper.slides[i].style.zIndex = "";
        }
        return;
      }

      const scaleStep = 0.25;
      const zIndexMax = portfolioSwiper.slides.length;
      for (let i = 0; i < portfolioSwiper.slides.length; i += 1) {
        const slideEl = portfolioSwiper.slides[i];
        const slideProgress = portfolioSwiper.slides[i].progress;
        const absProgress = Math.abs(slideProgress);

        let modify = 1;
        if (absProgress > 1) {
          modify = (absProgress - 1) * 0.2 + 1;
        }

        const translate = `${slideProgress * modify * 0}%`;
        const scale = 1 - absProgress * scaleStep;
        const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));

        slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
        slideEl.style.zIndex = zIndex;
        slideEl.style.opacity = absProgress > 2.9 ? 0 : 1;
      }
    },

    setTransition(portfolioSwiper, duration) {
      for (let i = 0; i < portfolioSwiper.slides.length; i++) {
        portfolioSwiper.slides[i].style.transitionDuration = `${duration}ms`;
      }
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const moveDuration = 0.6; // seconds
  const pauseDuration = 2; // seconds
  const easeType = "power2.inOut";
  const target = "[data-text-rotate-span]";

  const tl = gsap.timeline({ repeat: -1, yoyo: true });

  tl.to({}, { duration: pauseDuration })

    .to(target, {
      y: "-2em",
      duration: moveDuration,
      ease: easeType,
      onStart: () => {
        const element = document.querySelector(target);
        element?.classList.remove("step-1", "step-2");
        element?.classList.add("step-1");
      },
    })
    .to({}, { duration: pauseDuration })

    .to(target, {
      y: "-3em",
      duration: moveDuration,
      ease: easeType,
      onStart: () => {
        const element = document.querySelector(target);
        element?.classList.remove("step-1", "step-2");
        element?.classList.add("step-2");
      },
    })
    .to({}, { duration: pauseDuration });
});

// porfolio Swiper
document.addEventListener("DOMContentLoaded", () => {
  // Check if mobile
  const isMobile = window.innerWidth < 768;
  console.log("Is Mobile:", isMobile);

  let portfolioParrentGallery;
  let childGalleries = [];
  let totalSlides = 0;
  let slideOffsets = [];
  let allSlides = []; // Store all slides with their category info

  const totalDisplay = document.querySelector("[data-portfolio-total]");
  const currentDisplay = document.querySelector("[data-portfolio-current]");
  const nextButton = document.querySelector("[data-swiper-next]");
  const prevButton = document.querySelector("[data-swiper-prev]");

  if (isMobile) {
    // MOBILE: Create one continuous swiper by collecting all child slides
    const parentWrapper = document.querySelector(
      '[data-portfolio-slider="parent"]'
    );
    const parentSlides = parentWrapper.querySelectorAll(
      "[data-portfolio-slide]"
    );

    console.log("Parent slides found:", parentSlides.length);

    // Collect all slides with their category information
    parentSlides.forEach((parentSlide) => {
      const category = parentSlide.getAttribute("data-portfolio-category");
      const childSlides = parentSlide.querySelectorAll(
        ".portfolio_slider_slide"
      );

      console.log(`Category: ${category}, Child slides: ${childSlides.length}`);

      childSlides.forEach((slide) => {
        allSlides.push({
          element: slide.cloneNode(true),
          category: category,
        });
      });
    });

    console.log("Total slides collected:", allSlides.length);

    // Clear parent wrapper and add all slides
    const swiperWrapper = parentWrapper.querySelector(
      ".portfolio_slider_parrent_wrapper"
    );
    swiperWrapper.innerHTML = "";

    allSlides.forEach((slideData) => {
      const slideElement = slideData.element;
      slideElement.setAttribute("data-slide-category", slideData.category);
      swiperWrapper.appendChild(slideElement);
    });

    // Initialize single continuous swiper
    portfolioParrentGallery = new Swiper('[data-portfolio-slider="parent"]', {
      speed: 700,
      spaceBetween: 16,
      effect: "slide",
      allowTouchMove: true,
      slidesPerView: 1,
    });

    totalSlides = allSlides.length;
    if (totalDisplay) totalDisplay.textContent = totalSlides;

    // Update slide numbers
    function updateSlideNumbers() {
      const currentSlideNumber = portfolioParrentGallery.activeIndex + 1;
      if (currentDisplay) currentDisplay.textContent = currentSlideNumber;
    }

    // Navigation
    nextButton.addEventListener("click", () => {
      portfolioParrentGallery.slideNext();
    });

    prevButton.addEventListener("click", () => {
      portfolioParrentGallery.slidePrev();
    });

    function updateNavigationState() {
      prevButton.disabled = portfolioParrentGallery.isBeginning;
      nextButton.disabled = portfolioParrentGallery.isEnd;
      updateSlideNumbers();
    }

    portfolioParrentGallery.on("slideChange", updateNavigationState);
    updateNavigationState();
  } else {
    // DESKTOP: Original nested swiper logic
    portfolioParrentGallery = new Swiper('[data-portfolio-slider="parent"]', {
      speed: 700,
      spaceBetween: 0,
      effect: "fade",
      fadeEffect: { crossFade: true },
      allowTouchMove: false,
    });

    // Initialize all child swipers inside parent slides
    document
      .querySelectorAll('[data-portfolio-slider="child"]')
      .forEach((el) => {
        const childSwiper = new Swiper(el, {
          speed: 700,
          spaceBetween: 0,
          effect: "fade",
          fadeEffect: { crossFade: true },
        });

        slideOffsets.push(totalSlides);
        totalSlides += childSwiper.slides.length;
        childGalleries.push(childSwiper);
      });

    if (totalDisplay) totalDisplay.textContent = totalSlides;

    function updateSlideNumbers() {
      const parentIndex = portfolioParrentGallery.activeIndex;
      const activeChild = childGalleries[parentIndex];
      const childIndex = activeChild.activeIndex;
      const currentSlideNumber = slideOffsets[parentIndex] + childIndex + 1;
      if (currentDisplay) currentDisplay.textContent = currentSlideNumber;
    }

    nextButton.addEventListener("click", () => {
      const parentIndex = portfolioParrentGallery.activeIndex;
      const activeChild = childGalleries[parentIndex];

      if (activeChild.isEnd) {
        if (!portfolioParrentGallery.isEnd) {
          portfolioParrentGallery.slideNext();
          const nextChild = childGalleries[parentIndex + 1];
          if (nextChild) nextChild.slideTo(0, 0);
        }
      } else {
        activeChild.slideNext();
      }
    });

    prevButton.addEventListener("click", () => {
      const parentIndex = portfolioParrentGallery.activeIndex;
      const activeChild = childGalleries[parentIndex];

      if (activeChild.isBeginning) {
        if (!portfolioParrentGallery.isBeginning) {
          portfolioParrentGallery.slidePrev();
          const prevChild = childGalleries[parentIndex - 1];
          if (prevChild) prevChild.slideTo(prevChild.slides.length - 1, 0);
        }
      } else {
        activeChild.slidePrev();
      }
    });

    function updateNavigationState() {
      const parentIndex = portfolioParrentGallery.activeIndex;
      const activeChild = childGalleries[parentIndex];
      prevButton.disabled =
        portfolioParrentGallery.isBeginning && activeChild.isBeginning;
      nextButton.disabled = portfolioParrentGallery.isEnd && activeChild.isEnd;
      updateSlideNumbers();
    }

    portfolioParrentGallery.on("slideChange", updateNavigationState);
    childGalleries.forEach((gallery) =>
      gallery.on("slideChange", updateNavigationState)
    );

    updateNavigationState();
  }

  // --- CATEGORY THUMB SWIPER (SAME ACROSS ALL BREAKPOINTS) ---
  const categorySwiper = new Swiper('[data-portfolio-slider="category"]', {
    slidesPerView: "auto",
    spaceBetween: 30,
    speed: 400,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
  });

  setTimeout(() => {
    console.log("Updating category swiper");
    categorySwiper.update();
  }, 2000);

  console.log("Category swiper initialized:", categorySwiper);
  console.log("Category slides:", categorySwiper.slides.length);

  // --- SYNC LOGIC (THUMBS BEHAVIOR) ---
  let syncing = false;

  // Function to update category thumb active state
  function updateCategoryThumbActive(categoryValue) {
    console.log("updateCategoryThumbActive called with:", categoryValue);

    // If no category provided, get it from current slide
    if (!categoryValue) {
      if (isMobile) {
        const activeSlide =
          portfolioParrentGallery.slides[portfolioParrentGallery.activeIndex];
        categoryValue = activeSlide.getAttribute("data-slide-category");
        console.log("Mobile - got category from slide:", categoryValue);
      } else {
        const activeParentSlide =
          portfolioParrentGallery.slides[portfolioParrentGallery.activeIndex];
        categoryValue = activeParentSlide.getAttribute(
          "data-portfolio-category"
        );
        console.log("Desktop - got category from parent:", categoryValue);
      }
    }

    // Remove both thumb-active and custom active class from all category slides
    categorySwiper.slides.forEach((slide) => {
      slide.classList.remove("swiper-slide-thumb-active");
      slide.classList.remove("is-active-category");
    });

    // Find matching category slide and add both classes
    const matchingCatIndex = Array.from(categorySwiper.slides).findIndex(
      (slide) => {
        const slideCategory = slide.getAttribute("portfolio-category");
        console.log(
          "Checking slide category:",
          slideCategory,
          "against:",
          categoryValue
        );
        return slideCategory === categoryValue;
      }
    );

    console.log("Matching category index:", matchingCatIndex);

    if (matchingCatIndex !== -1) {
      categorySwiper.slides[matchingCatIndex].classList.add(
        "swiper-slide-thumb-active"
      );
      categorySwiper.slides[matchingCatIndex].classList.add(
        "is-active-category"
      );
      // Scroll the category into view
      categorySwiper.slideTo(matchingCatIndex);
      console.log("Updated category to index:", matchingCatIndex);
    }
  }

  // Category click behavior
  categorySwiper.on("click", (swiper) => {
    console.log("Category clicked, clickedIndex:", swiper.clickedIndex);

    if (syncing) {
      console.log("Syncing in progress, ignoring click");
      return;
    }

    const clickedSlide = swiper.slides[swiper.clickedIndex];
    if (!clickedSlide) {
      console.log("No clicked slide found");
      return;
    }

    const categoryValue = clickedSlide.getAttribute("portfolio-category");
    console.log("Clicked category:", categoryValue);

    if (isMobile) {
      // Mobile: Find first slide with this category
      const currentSlide =
        portfolioParrentGallery.slides[portfolioParrentGallery.activeIndex];
      const currentCategory = currentSlide.getAttribute("data-slide-category");

      console.log("Current category:", currentCategory);

      // Don't do anything if clicking on already active category
      if (categoryValue === currentCategory) {
        console.log("Already on this category, ignoring");
        return;
      }

      const targetSlideIndex = allSlides.findIndex(
        (slideData) => slideData.category === categoryValue
      );

      console.log("Target slide index:", targetSlideIndex);

      if (targetSlideIndex !== -1) {
        syncing = true;
        portfolioParrentGallery.slideTo(targetSlideIndex);

        setTimeout(() => {
          updateCategoryThumbActive(categoryValue);
          syncing = false;
        }, 50);
      }
    } else {
      // Desktop: Original logic
      const currentParentSlide =
        portfolioParrentGallery.slides[portfolioParrentGallery.activeIndex];
      const currentCategory = currentParentSlide.getAttribute(
        "data-portfolio-category"
      );

      if (categoryValue === currentCategory) return;

      syncing = true;

      const matchingParentIndex = Array.from(
        portfolioParrentGallery.slides
      ).findIndex(
        (slide) =>
          slide.getAttribute("data-portfolio-category") === categoryValue
      );

      if (matchingParentIndex !== -1) {
        portfolioParrentGallery.slideTo(matchingParentIndex);

        const matchingChildGallery = childGalleries[matchingParentIndex];
        if (matchingChildGallery) {
          matchingChildGallery.slideTo(0, 0);
        }

        setTimeout(() => {
          updateCategoryThumbActive();
          syncing = false;
        }, 50);
      } else {
        syncing = false;
      }
    }
  });

  // Parent slideChange â†’ update category thumb active state
  portfolioParrentGallery.on("slideChange", () => {
    console.log("Slide changed to:", portfolioParrentGallery.activeIndex);

    if (syncing) {
      console.log("Syncing, skipping category update");
      return;
    }
    syncing = true;
    updateCategoryThumbActive();
    syncing = false;
  });

  // Set initial active category thumb on load
  setTimeout(() => {
    console.log("Setting initial category");
    updateCategoryThumbActive();
  }, 100);
});

function pCarouselSwiper() {
  console.log("pCarouselSwiper new1 running change...");
  const slider = document.querySelector(
    "[data-portfolio-slider].p-carousal_wrap"
  );
  if (!slider) return;

  const pCarouselSwiper = new Swiper(slider, {
    slidesPerView: 1,
    spaceBetween: 16,
    centeredSlides: true,
    initialSlide: 1,
    loop: false,
    navigation: {
      nextEl: slider.querySelector(".swiper-button-next"),
      prevEl: slider.querySelector(".swiper-button-prev"),
    },
    pagination: {
      el: slider.querySelector(".swiper-pagination"),
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 2.7,
        spaceBetween: 0,
      },
    },
  });

  // Default to "commercial" filter on load, set "active" class
  function setActiveFilterTab(filterValue) {
    document.querySelectorAll("[data-filter]").forEach((tab) => {
      console.log("tab filter", tab);
      if (tab.dataset.filter === filterValue) {
        tab.classList.add("active");
        tab.querySelector(".form_main_radio_input").checked = true;
      } else {
        tab.classList.remove("active");
        tab.querySelector(".form_main_radio_input").checked = false;
      }
    });
  }

  function filterSlides(filter) {
    document.querySelectorAll(".p-carousal_slide").forEach((slide) => {
      slide.style.display =
        slide.dataset.category === filter ? "block" : "none";
    });
    pCarouselSwiper.update();
    pCarouselSwiper.slideTo(1);
  }

  // On load: set "commercial" as default filter and activate tab
  const defaultFilter = "Comercial";
  console.log("slider", slider, slider.getAttribute("data-no-filter"));
  if (!slider.getAttribute("data-no-filter")) {
    setActiveFilterTab(defaultFilter);
    filterSlides(defaultFilter);
  }

  // Tab click event
  document.querySelectorAll("[data-filter]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      setActiveFilterTab(filter);
      filterSlides(filter);
    });
  });
}
pCarouselSwiper();

function initMicroModal() {
  console.log("initMicroModal running...", MicroModal);

  MicroModal.init({
    disableScroll: true,
    awaitOpenAnimation: true,
    awaitCloseAnimation: true,

    onShow: (modal) => {
      const container = modal.querySelector(".modal__container");

      console.log("show container", container);

      gsap.fromTo(
        container,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          ease: "power3.out",
        }
      );
    },

    onClose: (modal) => {
      const container = modal.querySelector(".modal__container");
      console.log("close container", container);
      gsap.to(container, {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.3,
        ease: "power3.in",
      });
    },
  });
}
initMicroModal();

function ctaBannerAnimation() {
  console.log("ctaBannerAnimation Running 11...");
  setTimeout(() => {
    if (typeof gsap === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    const ctaBannerSec = document.querySelector("[cta-banner-sec]");

    if (!ctaBannerSec) {
      console.error(
        "Missing cta banner section elements — check your HTML selectors."
      );
      return;
    }

    const textWrapper = ctaBannerSec.querySelector("[cta-text-wrapper]");

    const caTl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaBannerSec,
        start: "top 30%",
        end: "bottom bottom",
        markers: true,
        scrub: 3,
      },
    });

    caTl.set(textWrapper, {
      opacity: 0,
      scale: 0.5,
    });
    caTl.to(textWrapper, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
  }, 10);
}
// ctaBannerAnimation();

function CareerAccordionAnimation() {
  document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll(".v-tabs_accordion_item");

    items.forEach((item, idx) => {
      const header = item.querySelector(".v-tabs_accordion_header");
      const body = item.querySelector(".v-tabs_accordion_body");

      if (idx === 0) {
        item.classList.add("is-opened");
        gsap.set(body, { maxHeight: "1000px" });
      }
      // Initial state
      if (item.classList.contains("is-opened")) {
        gsap.set(body, { maxHeight: "1000px" });
      } else {
        gsap.set(body, { maxHeight: 0 });
      }

      header.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-opened");

        console.log("isOpen", isOpen, item);

        return;

        // Close all others
        items.forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-opened");
            gsap.to(other.querySelector(".v-tabs_accordion_body"), {
              maxHeight: 0,
              duration: 0.4,
              ease: "power2.inOut",
            });
          }
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add("is-opened");
          gsap.to(body, {
            maxHeight: "1000px",
            duration: 0.5,
            ease: "power2.out",
          });
        } else {
          item.classList.remove("is-opened");
          gsap.to(body, {
            maxHeight: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
        }
      });
    });
  });
}

CareerAccordionAnimation();

function contractor2Slider() {
  const slider = document.querySelector("[data-contractor-swiper]");
  if (!slider) return;

  console.log("contractor slider", slider);

  const contractorSlider = new Swiper(slider, {
    navigation: {
      nextEl: document.querySelector(
        ".top-contractors-slider [data-swiper-button=next] "
      ),
      prevEl: document.querySelector(
        ".top-contractors-slider [data-swiper-button=prev]"
      ),
    },
    pagination: {
      el: slider.querySelector(".swiper-pagination"),
      clickable: true,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 10,
      },
      640: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 1.3,
        spaceBetween: 20,
      },
    },
  });
}
contractor2Slider();

// function homeBottomSlider() {
//   const slider = document.querySelector("[data-home-started]");
//   if (!slider) return;

//   console.log("home bottom slider", slider);

//   const homeBottomSliderSwiper = new Swiper(slider, {

//     pagination: {
//       el: slider.querySelector(".swiper-pagination"),
//       clickable: true,
//     },
//     breakpoints: {
//       0: {
//         slidesPerView: 1,
//         spaceBetween: 10,
//       },
//       640: {
//         slidesPerView: 1,
//         spaceBetween: 24,
//       },
//       1024: {
//         slidesPerView: 3,
//         spaceBetween: 20,
//       },
//     },
//   });
// }
// homeBottomSlider();

function NavbarScroll() {
  let lastScrollY = window.scrollY;
  const navbar = document.querySelector(".nav_component");

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    // scroll down → hide
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      navbar.classList.add("nav--hidden");
      navbar.classList.remove("nav--visible");
    }

    // scroll up → show
    if (currentScrollY < lastScrollY) {
      navbar.classList.add("nav--visible");
      navbar.classList.remove("nav--hidden");
    }

    if (currentScrollY <= 300) {
      navbar.classList.remove("nav--hidden");
      navbar.classList.remove("nav--visible");
    }

    lastScrollY = currentScrollY;
  });
}
NavbarScroll();
