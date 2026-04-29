document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  // Store the true original parent of the tab menu ONCE so it's never
  // incorrectly re-captured after a reparent (e.g. tab switch while in calc).
  const tabMenuTrueParent = (() => {
    const m = document.querySelector(".w-tab-menu");
    return m ? m.parentElement : null;
  })();

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
      // Ensure the main wrap and decorators stay visible
      gsap.set(q(".re-imagine_image-wrap"), { autoAlpha: 1, overwrite: true });

      // Initial state: Elements start hidden and are brought in by the timeline at time 0
      gsap.set(q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3, .tab_imagine_content_wrapper.is-01"), {
        autoAlpha: 0, overwrite: true
      });
      // Slide 2 & 3 elements (already scale 0/alpha 0 but reinforce):
      gsap.set(q(".tab_imagine_content_wrapper.is-02, .tab_imagine_content_wrapper.is-03"), {
        autoAlpha: 0, overwrite: true
      });
      gsap.set(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7, .re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"), {
        autoAlpha: 0, scale: 0, filter: "blur(0px)", overwrite: true
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
          start: "top 85%",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onLeaveBack: () => {
             // Responsive hide when scrolling back up past the start point
             gsap.set(q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3, .tab_imagine_content_wrapper.is-01"), { autoAlpha: 0 });
          },
          onRefresh: (self) => {
             // Final hide check for the 'above' state on refresh
             if (self.progress === 0 && !self.isActive) {
               gsap.set(q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3, .tab_imagine_content_wrapper.is-01"), { autoAlpha: 0 });
             }
          }
        }
      });

      // 0. Synchronized entry for Slide 1 (prevents 'stuck' blur/scale issues)
      mainTL.fromTo(q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3, .tab_imagine_content_wrapper.is-01"), 
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.1 },
        0
      );

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

      // BATCH 3: IN (Stay)
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
      // Slide 3 text moves out to make room for mobile app
      .to(q(".tab_imagine_content_wrapper.is-03"), {
        yPercent: -100, autoAlpha: 0, duration: 1, ease: "power2.inOut"
      }, 8.2);

      // MOBILE APP MOCKUP: Final Part
      mainTL.to(q(".mobile-app-container .mobile_mockup_image"), {
        yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut"
      }, ">-0.5") // Starts slightly after Batch 3 text begins moving out
      .to(q(".mobile-app-container .mobile_mocup_content"), {
        yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut"
      }, "-=0.5");

      // Parallax (Separate from mainTL for continuous effect) - Excluding UI icons
      q(".re-imagine_image-wrap img:not(.app_icons_wrapper)").forEach((img, i) => {
        gsap.to(img, {
          y: () => ((i % 3) * 0.3) * 100,
          scrollTrigger: {
            id: `tabPaneTrigger_parallax_${i}`,
            trigger: triggerEl,
            start: "top top", end: "bottom top", scrub: true
          }
        });
      });
    }

    /* Part B: Sticky Animation */
    if (hasSticky) {
      const leftItems = q(".tabs_flexbox_left");
      const centerItems = q(".tabs_flex_right_center_img");
      const bgItems = q(".tabs_flex_img");
      const triggers = q("[el-trigger]");

      // FIX: Ensure the left content wrapper is always on top of images
      gsap.set(q(".tabs_flexbox_content_wrap"), { zIndex: 100, position: "relative" });

      // Comprehensive Initial Reset
      gsap.set([leftItems, centerItems], { autoAlpha: 0, yPercent: 100, overwrite: true });
      gsap.set(bgItems, { autoAlpha: 0, scale: 1.5, zIndex: 1, overwrite: true });

      // Show first item immediately as default
      gsap.set([leftItems[0], centerItems[0]], { autoAlpha: 1, yPercent: 0 });
      gsap.set(bgItems[0], { autoAlpha: 1, scale: 1, zIndex: 2 });

      // Unified Timeline for ALL transitions ensures only one item is active at a time
      const stickyTL = gsap.timeline({
        scrollTrigger: {
          id: "tabPaneTrigger_sticky_main",
          trigger: q("[el-sticky]"),
          start: "top top",
          end: () => "+=" + (triggers.reduce((acc, t) => acc + t.offsetHeight, 0)),
          pin: true,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
             // Robust state recovery on refresh/tab-change
             if (self.progress === 0) {
               gsap.set([leftItems[0], centerItems[0]], { autoAlpha: 1, yPercent: 0 });
               gsap.set(leftItems.slice(1), { autoAlpha: 0, yPercent: 100 });
               gsap.set(bgItems[0], { autoAlpha: 1, scale: 1 });
               gsap.set(bgItems.slice(1), { autoAlpha: 0 });
             } else if (self.progress === 1) {
               const last = leftItems.length - 1;
               gsap.set([leftItems[last], centerItems[last]], { autoAlpha: 1, yPercent: 0 });
               gsap.set(leftItems.slice(0, last), { autoAlpha: 0, yPercent: -100 });
               gsap.set(bgItems[last], { autoAlpha: 1, scale: 1 });
               gsap.set(bgItems.slice(0, last), { autoAlpha: 0 });
             }
          }
        }
      });

      // Build the sequential transitions
      triggers.forEach((trigger, i) => {
        let next = i + 1;
        if (!leftItems[next]) return;

        // Define a clean transition where slide i moves out and slide next moves in
        // Using a relative duration/position ensures they are totally synced
        stickyTL.to([leftItems[i], centerItems[i]], {
          yPercent: -100, autoAlpha: 0, duration: 1, ease: "power2.inOut"
        }, i * 1.5) // Even spacing
        .to([leftItems[next], centerItems[next]], {
          yPercent: 0, autoAlpha: 1, duration: 1, ease: "power2.inOut"
        }, "<")
        .fromTo(bgItems[next],
          { scale: 1.5, autoAlpha: 0, zIndex: next + 5 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "power2.out" },
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
    tabMenu.classList.remove("choose-text", "blur-bg");

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
      scale: 1.83,
      duration: 2,
      ease: "power2.inOut",
    })
    .call(() => {
      tabMenu.classList.add("choose-text");
      tabMenu.classList.remove("blur-bg");
    }, null, ">")
    .to({}, { duration: 1.5 })
    .call(() => tabMenu.classList.remove("choose-text"), null, ">")
    .to(tabMenu, { autoAlpha: 0, duration: 0.3, ease: "power1.out" })
    .set(tabMenu, { bottom: "5%", left: "50%", xPercent: -50, yPercent: 0, scale: 1 })
    .call(() => tabMenu.classList.add("blur-bg"), null, ">")
    .to(tabMenu, { autoAlpha: 1, duration: 0.4, ease: "power2.out" });
    
    tabTl.eventCallback("onUpdate", () => {
       // Do nothing if menu has been moved into the calc section
       if (tabMenu.classList.contains("is-in-calc")) return;

       const progress = tabTl.progress();
       
       // Handle choose-text (Active between 30% and 80%)
       if (progress > 0.3 && progress < 0.8) {
          tabMenu.classList.add("choose-text");
       } else {
          tabMenu.classList.remove("choose-text");
       }

       // Handle blur-bg (Only active in bottom center stage, > 90%)
       if (progress >= 0.9) {
          tabMenu.classList.add("blur-bg");
       } else {
          tabMenu.classList.remove("blur-bg");
       }
    });

    // --- Reparenting Logic ---
    const calcSec = activePane.querySelector(".app-calc-sec");
    const calcTarget = activePane.querySelector(".calc-tabs-wrap");

    if (calcSec && calcTarget && tabMenuTrueParent) {
      // Guard: prevents multiple rapid refreshes (e.g. resize) from
      // stacking duplicate requestAnimationFrame calls
      let rAFPending = false;

      const applyCalcState = () => {
        calcTarget.appendChild(tabMenu);
        gsap.killTweensOf(tabMenu);
        tabMenu.setAttribute("style", "position: static !important; transform: none !important;");
        tabMenu.classList.add("is-in-calc");
        tabMenu.classList.remove("choose-text", "blur-bg");
        if (tabTl.scrollTrigger) tabTl.scrollTrigger.disable(false);
      };

      // skipRefresh: prevents an infinite loop when called from inside onRefresh
      const revertCalcState = (skipRefresh = false) => {
        // Always restore to TRUE original parent, never a stale reparented one
        tabMenuTrueParent.appendChild(tabMenu);
        tabMenu.removeAttribute("style");
        tabMenu.classList.remove("is-in-calc", "choose-text", "blur-bg");
        if (tabTl.scrollTrigger) {
          tabTl.scrollTrigger.enable();
          tabTl.invalidate();
          if (!skipRefresh) tabTl.scrollTrigger.refresh();
        }
      };

      ScrollTrigger.create({
        id: "menuReparentTrigger",
        trigger: calcSec,
        start: "top bottom",
        onEnter: applyCalcState,
        onLeaveBack: revertCalcState,
        onRefresh(self) {
          // Bail if a rAF is already queued — deduplicate rapid refresh calls
          if (rAFPending) return;
          rAFPending = true;
          // Defer until AFTER the full refresh cycle so menuCenterTrigger
          // can't overwrite the state we set here
          requestAnimationFrame(() => {
            rAFPending = false;
            if (self.progress > 0) {
              applyCalcState();
            } else if (tabMenu.classList.contains("is-in-calc")) {
              revertCalcState(true); // skip nested refresh to avoid loop
            }
          });
        }
      });
    }
  }


  /* ----------------------------------
    4. PARTNER TRACK ANIMATION
  ---------------------------------- */
  function initPartnerTrackAnimation(activePane) {
    if (!activePane) return;

    const partnerTracks = activePane.querySelectorAll("[data-partner-track]");
    partnerTracks.forEach((track, trackIndex) => {
      const cards = Array.from(track.querySelectorAll("img.partner-img"));
      const stickySec = track.querySelector(".partners_sticky");
      if (!stickySec || cards.length === 0) return;

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
      const stage1Card = cards[4]; // First to merge (Last image in HTML)
      const stage2Card = cards[2]; // Second to merge (3rd last image in HTML)
      const restCards = [cards[0], cards[1], cards[3]].filter(Boolean); // The rest merge together

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

      // FINAL BRANDING REVEAL (Starts after Stage 3 finishes)
      const endTime = stageDuration * 3;
      
      tl.to(partnerText, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
      }, endTime)
      .to(partnerRLogo, {
        yPercent: -100,
        scale: 1.2,
        duration: 0.5,
        ease: "power2.out",
      })
      .to(partnerRLogo, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2")
      .to(colorLogoImg, {
        autoAlpha: 1,
        scale: 1.5,
        duration: 0.5, // GSAP default fallback
        transformOrigin: "bottom center",
      })
      .to(colorLogoContent, {
        autoAlpha: 1,
        yPercent: 0,
        duration: 0.5,
        ease: "power2.out",
      });
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
           if (self.progress === 0 && !self.isActive) {
              gsap.set(heroSection, { autoAlpha: 1 });
           } else if (self.progress === 1) {
              gsap.set(heroSection, { autoAlpha: 0 });
           }
        },
        onEnterBack: () => {
           // Ensure it fades back in when scrolling up into the trigger
           gsap.set(heroSection, { autoAlpha: 1 });
        },
        onLeaveBack: () => {
           // Ensure it is fully visible when we scroll out towards the top
           gsap.set(heroSection, { autoAlpha: 1 });
        }
      }
    });
  }

  // --- INITIALIZATION ---
  function initAll() {
    ScrollTrigger.getAll().forEach(st => st.kill());

    // Before re-initializing, always reset the tab menu to its true original
    // parent and clean state. This handles tab switches while the menu was
    // reparented into the calc section — prevents stale parent bugs.
    const tabMenu = document.querySelector(".w-tab-menu");
    if (tabMenu && tabMenuTrueParent && tabMenu.parentElement !== tabMenuTrueParent) {
      tabMenuTrueParent.appendChild(tabMenu);
      tabMenu.removeAttribute("style");
      tabMenu.classList.remove("is-in-calc", "choose-text", "blur-bg");
    }
    
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