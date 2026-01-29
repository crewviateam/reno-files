// Wait for GSAP to load, then initialize
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure GSAP is fully loaded
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof Flip === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    // Register plugin
    gsap.registerPlugin(Flip);

    const clusterCard = document.querySelector("[data-cluster-card]");
    const images = [
      document.querySelector("[data-cluster-image-1]"),
      document.querySelector("[data-cluster-image-2]"),
      document.querySelector("[data-cluster-image-3]"),
      document.querySelector("[data-cluster-image-4]"),
    ];
    const containers = [
      document.querySelector("[data-cluster-image-container-1]"),
      document.querySelector("[data-cluster-image-container-2]"),
      document.querySelector("[data-cluster-image-container-3]"),
      document.querySelector("[data-cluster-image-container-4]"),
    ];

    // Exit early if elements are missing
    if (!clusterCard || images.includes(null) || containers.includes(null)) {
      console.error("Missing cluster elements — check your HTML selectors.");
      return;
    }

    let currentFlipAnimation = null;
    let targetState = "default"; // 'default' or 'hovered'
    let currentState = "default";

    function animateImages(hovering) {
      targetState = hovering ? "hovered" : "default";

      // If we're already in the target state, do nothing
      if (currentState === targetState && !currentFlipAnimation) return;

      // Kill any existing animation
      if (currentFlipAnimation) {
        currentFlipAnimation.kill();
      }

      // Capture current layout
      const state = Flip.getState(images);

      if (hovering) {
        // Move images in a rotating pattern
        containers[1].appendChild(images[0]);
        containers[2].appendChild(images[1]);
        containers[3].appendChild(images[2]);
        containers[0].appendChild(images[3]);
      } else {
        // Return to original positions
        containers[0].appendChild(images[0]);
        containers[1].appendChild(images[1]);
        containers[2].appendChild(images[2]);
        containers[3].appendChild(images[3]);
      }

      // Animate with Flip
      currentFlipAnimation = Flip.from(state, {
        duration: 0.45, // Reduced duration for snappier response
        ease: "back.out(1.2)",
        absolute: true,
        scale: true,
        onComplete: () => {
          currentFlipAnimation = null;
          currentState = targetState;
        },
        onInterrupt: () => {
          currentFlipAnimation = null;
        },
      });
    }

    // Use a debounced approach for better control
    let mouseenterTimeout;
    let mouseleaveTimeout;
    const DEBOUNCE_DELAY = 50; // Small delay to prevent accidental triggers

    clusterCard.addEventListener("mouseenter", () => {
      clearTimeout(mouseleaveTimeout);
      mouseenterTimeout = setTimeout(() => {
        animateImages(true);
      }, DEBOUNCE_DELAY);
    });

    clusterCard.addEventListener("mouseleave", () => {
      clearTimeout(mouseenterTimeout);
      mouseleaveTimeout = setTimeout(() => {
        animateImages(false);
      }, DEBOUNCE_DELAY);
    });

    console.log("GSAP Flip animation initialized successfully!");
  }, 10);
});

document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);
  // Animate characters with SplitText
  document.querySelectorAll("[data-animate-chars]").forEach((element) => {
    // SplitText splits the element into lines and characters
    const split = new SplitText(element, { type: "lines,chars" });

    // Create a timeline for scrubbing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        scrub: 1, // Smooth scrubbing with 1 second lag
      },
    });

    // Add the character animation to the timeline
    tl.fromTo(
      split.chars,
      {
        y: 25,
        opacity: 0,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        stagger: 0.02, // Increased stagger for better scrub visibility
        duration: 1,
        ease: "power2.out",
      }
    );
    // Add class to split characters
    split.chars.forEach((char) => char.classList.add("split-char"));
  });
});

