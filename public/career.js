function CareerSecAnimation() {
  document.addEventListener("DOMContentLoaded", function () {
    // Small delay to ensure GSAP is fully loaded
    setTimeout(() => {
      if (typeof gsap === "undefined" || typeof Flip === "undefined") {
        console.error("GSAP or Flip plugin not loaded properly");
        return;
      }

      console.log("career start running 12...");

      gsap.registerPlugin(ScrollTrigger);

      const wrapper = document.querySelector(".career-revolving-text-wrapper");
      const textContainer = document.querySelector(".career-revolving-text");
      const words = textContainer.querySelectorAll("span");

      // On mobile (<= 767), wrapper.offsetHeight might be unusually large (e.g. elements wrapping),
      // which causes the text to move from far below, appear late, and move suddenly.
      // We clamp/override the distance for mobile layouts to match local text height.
      const isMobile = window.innerWidth <= 767;
      let moveDist = wrapper.offsetHeight;
      if (isMobile) {
        moveDist = words.length > 0 && words[0].offsetHeight > 0 ? words[0].offsetHeight * 1.2 : 50;
        // Cap the distance max to prevent any strange calculations
        if (moveDist > 80) moveDist = 50;
      }

      console.log("career moveDist", moveDist);

      // Set initial positions
      gsap.set(words, {
        y: moveDist,
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
          y: -moveDist,
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
