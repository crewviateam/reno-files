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

      // Use yPercent for bulletproof responsive movement without calculating pixels
      const isMobile = window.innerWidth <= 767;

      // Set initial positions
      // Start slightly lower (100-120%) so it cleanly enters the view box
      gsap.set(words, {
        yPercent: 120,
        opacity: 0,
      });

      // Added ScrollTrigger so the text animation ONLY begins when the user
      // actually scrolls the section into view. This prevents the timeline from 
      // looping off-screen and leaving a "blank" screen when they finally reach it.
      let tl = gsap.timeline({ 
        repeat: -1,
        scrollTrigger: {
          trigger: wrapper,
          start: "top 85%", // starts when wrapper enters bottom 15% of screen
        }
      });

      words.forEach((word) => {
        tl.to(word, {
          yPercent: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }).to(word, {
          yPercent: -120,
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
