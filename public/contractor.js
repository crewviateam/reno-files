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
        const scaleStep = 0.175;
        const zIndexMax = swiper.slides.length;
        for (let i = 0; i < swiper.slides.length; i += 1) {
          const slideEl = swiper.slides[i];
          const slideProgress = swiper.slides[i].progress;
          const absProgress = Math.abs(slideProgress);
          let modify = 1;
          if (absProgress > 1) {
            modify = (absProgress - 1) * 0.2 + 1;
          }
          const translate = `${slideProgress * modify * 40}%`;
          const scale = 1 - absProgress * scaleStep;
          const zIndex = zIndexMax - Math.abs(Math.round(slideProgress));
          slideEl.style.transform = `translateX(${translate}) scale(${scale})`;
          slideEl.style.zIndex = zIndex;
  
          if (absProgress > 2.9) {
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