// Wait for GSAP to load, then initialize
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure GSAP is fully loaded
  setTimeout(() => {
    if (typeof gsap === "undefined" || typeof Flip === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    // Register plugin
    gsap.registerPlugin(Flip);

    const clusterCard = document.querySelector("[data-cluster-card]");
    const images = [
      document.querySelector("[data-cluster-image-1]"),
      document.querySelector("[data-cluster-image-2]"),
      document.querySelector("[data-cluster-image-3]"),
      document.querySelector("[data-cluster-image-4]"),
    ];
    const containers = [
      document.querySelector("[data-cluster-image-container-1]"),
      document.querySelector("[data-cluster-image-container-2]"),
      document.querySelector("[data-cluster-image-container-3]"),
      document.querySelector("[data-cluster-image-container-4]"),
    ];

    // Exit early if elements are missing
    if (!clusterCard || images.includes(null) || containers.includes(null)) {
      console.error("Missing cluster elements — check your HTML selectors.");
      return;
    }

    let currentFlipAnimation = null;
    let targetState = "default"; // 'default' or 'hovered'
    let currentState = "default";

    function animateImages(hovering) {
      targetState = hovering ? "hovered" : "default";

      // If we're already in the target state, do nothing
      if (currentState === targetState && !currentFlipAnimation) return;

      // Kill any existing animation
      if (currentFlipAnimation) {
        currentFlipAnimation.kill();
      }

      // Capture current layout
      const state = Flip.getState(images);

      if (hovering) {
        // Move images in a rotating pattern
        containers[1].appendChild(images[0]);
        containers[2].appendChild(images[1]);
        containers[3].appendChild(images[2]);
        containers[0].appendChild(images[3]);
      } else {
        // Return to original positions
        containers[0].appendChild(images[0]);
        containers[1].appendChild(images[1]);
        containers[2].appendChild(images[2]);
        containers[3].appendChild(images[3]);
      }

      // Animate with Flip
      currentFlipAnimation = Flip.from(state, {
        duration: 0.45,
        ease: "back.out(1.2)",
        absolute: true,
        scale: true,
        onComplete: () => {
          currentFlipAnimation = null;
          currentState = targetState;
        },
        onInterrupt: () => {
          currentFlipAnimation = null;
        },
      });
    }

    // Use a debounced approach for better control
    let mouseenterTimeout;
    let mouseleaveTimeout;
    const DEBOUNCE_DELAY = 50; // Small delay to prevent accidental triggers

    clusterCard.addEventListener("mouseenter", () => {
      clearTimeout(mouseleaveTimeout);
      mouseenterTimeout = setTimeout(() => {
        animateImages(true);
      }, DEBOUNCE_DELAY);
    });

    clusterCard.addEventListener("mouseleave", () => {
      clearTimeout(mouseenterTimeout);
      mouseleaveTimeout = setTimeout(() => {
        animateImages(false);
      }, DEBOUNCE_DELAY);
    });

    console.log("GSAP Flip animation initialized successfully!");
  }, 10);
});

