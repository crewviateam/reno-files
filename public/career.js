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

            const lineHeight = wrapper.offsetHeight;

            console.log("lineHeight", lineHeight);

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