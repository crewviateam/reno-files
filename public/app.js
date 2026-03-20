document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. UTILITIES (Idempotent AED sign logic)
  function setupAedSigns() {
    const elements = document.querySelectorAll(
      ".pay-later_calc_range_wrap .u-flex-horizontal-nowrap p.u-opacity-70"
    );

    elements.forEach((el) => {
      // Avoid duplicate wrapping by checking if already wrapped
      if (el.querySelector(".aed-sign")) return;
      
      // Replace only standalone AED text (case-insensitive)
      el.innerHTML = el.innerHTML.replace(
        /\bAED\b/gi,
        '<span class="aed-sign">AED</span>'
      );
    });
  }

  /* ----------------------------------
    2. TAB PANE ANIMATIONS 
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

      // Reset states with explicit overwrite
      gsap.set(q(".tab_imagine_content_wrapper.is-01"), { yPercent: 0, autoAlpha: 1, overwrite: true });
      gsap.set(q(".tab_imagine_content_wrapper.is-02, .tab_imagine_content_wrapper.is-03"), {
        yPercent: 100, autoAlpha: 0, overwrite: true
      });
      gsap.set(
        q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3"),
        { scale: 1, autoAlpha: 1, yPercent: 0, filter: "blur(0px)", overwrite: true }
      );
      gsap.set(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7, .re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"), {
        scale: 0, autoAlpha: 0, filter: "blur(0px)", overwrite: true
      });
      
      // Force initial hidden state for all background images
      gsap.set(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), {
        autoAlpha: 0, overwrite: true
      });

      // Fixed initial states for mobile app mockups (Scoped)
      gsap.set(q(".mobile-app-container .mobile_mockup_image"), {
        yPercent: -150,
        autoAlpha: 0,
        overwrite: true
      });
      gsap.set(q(".mobile-app-container .mobile_mocup_content"), {
        yPercent: 150,
        autoAlpha: 0,
        overwrite: true
      });

      const mainTL = gsap.timeline({
        scrollTrigger: {
          id: "tabPaneTrigger_main",
          trigger: triggerEl,
          start: "top 120%",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onRefresh: (self) => {
             // If we are anywhere within the trigger, ensure background is visible
             if (self.isActive) {
               gsap.set(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), { autoAlpha: 1 });
             } else if (self.progress === 0 || self.progress === 1) {
               gsap.set(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), { autoAlpha: 0 });
             }
          }
        }
      });

      // 0. Initial visibility (within the timeline)
      mainTL.to(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), {
        autoAlpha: 1, duration: 0.1
      }, 0);

      // BATCH 1: OUT
      mainTL.to(q(".tab_imagine_content_wrapper.is-01"), {
        yPercent: -100, autoAlpha: 0, ease: "power2.in", duration: 1
      }, 0.5);

      mainTL.to(q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3"), {
        scale: 3.5, autoAlpha: 0, filter: "blur(20px)", stagger: 0.15, ease: "power2.in", duration: 1
      }, 1.5);

      // BATCH 2: IN & OUT
      mainTL.fromTo(q(".tab_imagine_content_wrapper.is-02"), 
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 1 },
        3.0
      )
      .fromTo(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, stagger: 0.15, ease: "power2.out", duration: 1 },
        3.5
      )
      .to(q(".tab_imagine_content_wrapper.is-02"), {
        yPercent: -100, autoAlpha: 0, ease: "power2.in", duration: 1
      }, 5.0)
      .to(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7"), {
        scale: 3.5, autoAlpha: 0, filter: "blur(20px)", stagger: 0.1, ease: "power2.in", duration: 1
      }, 5.2);

      // BATCH 3: IN & OUT
      mainTL.fromTo(q(".tab_imagine_content_wrapper.is-03"),
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: "power2.out", duration: 1 },
        6.0
      )
      .fromTo(q(".re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"),
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, stagger: 0.15, ease: "power2.out", duration: 1 },
        6.5
      )
      .to(q(".tab_imagine_content_wrapper.is-03"), {
        yPercent: -100, autoAlpha: 0, duration: 1, ease: "power2.inOut"
      }, 8.2)
      .to(q(".re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"), {
        scale: 3.5, autoAlpha: 0, filter: "blur(20px)", stagger: 0.1, ease: "power2.in", duration: 1
      }, 8.2);

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

      mainTL.to(q(".mobile-app-container .mobile_mockup_image"), {
        yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut"
      }).to(q(".mobile-app-container .mobile_mocup_content"), {
        yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut"
      }, "-=0.5");
      
      // FINAL HIDE: Absolute cleanup at the end of the main timeline
      mainTL.to(q(".re-imagine_image-wrap img, .re-imagine_image-wrap .tab-section_content"), {
        autoAlpha: 0, duration: 0.1
      }, ">");
    }

    /* Part B: Sticky Animation */
    if (hasSticky) {
      const leftItems = q(".tabs_flexbox_left");
      const centerItems = q(".tabs_flex_right_center_img");
      const bgItems = q(".tabs_flex_img");
      const triggers = q("[el-trigger]");

      // Initial reset for all
      gsap.set(leftItems, { zIndex: 50, autoAlpha: 0, yPercent: 100, overwrite: true });
      gsap.set(centerItems, { zIndex: 50, autoAlpha: 0, yPercent: 100, overwrite: true });
      gsap.set(bgItems, { zIndex: 1, autoAlpha: 0, scale: 1.5, overwrite: true });

      // Robust Refresh Sync for Sticky Part
      const pinTrigger = ScrollTrigger.create({
        id: "tabPaneTrigger_sticky_pin",
        trigger: q("[el-sticky]"),
        start: "top top",
        end: () => "+=" + (triggers.reduce((acc, t) => acc + t.offsetHeight, 0)),
        pin: true,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
           // Ensure the correct starting items are visible if at the very top
           if (self.progress === 0 && leftItems[0]) {
              gsap.set(leftItems[0], { autoAlpha: 1, yPercent: 0, overwrite: true });
              gsap.set(centerItems[0], { autoAlpha: 1, yPercent: 0, overwrite: true });
              gsap.set(bgItems[0], { autoAlpha: 1, scale: 1, zIndex: 2, overwrite: true });
           }
        }
      });

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
            invalidateOnRefresh: true,
            // Ensure synchronization even on rapid jumps
            onRefresh: (self) => {
               if (self.progress > 0 && self.progress < 1) {
                  // Active state logic handled by the timeline
               }
            }
          }
        })
        .to([leftItems[i], centerItems[i]], {
          yPercent: -100, autoAlpha: 0, duration: 1, ease: "power2.inOut", immediateRender: false
        })
        .to([leftItems[next], centerItems[next]], {
          yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut", immediateRender: false
        }, "<")
        .fromTo(bgItems[next],
          { scale: 1.5, autoAlpha: 0, zIndex: next + 5 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "power2.out", immediateRender: false },
          "<"
        );
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
      scale: 1.8,
      duration: 2,
      ease: "power2.inOut",
    })
    .call(() => tabMenu.classList.add("choose-text"), null, ">")
    .to({}, { duration: 1.5 })
    .call(() => tabMenu.classList.remove("choose-text"), null, ">")
    .to(tabMenu, { autoAlpha: 0, duration: 0.3, ease: "power1.out" })
    .set(tabMenu, { bottom: "5%", left: "50%", xPercent: -50, yPercent: 0, scale: 1 })
    .to(tabMenu, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    
    tabTl.eventCallback("onUpdate", () => {
       const progress = tabTl.progress();
       if (progress > 0.3 && progress < 0.8) {
          tabMenu.classList.add("choose-text");
       } else {
          tabMenu.classList.remove("choose-text");
       }
    });
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
          autoAlpha: 1,
          scale: 1,
          duration: 2,
          ease: "none"
        });

        tl.to(card, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.2");
        tl.to(colLogo, { clipPath: `inset(0% ${prcnt}% 0% 0%)`, duration: 1, ease: "power2.out" }, "-=0.4");
      };

      [4, 2, 3, 1, 5, 0].forEach((idx, i) => {
        const percentages = [80, 60, 50, 40, 30, 0];
        timelineRender(idx, percentages[i]);
      });

      tl.to(partnerText, { autoAlpha: 0, duration: 0.5, ease: "power2.out" })
        .to(partnerRLogo, { yPercent: -100, scale: 1.2, duration: 0.5, ease: "power2.out" })
        .to(partnerRLogo, { autoAlpha: 0, duration: 0.5, ease: "power2.out" }, "-=0.2")
        .to(colorLogoImg, { autoAlpha: 1, scale: 1.5, transformOrigin: "bottom center" })
        .to(colorLogoContent, { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: "power2.out" });
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

    gsap.set(heroSection, { autoAlpha: 1, overwrite: "auto" });

    gsap.to(heroSection, {
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: {
        id: "heroHideTrigger",
        trigger: tabSpaceDiv,
        start: "top bottom",
        end: "top center",
        scrub: true,
        invalidateOnRefresh: true,
        overwrite: "auto",
        onRefresh: (self) => {
           if (self.progress === 0 && self.scroll() < self.start) {
              gsap.set(heroSection, { autoAlpha: 1 });
           } else if (self.progress === 1) {
              gsap.set(heroSection, { autoAlpha: 0 });
           }
        }
      }
    });
  }

  // --- INITIALIZATION ---
  function initAll() {
    ScrollTrigger.getAll().forEach(st => st.kill());
    
    const activePane = document.querySelector(".w-tab-pane.w--tab-active");
    if (activePane) {
      initTabPaneAnimations(activePane);
      initMenuCenterAnimation(activePane);
      initPartnerTrackAnimation(activePane);
      initHeroHide(activePane);
    }
    
    ScrollTrigger.refresh();
  }

  setTimeout(setupAedSigns, 100);
  setTimeout(initAll, 200);

  const tabLinks = document.querySelectorAll(".w-tab-link");
  tabLinks.forEach(tab => {
    tab.addEventListener("click", () => {
      setTimeout(initAll, 950);
    });
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
});