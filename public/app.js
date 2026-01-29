document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. SETUP SCOPED ANIMATIONS
  const tabPanes = gsap.utils.toArray(".w-tab-pane");

  tabPanes.forEach((pane, index) => {
    // Create a selector restricted to this specific tab pane
    const q = gsap.utils.selector(pane);

    // Skip if this tab doesn't have our elements
    if (!q(".tab-section_fixed_height").length && !q("[el-sticky]").length) return;

    /* ----------------------------------
      PART A: IMAGINE ANIMATION (FIXED HEIGHT/PINNED)
    ---------------------------------- */
    if (q(".tab-section_fixed_height").length) {
      
      // --- INITIAL STATES ---
      
      // Set later text batches to hidden/off-screen
      gsap.set(q(".tab_imagine_content_wrapper.is-02, .tab_imagine_content_wrapper.is-03"), {
        yPercent: 100, opacity: 0
      });
      
      // Explicitly ensure the first batch (1-3, text 1) is visible and at rest
      gsap.set(
        q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3, .tab_imagine_content_wrapper.is-01"),
        {
          scale: 1,
          opacity: 1,
          yPercent: 0
        }
      );
      // Ensure all other images are initially hidden/scaled down
      gsap.set(q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7, .re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"), {
          scale: 0, opacity: 0
      });
      gsap.set(".mobile-app-container .mobile_mockup_image", {
          clearProps: "transform",
          yPercent: -150,
          opacity: 0
      });
      gsap.set(".mobile-app-container .mobile_mocup_content", {
          yPercent: 150,
          opacity: 0
      });


      const mainTL = gsap.timeline({
        scrollTrigger: {
          trigger: q(".tab-section_fixed_height"),
          start: "top top",
          end: "bottom bottom",
          // end: "+=500%",
          scrub: 0.5,
          // pin: true,
          // pinSpacing: true, 
          // invalidateOnRefresh: true
        }
      });
      
      // Define consistent start times for each batch sequence
      // Each batch transition now occupies exactly 3 seconds (0-3s, 3s-6s, 6s-9s)
      const batch2StartTime = 3.0; 
      const batch3StartTime = 6.0;

      const durationPerTransition = 1.0; // Consistent duration for single elements (in/out)
      const staggerDuration = 0.5; // Staggered start time between IN and OUT


      // --- BATCH 1: OUT ONLY (Starts at 0, must end by 3.0s) ---
      // We start Text 1 out early, and Images 1-3 out later, to fill the 3s window.
      mainTL.to(
        q(".tab_imagine_content_wrapper.is-01"),
        {
          yPercent: -100,
          opacity: 0,
          ease: "power2.in",
          duration: durationPerTransition
        },
        0.5 // Start Text OUT at 0.5s
      );

      mainTL.to(
        q(".re-imagine_image-1, .re-imagine_image-2, .re-imagine_image-3"),
        {
          scale: 3.5,
          opacity: 0,
          filter: "blur(20px)",
          stagger: 0.15,
          ease: "power2.in",
          duration: durationPerTransition
        },
        1.5 // Start Images OUT much later, at 1.5s, ensuring the screen is cleared around 2.5s-3.0s
      );


      // --- BATCH 2: IMAGES 4-7 & TEXT 2 (Starts at 3.0s, must end by 6.0s) ---
      mainTL
        // Text 2 IN
        .fromTo(
          q(".tab_imagine_content_wrapper.is-02"),
          { yPercent: 100, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "power2.out", duration: durationPerTransition },
          batch2StartTime // Start at 3.0s
        )
        // Images 4-7 IN
        .fromTo(
          q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7"),
          { scale: 0, opacity: 0 },
          { 
            scale: 1, 
            opacity: 1, 
            stagger: 0.15, 
            ease: "power2.out", 
            duration: durationPerTransition 
          },
          batch2StartTime + staggerDuration // Start images IN at 3.5s
        )
        // Text 2 OUT
        .to(
          q(".tab_imagine_content_wrapper.is-02"),
          {
            yPercent: -100,
            opacity: 0,
            ease: "power2.in",
            duration: durationPerTransition
          },
          batch2StartTime + 2.0 // Start text 2 OUT at 5.0s
        )
        // Images 4-7 OUT
        .to(
          q(".re-imagine_image-4, .re-imagine_image-5, .re-imagine_image-6, .re-imagine_image-7"),
          {
            scale: 3.5,
            opacity: 0,
            filter: "blur(20px)",
            stagger: 0.1,
            ease: "power2.in",
            duration: durationPerTransition
          },
          batch2StartTime + 2.2 // Start images OUT at 5.2s (Ensures everything is gone by 6.0s)
        );


      // --- BATCH 3: IMAGES 8-11 & TEXT 3 (Starts at 6.0s) ---
      mainTL
        // Text 3 IN
        .fromTo(
          q(".tab_imagine_content_wrapper.is-03"),
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power2.out",
            duration: durationPerTransition
          },
          batch3StartTime // Start at 6.0s
        )
        // Images 8-11 IN
        .fromTo(
          q(".re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"),
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            stagger: 0.15,
            ease: "power2.out",
            duration: durationPerTransition
          },
          batch3StartTime + staggerDuration // Start images IN at 6.5s
        )
        .to(q(".tab_imagine_content_wrapper.is-03"), {
              yPercent: -100,
              opacity: 0,
              duration: durationPerTransition,
              ease: "power2.inOut"
          }, batch3StartTime + 2.2)
          .to(
              q(".re-imagine_image-8, .re-imagine_image-9, .re-imagine_image-10, .re-imagine_image-11"),
              {
                scale: 3.5,
                opacity: 0,
                filter: "blur(20px)",
                stagger: 0.1,
                ease: "power2.in",
                duration: durationPerTransition
              },
              batch3StartTime + 2.2 // Start images OUT at 5.2s (Ensures everything is gone by 6.0s)
            );

      // Parallax (UNCHANGED and correct)
      q(".re-imagine_image-wrap img").forEach((img, i) => {
        gsap.to(img, {
          y: () => ((i % 3) * 0.3) * 100,
          scrollTrigger: {
            trigger: q(".tab-section_fixed_height"),
            start: "top top", end: "bottom top", scrub: true
          }
        });
      });

      mainTL.to(".mobile-app-container .mobile_mockup_image", {
          yPercent:0,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut"
      });
      mainTL.to(".mobile-app-container .mobile_mocup_content", {
          yPercent:0,
          opacity: 1,
          duration: 1,
          ease: "power2.inOut"
      }, "-=0.5");

    }

  


    /* ----------------------------------
      PART B: STICKY ANIMATION (UNCHANGED and correct)
    ---------------------------------- */
  if (q("[el-sticky]").length) {
      const leftItems = q(".tabs_flexbox_left");
      const centerItems = q(".tabs_flex_right_center_img");
      const bgItems = q(".tabs_flex_img");
      const triggers = q("[el-trigger]");
  
      // Reset
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
  
      let tl = gsap.timeline({
          scrollTrigger: {
          trigger: trigger,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
          }
      });
  
      tl.to([leftItems[i], centerItems[i]], {
          yPercent: -100,
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut"
          })
          .to([leftItems[next], centerItems[next]], {
          yPercent: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power2.inOut"
          }, "<")
          .fromTo(
          bgItems[next],
          { scale: 1.5, autoAlpha: 0, zIndex: next + 5 },
          { scale: 1, autoAlpha: 1, duration: 1, ease: "power2.out" },
          "<"
          );
      });
  
      // Sticky Pinning
      ScrollTrigger.create({
      trigger: q("[el-sticky]"),
      start: "top top",
      end: () => "+=" + (triggers.reduce((acc, t) => acc + t.offsetHeight, 0)),
      pin: true,
      pinSpacing: false,
      anticipatePin: 1
      });
  }

  

});

