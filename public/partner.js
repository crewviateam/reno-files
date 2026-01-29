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

    const sectionRect = stickySec.getBoundingClientRect();
    const centerX = sectionRect.width / 2;
    const centerY = sectionRect.height / 1.5;

    const getXandY = (img) => {
      const rect = img.getBoundingClientRect();

      const imgCenterX = rect.left + rect.width / 2 - sectionRect.left;
      const imgCenterY = rect.top + rect.height / 2 - sectionRect.top;

      return { moveX: centerX - imgCenterX, moveY: centerY - imgCenterY };
    };

    const CardAnimation = (img) => {
      return {
        x: getXandY(img).moveX,
        y: getXandY(img).moveY,
        opacity: 1,
        scale: 1,
        duration: 2,
      };
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: partnerTrack,
        start: "700px 80%",
        end: "bottom bottom",
        scrub: 2,
        markers: false,
      },
    });

    const emptyTimeline = () => {
      tl.to(colLogo, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const timelineRender = (cardIndex, prcnt) => {
      tl.to(cards[cardIndex], CardAnimation(cards[cardIndex]));
      tl.to(
        cards[cardIndex],
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.2"
      );

      tl.to(
        colLogo,
        {
          clipPath: `inset(0% ${prcnt}% 0% 0%)`,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.4"
      );
    };

    timelineRender(4, 80);
    timelineRender(2, 60);
    timelineRender(3, 50);
    timelineRender(1, 40);
    timelineRender(5, 30);
    timelineRender(0, 0);
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
