document.addEventListener("DOMContentLoaded", function () {
  const speakersSwiper = new Swiper(".speakers__slider", {
    slidesPerView: "auto",
    spaceBetween: 20,
    centeredSlides: false,
    loop: true,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    simulateTouch: true,
    grabCursor: true,

    touchRatio: 0.6,
    touchAngle: 45,

    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 2,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 2,
      sticky: true,
    },

    speed: 600,
    resistanceRatio: 0.6,

    breakpoints: {
      320: {
        slidesPerView: 1.05,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 3,
          sticky: true,
        },
        speed: 800,
      },
      640: {
        slidesPerView: 2,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 2,
        },
      },
      1000: {
        slidesPerView: 3,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 2,
        },
      },
    },
  });

  const partnersSwiper = new Swiper(".partners__slider", {
    slidesPerView: "auto",
    spaceBetween: 20,
    centeredSlides: false,
    loop: true,

    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    simulateTouch: true,
    grabCursor: true,

    touchRatio: 0.6,
    touchAngle: 45,

    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 2,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 2,
      sticky: true,
    },

    speed: 600,
    resistanceRatio: 0.6,

    breakpoints: {
      320: {
        slidesPerView: 1.05,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 3,
          sticky: true,
        },
        speed: 800,
      },
      640: {
        slidesPerView: 2,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 2,
        },
      },
      1000: {
        slidesPerView: 3,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 2,
        },
      },
    },
  });
  const newsSwiper = new Swiper(".news__slider", {
    slidesPerView: "auto",
    spaceBetween: 20,
    centeredSlides: false,
    loop: true,

    simulateTouch: true,
    grabCursor: true,

    touchRatio: 0.6,
    touchAngle: 45,

    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 2,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 2,
      sticky: true,
    },

    speed: 600,
    resistanceRatio: 0.6,

    breakpoints: {
      320: {
        slidesPerView: 1.05,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 3,
          sticky: true,
        },
        speed: 800,
      },
      640: {
        slidesPerView: 2,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 2,
        },
      },
      1000: {
        slidesPerView: 3,
        freeMode: {
          enabled: true,
          momentum: true,
          momentumRatio: 2,
        },
      },
    },
  });

  const advantagesSwiper = new Swiper(".advantages__slider", {
    slidesPerView: 1,
    spaceBetween: 0,
    centeredSlides: true,
    loop: true,


    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

    
    simulateTouch: true,
    grabCursor: true,
    touchRatio: 1,
    touchAngle: 45,
    allowTouchMove: true, 


    effect: "slide",
    speed: 800,
    threshold: 5, 


    longSwipes: true,
    longSwipesRatio: 0.5,
    longSwipesMs: 300,


    shortSwipes: true,
    followFinger: true,


    preventInteractionOnTransition: false,
    resistance: true,
    resistanceRatio: 0.6,

    on: {
      init: function () {
     
        this.addLineClickHandlers();
      },
      slideChange: function () {
        console.log("Текущий слайд:", this.activeIndex);
      },
    },


    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      768: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      1024: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
    },
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("advantages__line")) {
      console.log("Следующий слайд");
      advantagesSwiper.slideNext();
    }
  });
});