/* ----------------------------------
  2. SAFE REFRESH LOGIC (UNCHANGED and crucial)
---------------------------------- */
const tabLinks = document.querySelectorAll(".w-tab-link");

tabLinks.forEach(tab => {
  tab.addEventListener("click", () => {
    // Small delay to ensure Webflow's tab transition is complete before GSAP measures
    setTimeout(() => {
      PartnerTrackAnimation();
      ScrollTrigger.refresh();
    }, 500); // Changed to 500ms for safety
  });
});

});

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);
  
  const tabMenu = document.querySelector(".w-tab-menu");
  const tabSpaceDiv = document.querySelector(".tab-space-div");
  
  const tabTl = gsap.timeline({
      scrollTrigger: {
          trigger: tabSpaceDiv,
          start: "top bottom",
          end: "200% bottom",
          scrub: 0.5,
          markers: true,
      }
  });

  tabTl.to(tabMenu, {
      left: "50%",
      xPercent: -50,
      duration: 2,
      ease: "power2.inOut",
  });
  tabTl.to(tabMenu, {
      bottom: "50%",
      yPercent: -50,
      duration: 1,
      ease: "power2.inOut",
  });
  tabTl.to(tabMenu, {
      scale: 1.3,
      duration: 1,
      ease: "power2.inOut",
  });
  tabTl.to({}, { duration: 1.5 });
  tabTl.to(tabMenu, {
      bottom: "5%",
      yPercent: 0,
      duration: 1,
      ease: "power2.inOut",
  });
  tabTl.to(tabMenu, {
      scale: 1,
      duration: 1,
      ease: "power2.inOut",
  }, "-=0.5");
  // tabTl.to(tabMenu, {
  //     left: "50%",
  //     xPercent: -50,
  //     duration: 1,
  //     ease: "power2.inOut",
  // });

  
});



