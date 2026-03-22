function CareerSecAnimation() {
  document.addEventListener("DOMContentLoaded", function () {
    // Small delay to ensure GSAP is fully loaded
    setTimeout(() => {
      if (typeof gsap === "undefined" || typeof Flip === "undefined") {
        console.error("GSAP or Flip plugin not loaded properly");
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      const wrapper = document.querySelector(".career-revolving-text-wrapper");
      const textContainer = document.querySelector(".career-revolving-text");
      const words = textContainer.querySelectorAll(".inner-span-text");

      const lineHeight = wrapper.offsetHeight;

      // Set initial positions
      gsap.set(words, {
        y: lineHeight,
        opacity: 0,
      });

      let tl = gsap.timeline({ repeat: -1 });

      words.forEach((word) => {
        tl.to(word, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }).to(word, {
          y: -lineHeight,
          opacity: 0,
          duration: 0.6,
          ease: "power3.in",
          delay: 1, // visible pause
        });
      });
    }, 10);
  });
}
CareerSecAnimation();

function PartnerTrackAnimation() {
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

    // 2. STAGES
    const cardsArray = Array.from(cards);
    // For the first stage use the last second image
    const stage1Card = cardsArray[cardsArray.length - 2]; 
    // For the second stage use the last forth image
    const stage2Card = cardsArray[cardsArray.length - 4]; 
    // Rest in final stage
    const restCards = cardsArray.filter(c => c !== stage1Card && c !== stage2Card);

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

function pCarouselSwiper() {
  const slider = document.querySelector("[data-portfolio-slider]");
  if (!slider) return;

  const swiper = new Swiper(slider, {
    slidesPerView: 1,
    spaceBetween: 16,
    centeredSlides: true,
    loop: true,
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
}
pCarouselSwiper();

function calcTabs() {
  const tabsSection = document.querySelector("[data-calc-tab]");
  const tabsButton = tabsSection.querySelectorAll("[data-tab-target]");
  const tabsContent = tabsSection.querySelectorAll("[data-tab]");

  console.log("tabsButton", tabsButton);

  tabsButton.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab-target");
      const content = tabsSection.querySelectorAll(`[data-tab="${target}"]`);

      console.log("content", content);
      console.log("target", target);

      console.log("tabbutton", button);

      // Fade out all contents
      tabsContent.forEach((tab) => {
        if (tab.classList.contains("active")) {
          gsap.to(tab, {
            duration: 0.3,
            opacity: 0,
            onStart: () => {
              tab.style.position = "absolute";
            },
            onComplete: () => {
              tab.style.display = "none";
              tab.classList.remove("active");
              // tab.style.position = "relative";
            },
          });
        } else {
          tab.style.display = "none";
          tab.classList.remove("active");
          tab.style.opacity = 0;
        }
      });

      // Fade in the new one
      content.forEach((tab) => {
        tab.style.display = "block";
      });
      content.forEach((tab) => {
        gsap.to(tab, {
          duration: 0.4,
          opacity: 1,
          onStart: () => {
            tab.classList.add("active");
            tab.style.position = "relative";
          },
        });
      });
    });
  });

  const defaultTab = "home";

  // Initialize: hide all tabs except the first
  tabsContent.forEach((tab, idx) => {
    if (tab.getAttribute("data-tab") === defaultTab) {
      tab.style.display = "block";
      tab.style.opacity = 1;
      tab.classList.add("active");
    } else {
      tab.style.display = "none";
      tab.style.opacity = 0;
      tab.classList.remove("active");
    }
  });
}
calcTabs();
console.log("running 3");
