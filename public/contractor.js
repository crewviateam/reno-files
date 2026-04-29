document.addEventListener("DOMContentLoaded", function () {
  const buttonSwiper = new Swiper(".ctr_imagine_v-slider_wrap.swiper", {
    slidesPerView: 1,
    spaceBetween: 0,
    direction: "vertical",
    speed: 450,
    slideToClickedSlide: true,
    touchRatio: 0.5, // lower = stiffer drag
    resistanceRatio: 0.85, // closer to 1 = more resistance
    freeMode: true,
  });

  const imageSwiper = new Swiper(".swiper.ctr_imagine_img_slider_wrap", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    effect: "fade",
    fadeEffect: { crossFade: true },
    speed: 0,
    allowTouchMove: false,
  });

  // Sync vertical slider with text slider
  buttonSwiper.controller.control = imageSwiper;
  imageSwiper.controller.control = buttonSwiper;

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: ".ctr_imagine_track",
    start: "top top", // when .track enters viewport
    end: "bottom bottom", // when .track leaves viewport
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress; // 0 to 1

      if (progress < 0.25) {
        buttonSwiper.slideTo(0); // 1st slide
      } else if (progress < 0.5) {
        buttonSwiper.slideTo(1); // 2nd slide
      } else if (progress < 0.75) {
        buttonSwiper.slideTo(2); // 3rd slide
      } else {
        buttonSwiper.slideTo(3); // 4th slide
      }
    },
  });
});

const swiper = new Swiper(".ctr_industory_slider_wrap.swiper", {
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
  navigation: {
    nextEl: '[data-swiper-button="next"]',
    prevEl: '[data-swiper-button="prev"]',
  },
  autoplay: {
    delay: 4500,
  },
  on: {
    progress(swiper) {
      const isMobile = window.innerWidth <= 767;
      // Mobile: smaller translate so adjacent cards peek in from sides (Figma match)
      // Desktop: original values unchanged
      const scaleStep = isMobile ? 0.1 : 0.175;
      const translateMult = isMobile ? 18 : 40;
      const opacityThreshold = isMobile ? 1.5 : 2.9;

      const zIndexMax = swiper.slides.length;
      for (let i = 0; i < swiper.slides.length; i += 1) {
        const slideEl = swiper.slides[i];
        const slideProgress = swiper.slides[i].progress;
        const absProgress = Math.abs(slideProgress);
        let modify = 1;
        if (absProgress > 1) {
          modify = (absProgress - 1) * 0.2 + 1;
        }
        const translate = `${slideProgress * modify * translateMult}%`;
        const scale = 1 - absProgress * scaleStep;
        const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
        slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
        slideEl.style.zIndex = zIndex;

        if (absProgress > opacityThreshold) {
          slideEl.style.opacity = 0;
        } else {
          slideEl.style.opacity = 1;
        }
      }
    },

    setTransition(swiper, duration) {
      for (let i = 0; i < swiper.slides.length; i += 1) {
        const slideEl = swiper.slides[i];
        slideEl.style.transitionDuration = `${duration}ms`;
      }
    },
  },
});

const init = () => {
  const marquees = document.querySelectorAll(".portfolio_list_img_list");

  if (!marquees.length) {
    return;
  }

  const marqueeInstances = [];

  marquees.forEach((marquee, index) => {
    const duration = 10;
    const marqueeContent = marquee.firstChild;

    if (!marqueeContent) {
      return;
    }

    const numberOfClones = 3; // how many times you want to clone

    for (let i = 0; i < numberOfClones; i++) {
      const clone = marqueeContent.cloneNode(true);
      marquee.append(clone);
    }

    let tween;

    const playMarquee = () => {
      let progress = tween ? tween.progress() : 0;
      tween && tween.progress(0).kill();

      const width = parseInt(
        getComputedStyle(marqueeContent).getPropertyValue("width"),
        10
      );
      const gap = parseInt(
        getComputedStyle(marqueeContent).getPropertyValue("row-gap"),
        10
      );
      const distanceToTranslate = -1 * (gap + width);

      tween = gsap.fromTo(
        marquee.children,
        { y: 0 },
        { y: distanceToTranslate, duration, ease: "none", repeat: -1 }
      );
      tween.progress(progress);
      console.log(`Marquee ${index + 1} width:`, width);
    };

    playMarquee();

    // Store the instance for resize handling
    marqueeInstances.push({
      marquee,
      playMarquee,
    });
  });

  function debounce(func) {
    var timer;
    return function (event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(
        () => {
          func();
        },
        500,
        event
      );
    };
  }

  // Handle resize for all marquee instances
  const handleResize = () => {
    marqueeInstances.forEach((instance) => {
      instance.playMarquee();
    });
  };

  window.addEventListener("resize", debounce(handleResize));
};