function PartnerTrackAnimation() {
  setTimeout(() => {
    if (typeof gsap === "undefined") {
      console.error("GSAP or Flip plugin not loaded properly");
      return;
    }

    const partnerTrack = document.querySelectorAll("[data-partner-track]");
    if (!partnerTrack) return;

    partnerTrack.forEach((track) => {
      const cards = track.querySelectorAll("img.partner-img");
      const stickySec = track.querySelector(".partners_sticky ");
      const ghostLogo = track.querySelector(".ghost-logo ");
      const colLogo = track.querySelector(".color-logo ");

      const partnerText = track.querySelector(".partner-text");
      const partnerRLogo = track.querySelector(".partner-reno-logo-container");
      const colorLogoContainer = track.querySelector(".partner-r-container");
      const colorLogoImg = track.querySelector(".one_place-image");
      const colorLogoContent = track.querySelector(".color-logo-content");

      const sectionRect = stickySec.getBoundingClientRect();
      const centerX = sectionRect.width / 2;
      const centerY = sectionRect.height / 1.5;

      // Store card animations here
      const cardAnimations = [];

      // Utility function to get transform values for a card
      const getXandY = (img) => {
        const rect = img.getBoundingClientRect();
        const imgCenterX = rect.left + rect.width / 2 - sectionRect.left;
        const imgCenterY = rect.top + rect.height / 2 - sectionRect.top;
        return { moveX: centerX - imgCenterX, moveY: centerY - imgCenterY };
      };

      // On first time, compute and store all card animations
      if (cardAnimations.length === 0) {
        cards.forEach((img) => {
          const { moveX, moveY } = getXandY(img);
          cardAnimations.push({
            x: moveX,
            y: moveY,
            opacity: 1,
            scale: 1,
            duration: 2,
          });
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
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
        // Use the precomputed animation for each card
        tl.to(cards[cardIndex], cardAnimations[cardIndex]);
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

      tl.to(partnerText, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      })
      tl.to(partnerRLogo, {
        yPercent: -100,
        scale: 1.2,
        duration: 0.5,
        ease: "power2.out",
      })
      tl.to(partnerRLogo, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2")

      tl.to(colorLogoImg, {
        opacity: 1,
        scale: 1.5,
        transformOrigin: "bottom center",
      })
      tl.to(colorLogoContent, {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
        ease: "power2.out",
      })
    });
  }, 10);
}
PartnerTrackAnimation();