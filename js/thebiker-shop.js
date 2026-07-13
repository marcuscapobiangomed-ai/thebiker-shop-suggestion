(function () {
  "use strict";

  var menuButton = document.querySelector(".menu-btn");
  var mobileNav = document.querySelector(".mobile-nav");
  var backdrop = document.querySelector(".mobile-backdrop");
  var navLinks = document.querySelectorAll(".mobile-nav a");

  if (menuButton && mobileNav && backdrop) {
    function setOpen(isOpen) {
      mobileNav.classList.toggle("is-open", isOpen);
      backdrop.hidden = !isOpen;
      menuButton.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    function toggle() {
      setOpen(!mobileNav.classList.contains("is-open"));
    }

    menuButton.addEventListener("click", toggle);
    backdrop.addEventListener("click", function () {
      setOpen(false);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1100) {
        setOpen(false);
      }
    });
  }

  var heroCarousel = document.querySelector("[data-hero-carousel]");

  if (heroCarousel) {
    var heroSlides = Array.prototype.slice.call(
      heroCarousel.querySelectorAll("[data-hero-slide]")
    );
    var heroDots = Array.prototype.slice.call(
      heroCarousel.querySelectorAll("[data-hero-dot]")
    );
    var heroPrev = heroCarousel.querySelector("[data-hero-prev]");
    var heroNext = heroCarousel.querySelector("[data-hero-next]");
    var heroIndex = Math.max(
      0,
      heroSlides.findIndex(function (slide) {
        return slide.classList.contains("is-active");
      })
    );
    var heroTimer = null;
    var heroPaused = false;
    var heroReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (heroIndex < 0) {
      heroIndex = 0;
    }

    function setHeroIndex(nextIndex) {
      heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;

      heroSlides.forEach(function (slide, index) {
        var active = index === heroIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });

      heroDots.forEach(function (dot, index) {
        var active = index === heroIndex;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    function go(delta) {
      setHeroIndex(heroIndex + delta);
    }

    function stopHeroTimer() {
      if (heroTimer) {
        window.clearInterval(heroTimer);
        heroTimer = null;
      }
    }

    function startHeroTimer() {
      stopHeroTimer();

      if (heroReducedMotion || heroSlides.length < 2) {
        return;
      }

      heroTimer = window.setInterval(function () {
        if (!heroPaused) {
          go(1);
        }
      }, 7000);
    }

    if (heroPrev) {
      heroPrev.addEventListener("click", function () {
        go(-1);
      });
    }

    if (heroNext) {
      heroNext.addEventListener("click", function () {
        go(1);
      });
    }

    heroDots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        setHeroIndex(index);
      });
    });

    heroCarousel.addEventListener("mouseenter", function () {
      heroPaused = true;
    });

    heroCarousel.addEventListener("mouseleave", function () {
      heroPaused = false;
    });

    heroCarousel.addEventListener("focusin", function () {
      heroPaused = true;
    });

    heroCarousel.addEventListener("focusout", function () {
      heroPaused = false;
    });

    document.addEventListener("visibilitychange", function () {
      heroPaused = document.hidden;
    });

    setHeroIndex(heroIndex);
    startHeroTimer();
  }
})();
