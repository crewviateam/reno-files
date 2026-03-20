document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. UTILITIES
  function setupAedSigns() {
    const elements = document.querySelectorAll(
      ".pay-later_calc_range_wrap .u-flex-horizontal-nowrap p.u-opacity-70"
    );
    elements.forEach((el) => {
      // Replace only standalone AED text (case-insensitive)
      el.innerHTML = el.innerHTML.replace(
        /\bAED\b/gi,
        '<span class="aed-sign">AED</span>'
      );
    });
  }

  /* ----------------------------------
    2. TAB PANE ANIMATIONS 
    (Merged logic from first and last parts of original file)
  ---------------------------------- */
  function initTabPaneAnimations(activePane) {
    if (!activePane) return;

    const q = gsap.utils.selector(activePane);
    
    // Check for fixed height section or sticky elements
    const hasFixedHeight = q(".tab-section_fixed_height").length > 0;
    const hasSticky = q("[el-sticky]").length > 0;

    if (!hasFixedHeight && !hasSticky) return;

    /* Part A: Imagine Animation (Fixed Height) */
    if (hasFixedHeight) {
      const triggerEl = q(".tab-section_fixed_height")[0];

      // Reset states
      gsap.set(q(".tab_imagine_content_wrapper.is-02, .tab_imagine_content_wrapper.is-03"), {
        yPercent: 100, opacity: 0
      });
      gsap.set(
        q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3, .tab_imagine_content_wrapper.is-01"),
        { scale: 1, opacity: 1, yPercent: 0, filter: "blur(0px)" }
      );
      gsap.set(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7, .re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"), {
        scale: 0, opacity: 0, filter: "blur(0px)"
      });
      
      // Ensure parallax/image elements are reset
      gsap.set(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), {
        opacity: 0, visibility: "hidden"
      });

      // Initial states for mobile app mockups
      gsap.set(".mobile-app-container .mobile_mockup_image", {
        clearProps: "transform",
        yPercent: -150,
        opacity: 0
      });
      gsap.set(".mobile-app-container .mobile_mocup_content", {
        yPercent: 150,
        opacity: 0
      });

      // Visibility toggle trigger
      ScrollTrigger.create({
        id: "tabPaneTrigger_visibility",
        trigger: triggerEl,
        start: "top 80%",
        onEnter: () => {
          gsap.to(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), {
            opacity: 1, visibility: "visible", duration: 0.4, ease: "power1.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), {
            opacity: 0, visibility: "hidden", duration: 0.3, ease: "power1.in"
          });
        }
      });

      const mainTL = gsap.timeline({
        scrollTrigger: {
          id: "tabPaneTrigger_main",
          trigger: triggerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true
        }
      });

      const batch2StartTime = 3.0;
      const batch3StartTime = 6.0;
      const durationPerTransition = 1.0;
      const staggerDuration = 0.5;

      // BATCH 1: OUT
      mainTL.to(q(".tab_imagine_content_wrapper.is-01"), {
        yPercent: -100, opacity: 0, ease: "power2.in", duration: durationPerTransition
      }, 0.5);

      mainTL.to(q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3"), {
        scale: 3.5, opacity: 0, filter: "blur(20px)", stagger: 0.15, ease: "power2.in", duration: durationPerTransition
      }, 1.5);

      // BATCH 2: IN & OUT
      mainTL.fromTo(q(".tab_imagine_content_wrapper.is-02"), 
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "power2.out", duration: durationPerTransition },
        batch2StartTime
      )
      .fromTo(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7"),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.15, ease: "power2.out", duration: durationPerTransition },
        batch2StartTime + staggerDuration
      )
      .to(q(".tab_imagine_content_wrapper.is-02"), {
        yPercent: -100, opacity: 0, ease: "power2.in", duration: durationPerTransition
      }, batch2StartTime + 2.0)
      .to(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7"), {
        scale: 3.5, opacity: 0, filter: "blur(20px)", stagger: 0.1, ease: "power2.in", duration: durationPerTransition
      }, batch2StartTime + 2.2);

      // BATCH 3: IN & OUT
      mainTL.fromTo(q(".tab_imagine_content_wrapper.is-03"),
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: "power2.out", duration: durationPerTransition },
        batch3StartTime
      )
      .fromTo(q(".re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"),
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.15, ease: "power2.out", duration: durationPerTransition },
        batch3StartTime + staggerDuration
      )
      .to(q(".tab_imagine_content_wrapper.is-03"), {
        yPercent: -100, opacity: 0, duration: durationPerTransition, ease: "power2.inOut"
      }, batch3StartTime + 2.2)
      .to(q(".re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"), {
        scale: 3.5, opacity: 0, filter: "blur(20px)", stagger: 0.1, ease: "power2.in", duration: durationPerTransition
      }, batch3StartTime + 2.2);

      // Parallax
      q(".re-imagine_image-wrap img").forEach((img, i) => {
        gsap.to(img, {
          y: () => ((i % 3) * 0.3) * 100,
          scrollTrigger: {
            id: `tabPaneTrigger_parallax_${i}`,
            trigger: triggerEl,
            start: "top top", end: "bottom top", scrub: true
          }
        });
      });

      mainTL.to(".mobile-app-container .mobile_mockup_image", {
        yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut"
      }).to(".mobile-app-container .mobile_mocup_content", {
        yPercent: 0, opacity: 1, duration: 1, ease: "power2.inOut"
      }, "-=0.5");
    }

    /* Part B: Sticky Animation */
    if (hasSticky) {
      const leftItems = q(".tabs_flexbox_left");
      const centerItems = q(".tabs_flex_right_center_img");
      const bgItems = q(".tabs_flex_img");
      const triggers = q("[el-trigger]");

      gsap.set(leftItems, { zIndex: 50, autoAlpha: 0, yPercent: 100 });
      gsap.set(centerItems, { zIndex: 50, autoAlpha: 0, yPercent: 100 });
      gsap.set(bgItems, { zIndex: 1, autoAlpha: 0, scale: 1.5 });

      if (leftItems[0]) {
        gsap.set(leftItems[0], { autoAlpha: 1, yPercent: 0 });
        gsap.set(centerItems[0], { autoAlpha: 1, yPercent: 0 });
        gsap.set(bgItems[0], { autoAlpha: 1, scale: 1, zIndex: 2 });
      }

      triggers.forEach((trigger, i) => {
        let next = i + 1;
        if (!leftItems[next]) return;

        gsap.timeline({
          scrollTrigger: {
            id: `tabPaneTrigger_sticky_tl_${i}`,
            trigger: trigger,
            start: "top bottom",
            end: "top top",
            scrub: 0.5,
          }
        })
        .to([leftItems[i], centerItems[i]], {
          yPercent: -100, autoAlpha: 0, duration: 1, ease: "power2.inOut"
        })
        .to([leftItems[next], centerItems[next]], {
          yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut"
        }, "<")
        .fromTo(bgItems[next],
          { scale: 1.5, autoAlpha: 0, zIndex: next + 5 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "power2.out" },
          "<"
        );
      });

      ScrollTrigger.create({
        id: "tabPaneTrigger_sticky_pin",
        trigger: q("[el-sticky]"),
        start: "top top",
        end: () => "+=" + (triggers.reduce((acc, t) => acc + t.offsetHeight, 0)),
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true
      });
    }
  }

  /* ----------------------------------
    3. MENU CENTER ANIMATION
  ---------------------------------- */
  function initMenuCenterAnimation(activePane) {
    const tabMenu = document.querySelector(".w-tab-menu");
    if (!tabMenu || !activePane) return;

    const tabSpaceDiv = activePane.querySelector(".tab-space-div");
    if (!tabSpaceDiv) return;

    // Reset styles to avoid jumps
    gsap.set(tabMenu, { clearProps: "all" });

    const tabTl = gsap.timeline({
      scrollTrigger: {
        id: "menuCenterTrigger",
        trigger: tabSpaceDiv,
        start: "top bottom",
        end: "bottom top", 
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });

    tabTl.to(tabMenu, {
      left: "50%",
      bottom: "50%",
      xPercent: -50,
      yPercent: -50,
      scale: 1.3,
      duration: 2,
      ease: "power2.inOut",
      onStart: () => tabMenu.classList.remove("choose-text"),
      onComplete: () => tabMenu.classList.add("choose-text"),
      onReverseComplete: () => tabMenu.classList.remove("choose-text")
    })
    .to({}, { duration: 1.5 })
    .call(() => tabMenu.classList.remove("choose-text"))
    .to(tabMenu, { opacity: 0, duration: 0.3, ease: "power1.out" })
    .set(tabMenu, { bottom: "5%", left: "50%", xPercent: -50, yPercent: 0, scale: 1 })
    .to(tabMenu, { opacity: 1, duration: 0.4, ease: "power2.out" });
  }

  /* ----------------------------------
    4. PARTNER TRACK ANIMATION
  ---------------------------------- */
  function initPartnerTrackAnimation(activePane) {
    if (!activePane) return;

    const partnerTracks = activePane.querySelectorAll("[data-partner-track]");
    partnerTracks.forEach((track, trackIndex) => {
      const cards = track.querySelectorAll("img.partner-img");
      const stickySec = track.querySelector(".partners_sticky");
      if (!stickySec) return;

      const colLogo = track.querySelector(".color-logo");
      const partnerText = track.querySelector(".partner-text");
      const partnerRLogo = track.querySelector(".partner-reno-logo-container");
      const colorLogoImg = track.querySelector(".one_place-image");
      const colorLogoContent = track.querySelector(".color-logo-content");

      // Reset
      gsap.set([cards, colLogo, partnerText, partnerRLogo, colorLogoImg, colorLogoContent], { clearProps: "all" });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `partnerTrackTrigger_${trackIndex}`,
          trigger: track,
          start: "700px 80%",
          end: "bottom bottom",
          scrub: 2,
          invalidateOnRefresh: true
        },
      });

      const timelineRender = (cardIndex, prcnt) => {
        const card = cards[cardIndex];
        if (!card) return;

        tl.to(card, {
          x: () => {
             const sectionRect = stickySec.getBoundingClientRect();
             const centerX = sectionRect.width / 2;
             const rect = card.getBoundingClientRect();
             const imgCenterX = rect.left + rect.width / 2 - sectionRect.left;
             return centerX - imgCenterX;
          },
          y: () => {
             const sectionRect = stickySec.getBoundingClientRect();
             const centerY = sectionRect.height / 1.5;
             const rect = card.getBoundingClientRect();
             const imgCenterY = rect.top + rect.height / 2 - sectionRect.top;
             return centerY - imgCenterY;
          },
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "none"
        });

        tl.to(card, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
        tl.to(colLogo, { clipPath: `inset(0% ${prcnt}% 0% 0%)`, duration: 1, ease: "power2.out" }, "-=0.4");
      };

      [4, 2, 3, 1, 5, 0].forEach((idx, i) => {
        const percentages = [80, 60, 50, 40, 30, 0];
        timelineRender(idx, percentages[i]);
      });

      tl.to(partnerText, { opacity: 0, duration: 0.5, ease: "power2.out" })
        .to(partnerRLogo, { yPercent: -100, scale: 1.2, duration: 0.5, ease: "power2.out" })
        .to(partnerRLogo, { opacity: 0, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .to(colorLogoImg, { opacity: 1, scale: 1.5, transformOrigin: "bottom center" })
        .to(colorLogoContent, { opacity: 1, yPercent: 0, duration: 0.5, ease: "power2.out" });
    });
  }

  /* ----------------------------------
    5. HERO HIDE ANIMATION
  ---------------------------------- */
  function initHeroHide(activePane) {
    if (!activePane) return;
    const heroSection = activePane.querySelector(".app-hero_section");
    const tabSpaceDiv = activePane.querySelector(".tab-space-div");

    if (!heroSection || !tabSpaceDiv) return;

    gsap.to(heroSection, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        id: "heroHideTrigger",
        trigger: tabSpaceDiv,
        start: "top bottom",
        end: "top center",
        scrub: true,
        invalidateOnRefresh: true,
        overwrite: "auto"
      }
    });
  }

  // --- INITIALIZATION ---
  function initAll() {
    // 1. Kill EVERY ScrollTrigger to start fresh
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    // 2. Global Utilities
    setupAedSigns();

    // 3. Find the Active Tab Pane
    const activePane = document.querySelector(".w-tab-pane.w--tab-active");
    if (activePane) {
      initTabPaneAnimations(activePane);
      initMenuCenterAnimation(activePane);
      initPartnerTrackAnimation(activePane);
      initHeroHide(activePane);
    }
    
    // 4. Final refresh to ensure everything is measured correctly
    ScrollTrigger.refresh();
  }

  // Initial call
  initAll();

  // --- TAB CHANGE HANDLING ---
  const tabLinks = document.querySelectorAll(".w-tab-link");
  tabLinks.forEach(tab => {
    tab.addEventListener("click", () => {
      // Small delay for Webflow's internal tab switching
      setTimeout(() => {
        initAll();
      }, 500);
    });
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
});