function PartnerTrackAnimation() {
  console.log("PartnerTrackAnimation start running 12...");
  setTimeout(() => {
    if (typeof gsap === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    const partnerTrack = document.querySelector("[data-partner-track]");
    if (!partnerTrack) return;

    const cards = partnerTrack.querySelectorAll("img.partner-img");
    const stickySec = partnerTrack.querySelector(".partners_sticky ");
    const ghostLogo = partnerTrack.querySelector(".ghost-logo ");
    const colLogo = partnerTrack.querySelector(".color-logo ");

    gsap.set([cards, colLogo], { clearProps: "all" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: partnerTrack,
        start: "700px 80%",
        end: "bottom bottom",
        scrub: 2,
        markers: false,
      },
    });

    // 1. CAPTURE INITIAL POSITIONS (Clean relative start coords!)
    const initialPositions = new Map();
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const sRect = stickySec.getBoundingClientRect();
      initialPositions.set(card, {
        x: rect.left - sRect.left,
        y: rect.top - sRect.top,
        width: rect.width,
        height: rect.height
      });
    });

    const getX = (card, mult = 1) => {
      const sRect = stickySec.getBoundingClientRect();
      const pos = initialPositions.get(card);
      const centerX = sRect.width / 2;
      return (centerX - (pos.x + pos.width / 2)) * mult;
    };

    const getY = (card, mult = 1) => {
      const sRect = stickySec.getBoundingClientRect();
      const pos = initialPositions.get(card);
      const centerY = sRect.height / 1.5;
      return (centerY - (pos.y + pos.height / 2)) * mult;
    };

    // 2. STAGES (Exact required structure based on array indices)
    const cardsArray = Array.from(cards);
    const stage1Card = cardsArray[4]; // First to merge (Last image in HTML)
    const stage2Card = cardsArray[2]; // Second to merge (3rd last image in HTML)
    const restCards = cardsArray.filter(c => c !== stage1Card && c !== stage2Card); // The rest merge together

    tl.set(cards, { x: 0, y: 0, scale: 1, autoAlpha: 1 }, 0);

    const stageDuration = 4;

    // STAGE 1 CARD (Merges in Stage 1)
    if (stage1Card) {
      tl.to(stage1Card, {
        keyframes: [
          { x: () => getX(stage1Card, 1), y: () => getY(stage1Card, 1), scale: 0.5, duration: stageDuration },
          { scale: 0.2, autoAlpha: 0, duration: 0.5, ease: "power2.in" }
        ],
        ease: "none"
      }, 0);
    }

    // STAGE 2 CARD (Half-way in Stage 1, Merges in Stage 2)
    if (stage2Card) {
      tl.to(stage2Card, {
        keyframes: [
           { x: () => getX(stage2Card, 0.5), y: () => getY(stage2Card, 0.5), scale: 0.75, duration: stageDuration },
           { x: () => getX(stage2Card, 1), y: () => getY(stage2Card, 1), scale: 0.5, duration: stageDuration },
           { scale: 0.2, autoAlpha: 0, duration: 0.5, ease: "power2.in" }
        ],
        ease: "none"
      }, 0);
    }

    // REMAINING CARDS (Merge together fully in Stage 3)
    restCards.forEach(card => {
      if (!card) return;
      tl.to(card, {
        keyframes: [
           { x: () => getX(card, 0.33), y: () => getY(card, 0.33), scale: 0.83, duration: stageDuration },
           { x: () => getX(card, 0.66), y: () => getY(card, 0.66), scale: 0.66, duration: stageDuration },
           { x: () => getX(card, 1), y: () => getY(card, 1), scale: 0.5, duration: stageDuration },
           { scale: 0.2, autoAlpha: 0, duration: 0.5, ease: "power2.in" }
        ],
        ease: "none"
      }, 0);
    });

    // 3. COLOR LOGO REVEAL (Synced seamlessly with remaining stages)
    // Use .set at time 0 to avoid immediateRender bugs causing false states before scroll begins
    tl.set(colLogo, { clipPath: "inset(0% 100% 0% 0%)" }, 0);
    tl.to(colLogo, { clipPath: "inset(0% 80% 0% 0%)", duration: 1, ease: "linear" }, stageDuration - 1)
      .to(colLogo, { clipPath: "inset(0% 60% 0% 0%)", duration: 1, ease: "linear" }, (stageDuration * 2) - 1)
      .to(colLogo, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "linear" }, (stageDuration * 3) - 1);
  }, 10);
}
PartnerTrackAnimation();

function counterAnimation() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.error("GSAP or ScrollTrigger not loaded");
    return;
  }

  const counterSection = document.querySelector(".ctr_stats_section");
  if (!counterSection) return;

  const counters = counterSection.querySelectorAll(".counter-text");

  counters.forEach((el) => {
    // Target value
    let target =
      el.getAttribute("data-target") ||
      el.textContent.replace(/[^\d]/g, "") ||
      "1000";

    target = parseInt(target, 10);

    // Start value
    let startVal = 0;
    el.textContent = startVal.toLocaleString();

    let counterObj = { value: startVal };

    gsap.to(counterObj, {
      value: target,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: counterSection,
        start: "top 40%",
        once: true, // 🔥 important: animate only once
        markers: true, // remove in production
      },
      onUpdate() {
        el.textContent = Math.floor(counterObj.value).toLocaleString();
      },
    });
  });
}

counterAnimation();

// function browseContractorSwiper() {
//   console.log("browseContractorSwiper running...");

//   const swiper = new Swiper("[browse-contractors-swiper]", {
//     slidesPerView: 4.5,
//     spaceBetween: 32,
//     loop: true,
//     centeredSlides: true,
//     grabCursor: false,

//     breakpoints: {
//       0: {
//         slidesPerView: 1.2,
//         spaceBetween: 10,
//       },
//       768: {
//         slidesPerView: 4.5,
//         spaceBetween: 32,
//       },
//     },
//   });
// }

// browseContractorSwiper();
