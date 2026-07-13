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

  var catalogRoot = document.querySelector("[data-catalog-root]");

  if (catalogRoot) {
    var catalogCards = Array.prototype.slice.call(
      catalogRoot.querySelectorAll("[data-catalog-card]")
    );
    var catalogSearch = catalogRoot.querySelector("[data-catalog-search]");
    var catalogFilters = Array.prototype.slice.call(
      catalogRoot.querySelectorAll("[data-catalog-filter]")
    );
    var catalogCount = catalogRoot.querySelector("[data-catalog-count]");
    var catalogResults = catalogRoot.querySelector("[data-catalog-results]");
    var activeCatalogFilter = "all";

    try {
      var catalogParams = new URLSearchParams(window.location.search);
      if (catalogParams.get("brand")) {
        activeCatalogFilter = catalogParams.get("brand").toLowerCase();
      }
    } catch (error) {
      activeCatalogFilter = "all";
    }

    function setActiveFilter(filterValue) {
      activeCatalogFilter = filterValue || "all";

      catalogFilters.forEach(function (button) {
        var isActive = (button.getAttribute("data-filter") || "all") === activeCatalogFilter;
        button.classList.toggle("is-active", isActive);
      });

      applyCatalogFilters();
    }

    function applyCatalogFilters() {
      var query = catalogSearch ? catalogSearch.value.trim().toLowerCase() : "";
      var visibleCount = 0;

      catalogCards.forEach(function (card) {
        var terms = (
          (card.getAttribute("data-terms") || "") +
          " " +
          card.textContent
        ).toLowerCase();
        var matchesFilter =
          activeCatalogFilter === "all" ||
          terms.indexOf(activeCatalogFilter) !== -1;
        var matchesQuery = !query || terms.indexOf(query) !== -1;
        var visible = matchesFilter && matchesQuery;

        card.hidden = !visible;
        if (visible) {
          visibleCount += 1;
        }
      });

      if (catalogCount) {
        catalogCount.textContent = visibleCount + " itens";
      }
    }

    catalogFilters.forEach(function (button) {
      button.addEventListener("click", function () {
        setActiveFilter(button.getAttribute("data-filter") || "all");
      });
    });

    if (catalogSearch) {
      catalogSearch.addEventListener("input", applyCatalogFilters);
    }

    var catalogSearchButton = catalogRoot.querySelector(".search-button");

    if (catalogSearchButton) {
      catalogSearchButton.addEventListener("click", applyCatalogFilters);
      catalogSearchButton.addEventListener("click", function () {
        if (catalogResults) {
          window.setTimeout(function () {
            catalogResults.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            catalogResults.focus({ preventScroll: true });
          }, 0);
        }
      });
    }

    setActiveFilter(activeCatalogFilter);
  }

  var galleryRoot = document.querySelector("[data-gallery-root]");

  if (galleryRoot) {
    var galleryMain = galleryRoot.querySelector("[data-gallery-main]");
    var galleryThumbs = Array.prototype.slice.call(
      galleryRoot.querySelectorAll("[data-gallery-thumb]")
    );

    galleryThumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var source = thumb.getAttribute("data-src");
        var alt = thumb.getAttribute("data-alt") || "";

        if (galleryMain && source) {
          galleryMain.setAttribute("src", source);
          galleryMain.setAttribute("alt", alt);
        }

        galleryThumbs.forEach(function (button) {
          button.classList.toggle("is-active", button === thumb);
        });
      });
    });
  }

  var checkoutRoot = document.querySelector("[data-checkout-root]");

  if (checkoutRoot) {
    var cartItems = Array.prototype.slice.call(
      checkoutRoot.querySelectorAll("[data-cart-item]")
    );
    var subtotalEl = checkoutRoot.querySelector("[data-summary-subtotal]");
    var shippingEl = checkoutRoot.querySelector("[data-summary-shipping]");
    var discountEl = checkoutRoot.querySelector("[data-summary-discount]");
    var totalEl = checkoutRoot.querySelector("[data-summary-total]");

    function formatCurrency(value) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value);
    }

    function updateCheckoutTotals() {
      var subtotal = 0;
      var paymentMethod = checkoutRoot.querySelector(
        'input[name="payment"]:checked'
      );
      var discountRate = paymentMethod && paymentMethod.value === "pix" ? 0.05 : 0;

      cartItems.forEach(function (item) {
        var unitPrice = Number(item.getAttribute("data-unit-price") || "0");
        var qtyValue = item.querySelector("[data-qty-value]");
        var lineTotal = item.querySelector("[data-line-total]");
        var quantity = qtyValue ? Number(qtyValue.textContent || "1") : 1;
        var total = unitPrice * quantity;

        subtotal += total;

        if (lineTotal) {
          lineTotal.textContent = formatCurrency(total);
        }
      });

      var discount = subtotal * discountRate;
      var shipping = subtotal > 299 ? 0 : 29.9;
      var totalValue = subtotal - discount + shipping;

      if (subtotalEl) {
        subtotalEl.textContent = formatCurrency(subtotal);
      }

      if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? "Grátis" : formatCurrency(shipping);
      }

      if (discountEl) {
        discountEl.textContent = "- " + formatCurrency(discount);
      }

      if (totalEl) {
        totalEl.textContent = formatCurrency(totalValue);
      }
    }

    cartItems.forEach(function (item) {
      var minusButton = item.querySelector("[data-qty-minus]");
      var plusButton = item.querySelector("[data-qty-plus]");
      var qtyValue = item.querySelector("[data-qty-value]");

      function setQuantity(nextQuantity) {
        var value = Math.max(1, Math.min(9, nextQuantity));
        if (qtyValue) {
          qtyValue.textContent = String(value);
        }
        updateCheckoutTotals();
      }

      if (minusButton) {
        minusButton.addEventListener("click", function () {
          var current = qtyValue ? Number(qtyValue.textContent || "1") : 1;
          setQuantity(current - 1);
        });
      }

      if (plusButton) {
        plusButton.addEventListener("click", function () {
          var current = qtyValue ? Number(qtyValue.textContent || "1") : 1;
          setQuantity(current + 1);
        });
      }
    });

    Array.prototype.slice
      .call(checkoutRoot.querySelectorAll('input[name="payment"]'))
      .forEach(function (radio) {
        radio.addEventListener("change", updateCheckoutTotals);
      });

    updateCheckoutTotals();
  }
})();