function initHeroSliders() {
  document
    .querySelectorAll("[data-hero-slider-component]")
    .forEach((wrapper) => {
      const mainEl = wrapper.querySelector(".swiper.home_hero_slider");
      const thumbEl = wrapper.querySelector(".swiper.home_hero_thumb-slider");

      if (!mainEl) return;

      // Check if mobile (you can adjust the breakpoint as needed)
      const isMobile = window.innerWidth <= 768;

      const mainSliderConfig = {
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
          reverseDirection: true,
        },
        speed: 1000,
        loopAdditionalSlides: 10,
      };

      // Mobile-specific configuration
      if (isMobile) {
        mainSliderConfig.spaceBetween = 10;
        // Set overflow visible on the swiper element
        mainEl.style.overflow = "visible";
      } else {
        // Desktop - add fade effect
        mainSliderConfig.effect = "fade";
        mainSliderConfig.fadeEffect = { crossFade: true };
      }

      const swiper = new Swiper(mainEl, mainSliderConfig);

      // Only initialize thumb slider and controller on desktop
      if (!isMobile && thumbEl) {
        const thumbSwiper = new Swiper(thumbEl, {
          loop: true,
          speed: 1000,
          slidesPerView: 1,
          spaceBetween: 20,
          loopAdditionalSlides: 10,
          touchRatio: 0.7,
          resistanceRatio: 0.65,
          grabCursor: true,
        });

        swiper.controller.control = thumbSwiper;
        thumbSwiper.controller.control = swiper;
      }
    });
}
function GallerySecAnimation() {
  console.log("GallerySecAnimation Running 11...");
  setTimeout(() => {
    if (typeof gsap === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    const gallerySec = document.querySelector("[data-image-block-sec]");

    if (!gallerySec) {
      console.error(
        "Missing gallery section elements — check your HTML selectors."
      );
      return;
    }

    const images = gallerySec.querySelectorAll(".gallery-image-wrapper");
    const imagesIsInitial = gallerySec.querySelectorAll("[isInitial='true']");
    const animImage = gallerySec.querySelectorAll(
      ".main-gallery-image-wrapper-animated"
    );
    const fText = gallerySec.querySelector(".gallery-t-text-container");
    const sText = gallerySec.querySelector(".gallery-s-text-container");
    const textarea = sText.querySelector(".gallery-f-text-area");

    const galTl = gsap.timeline({
      scrollTrigger: {
        trigger: gallerySec,
        start: "700px 80%",
        end: "bottom bottom",
        markers: true,
        scrub: 3,
      },
    });

    galTl.set(sText, {
      opacity: 0,
    });
    galTl.set(textarea, {
      opacity: 0,
      scale: 0.5,
    });
    galTl.set(images, {
      opacity: 0,
    });

    galTl.to(imagesIsInitial, {
      opacity: 1,
      stagger: {
        each: 0.1,
        from: "random",
      },
    });

    galTl.to(fText, {
      opacity: 0,
      scale: 0.5,
      ease: "power2.out",
    });

    galTl.to(
      images,
      {
        opacity: 1,
        y: 0,
        stagger: {
          each: 0.1,
          from: "random",
        },
      },
      "-=0.5"
    );

    galTl.to(animImage, {
      scaleX: 2,
      scaleY: 2,
      width: "700px",
      height: "500px",
      duration: 2,
      transformOrigin: "84% 100%",
      ease: "power2.out",
    });

    // console.log("animImage anim", animImage);

    // galTl.add(() => {
    //   console.log("animImage anim add arr", animImage);
    //   const before = animImage[0].getBoundingClientRect();

    //   gsap.set(animImage, {
    //     transformOrigin: "center center",
    //   });

    //   const after = animImage[0].getBoundingClientRect();

    //   const dx = before.left - after.left;
    //   const dy = before.top - after.top;

    //   gsap.set(animImage, {
    //     x: `+=${dx}`,
    //     y: `+=${dy}`,
    //   });
    // });

    galTl.to(animImage, {
      width: "1000px",
      height: "700px",
      // y: "50%",
      scaleX: 3,
      scaleY: 3,
      duration: 0.5,
      transformOrigin: "84% 100%",
      ease: "power2.out",
    });

    galTl.to(
      images[10],
      {
        opacity: 0.9,
        ease: "power2.out",
      },
      "-=0.5"
    );
    for (let i = 0; i < images.length; i++) {
      if (i !== 20) {
        galTl.to(
          images[i],
          {
            opacity: 0,
            ease: "power2.out",
          },
          "-=0.5"
        );
      }
    }

    galTl.to(sText, {
      opacity: 1,
      scale: 1,
      ease: "power2.out",
    });
    galTl.to(sText, {
      opacity: 1,
      scale: 1,
      ease: "power2.out",
    });
    galTl.to(sText, {
      opacity: 1,
      ease: "power2.out",
    });
    galTl.to(textarea, {
      opacity: 1,
      scale: 1,
      ease: "power2.out",
    });
  }, 10);
}

GallerySecAnimation();

function designerSlider() {
  const designerMainSlider = document.querySelector("[designer-main-slider]");
  const designerPaginationSlider = document.querySelector(
    "[designer-pagination-slider]"
  );

  const designerPaginationSliderConfig = new Swiper(designerPaginationSlider, {
    direction: "vertical",
    slidesPerView: 3.5,
    centeredSlides: true,
    spaceBetween: 20,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
  });

  const designerMainSliderConfig = new Swiper(designerMainSlider, {
    slidesPerView: 1,
    spaceBetween: 10,
    effect: "fade",
    fadeEffect: { crossFade: true },
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
    thumbs: {
      swiper: designerPaginationSliderConfig,
    },
    on: {
      slideChange: function () {
        designerPaginationSliderConfig.slideTo(this.activeIndex);
      },
    },
  });

  designerPaginationSliderConfig.on("click", function () {
    if (this.clickedIndex !== undefined) {
      this.slideTo(this.clickedIndex);
    }
  });
}

designerSlider();

console.log("designerSlider Running 223...");
