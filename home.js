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
    console.log("GallerySecAnimation Running 11 newww...");
    setTimeout(() => {
        if (typeof gsap === "undefined") {
            console.error("GSAP or Flip plugin not loaded properly");
            return;
        }

        const gallerySec = document.querySelector("[data-image-block-sec]");

        const galleryImages = gallerySec.querySelectorAll(
            ".gallery-grid .main-gallery-image"
        );
        for (let i = 0; i < galleryImages.length; i++) {
            const image = galleryImages[i];
            image.dataset.index = i;
        }

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

        const heroZoom = gallerySec.querySelector(".home-gallery-hero-img");

        const middleImages = [
            images[10],
            images[11],
            images[12],
            images[13],
            images[18],
            images[19],
            images[21],
        ];

        const isMobile = window.innerWidth <= 768;

        const galTl = gsap.timeline({
            scrollTrigger: {
                trigger: gallerySec,
                start: "700px 80%",
                end: "bottom bottom",
                markers: false,
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
                ease: "power2.out",
            },
            "-=0.5"
        );

        galTl.add(() => {
            const rect = animImage[0].getBoundingClientRect();
            heroZoom.style.width = rect.width + "px";
            heroZoom.style.height = rect.height + "px";
            heroZoom.style.top = rect.top + "px";
            heroZoom.style.left = rect.left + "px";
            heroZoom.style.transform = "none";
        }, 0.695);

        galTl.to(
            heroZoom,
            {
                opacity: 1,
                duration: 0.005,
            },
            0.695
        );

        galTl.to(middleImages, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
        });

        const xValue = isMobile ? "0%" : "-50.9715%";
        const yValue = isMobile ? "-82.3026%" : "-50.9715%";
        const widthValue = isMobile ? "100vw" : "49.981vw";

        galTl.to(
            animImage,
            {
                width: widthValue,
                height: "53.9896vH",
                x: xValue,
                y: yValue,
                duration: 2,
                transformOrigin: "84% 100%",
                ease: "power2.out",
            },
            "-=0.5"
        );

        const yValue2 = isMobile ? "-71.9715%" : "-54.9715%";

        galTl.to(animImage, {
            width: "100vw",
            height: "110vh",
            y: yValue2,
            duration: 0.5,
            transformOrigin: "84% 100%",
            ease: "power2.out",
        });

        // for (let i = 0; i < images.length; i++) {
        //   if (i !== 20) {
        //     galTl.to(
        //       images[i],
        //       {
        //         opacity: 0,
        //         ease: "power2.out",
        //       },
        //       "-=0.5"
        //     );
        //   }
        // }

        galTl.to(sText, {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
        });

        galTl.to(textarea, {
            opacity: 1,
            scale: 1,
            ease: "power2.out",
        });
        galTl.to(textarea, {
            opacity: 1,
            scale: 1,
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

// function designerSlider() {
//   const designerMainSlider = document.querySelector("[designer-main-slider]");
//   const designerPaginationSlider = document.querySelector(
//     "[designer-pagination-slider]"
//   );

//   const designerPaginationSliderConfig = new Swiper(designerPaginationSlider, {
//     direction: "vertical",
//     slidesPerView: 4,
//     initialSlide: 2,
//     centeredSlides: true,
//     spaceBetween: 20,
//     watchSlidesProgress: true,
//     slideToClickedSlide: true,
//   });

//   const designerMainSliderConfig = new Swiper(designerMainSlider, {
//     slidesPerView: 1,
//     spaceBetween: 10,
//     effect: "fade",
//     fadeEffect: { crossFade: true },

//     thumbs: {
//       swiper: designerPaginationSliderConfig,
//     },
//     on: {
//       slideChange: function () {
//         designerPaginationSliderConfig.slideTo(this.activeIndex);
//       },
//     },
//   });

//   designerPaginationSliderConfig.on("click", function () {
//     if (this.clickedIndex !== undefined) {
//       this.slideTo(this.clickedIndex);
//     }
//   });
// }

// designerSlider();

function designerSlider() {
    const designerMainSlider = document.querySelector("[designer-main-slider]");
    const designerPaginationSlider = document.querySelector(
        "[designer-pagination-slider]"
    );

    if (!designerMainSlider || !designerPaginationSlider) return;

    const designerPaginationSliderConfig = new Swiper(designerPaginationSlider, {
        direction: "vertical",
        slidesPerView: 4,
        centeredSlides: true,
        spaceBetween: 20,

        loop: true,
        loopedSlides: 6, // >= total slides

        watchSlidesProgress: true,
        slideToClickedSlide: true,
    });

    const designerMainSliderConfig = new Swiper(designerMainSlider, {
        slidesPerView: 1,
        spaceBetween: 10,

        loop: true,
        loopedSlides: 6,

        effect: "fade",
        fadeEffect: { crossFade: true },

        thumbs: {
            swiper: designerPaginationSliderConfig,
        },

        on: {
            slideChange: function () {
                designerPaginationSliderConfig.slideToLoop(this.realIndex);
            },
        },
    });

    designerPaginationSliderConfig.on("click", function () {
        if (this.clickedIndex !== undefined) {
            designerMainSliderConfig.slideToLoop(this.clickedIndex);
        }
    });
}

designerSlider();

function collabAnimation() {
    console.log("collabAnimation Running 223...");
    setTimeout(() => {
        if (typeof gsap === "undefined") {
            console.error("GSAP or Flip plugin not loaded properly");
            return;
        }

        const collabSec = document.querySelector("[data-collab-anim]");

        const PaginationSlider = collabSec.querySelector(
            ".designer-pagination-slider-container"
        );
        const PaginationSliderImage = collabSec.querySelectorAll(
            ".designer-pagination-slider-container .designer-pagination-image"
        );
        const text = collabSec.querySelector("[data-collab-element='text']");
        const mainSlider = collabSec.querySelector(
            "[data-collab-element='main-slider']"
        );

        const collabTl = gsap.timeline({
            scrollTrigger: {
                trigger: collabSec,
                start: "10% top",
                end: "bottom bottom",
                scrub: 2,
                markers: true,
                toggleClass: {
                    targets: PaginationSlider,
                    className: "active",
                },
            },
        });

        collabTl.to(text, {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            ease: "power2.out",
        });

        collabTl.to(
            PaginationSlider,
            {
                left: "8em",
                top: "50%",
                rotate: "0deg",
                x: "0%",
                y: "-50%",
                ease: "power2.out",
            },
            "-=0.3"
        );

        collabTl.to(
            PaginationSliderImage,
            {
                rotate: "0deg",
                scale: 1,
                duration: 0.2,
            },
            "-=0.4"
        );

        collabTl.to(
            mainSlider,
            {
                opacity: 1,
                scale: 1,
                ease: "power2.out",
            },
            "-=0.3"
        );
        collabTl.to(
            mainSlider,
            {
                opacity: 1,
                scale: 1,
                ease: "power2.out",
            },
            "-=0.2"
        );
        collabTl.to(
            mainSlider,
            {
                opacity: 1,
                scale: 1,
                ease: "power2.out",
            },
            "-=0.2"
        );
    }, 10);
}

const isMobile = window.innerWidth <= 768;

if (!isMobile) {
    collabAnimation();
}

initHeroSliders();