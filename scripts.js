/* =========================================================
   NOAH'S WAX N' WRENCH
   Website JavaScript
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =======================================================
     GALLERY
     ======================================================= */

  const images = [
    "Pictures/Audi-Exhaust-Fumes-Fix.JPEG",
    "Pictures/Headlight-Restoration.JPEG",
    "Pictures/F150-Exterior.jpg",
    "Pictures/Highlander-Black-Exterior.jpg",
    "Pictures/Subaru-Center.JPEG",
    "Pictures/Kia-Trunk.JPEG",
    "Pictures/Lexus-Back-Carpet-Before-And-After.jpg",
    "Pictures/Lexus-Front-Carpet-Before-And-After.jpg",
    "Pictures/Lexus-Back-Stripes-One.jpg",
    "Pictures/Lexus-Front-Driver-And-Passenger-One.jpg",
    "Pictures/Santa-Fe-Exterior.jpg"
  ];

  const carouselImg = document.getElementById("carouselImage");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const carouselDots = document.getElementById("carouselDots");
  const carouselWrapper = document.querySelector(".carousel-image-wrapper");
  const carousel = document.querySelector(".carousel");

  let currentIndex = 0;
  let autoRotate = null;
  let isChangingImage = false;

  const AUTO_ROTATE_DELAY = 5000;

  /* -------------------------------------------------------
     Preload gallery images
     ------------------------------------------------------- */

  function preloadImages() {
    images.forEach((src) => {
      const image = new Image();
      image.src = src;
    });
  }

  /* -------------------------------------------------------
     Create carousel dots
     ------------------------------------------------------- */

  function createCarouselDots() {
    if (!carouselDots) return;

    carouselDots.innerHTML = "";

    images.forEach((src, index) => {
      const dot = document.createElement("button");

      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute(
        "aria-label",
        `View gallery image ${index + 1}`
      );

      dot.addEventListener("click", () => {
        showImage(index);
        restartCarousel();
      });

      carouselDots.appendChild(dot);
    });

    updateCarouselDots();
  }

  /* -------------------------------------------------------
     Update active dot
     ------------------------------------------------------- */

  function updateCarouselDots() {
    if (!carouselDots) return;

    const dots = carouselDots.querySelectorAll(".carousel-dot");

    dots.forEach((dot, index) => {
      const isActive = index === currentIndex;

      dot.classList.toggle("active", isActive);

      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  }

  /* -------------------------------------------------------
     Display gallery image
     ------------------------------------------------------- */

  function showImage(index, direction = 1) {
    if (!carouselImg || !images.length || isChangingImage) return;

    index = (index + images.length) % images.length;

    if (index === currentIndex && carouselImg.src) {
      updateCarouselDots();
      return;
    }

    isChangingImage = true;

    const nextSrc = images[index];
    const nextImage = new Image();

    /*
      Slight fade while the next image loads.
      This keeps the gallery from flashing or showing
      a broken image if the connection is slow.
    */

    carouselImg.style.opacity = "0";

    nextImage.onload = () => {
      carouselImg.src = nextSrc;

      carouselImg.alt =
        `Noah's Wax N' Wrench detailing work - gallery image ${index + 1} of ${images.length}`;

      currentIndex = index;

      updateCarouselDots();

      requestAnimationFrame(() => {
        carouselImg.style.opacity = "1";
      });

      /*
        Small delay prevents extremely rapid clicks
        from causing the carousel to feel glitchy.
      */
      setTimeout(() => {
        isChangingImage = false;
      }, 120);
    };

    nextImage.onerror = () => {
      console.warn(
        `Noah's Wax N' Wrench: Unable to load gallery image: ${nextSrc}`
      );

      carouselImg.style.opacity = "1";
      isChangingImage = false;

      /*
        Move past a broken image automatically instead
        of leaving the gallery stuck.
      */
      if (images.length > 1) {
        const fallbackIndex =
          (index + direction + images.length) % images.length;

        if (fallbackIndex !== index) {
          currentIndex = fallbackIndex;
          updateCarouselDots();
        }
      }
    };

    nextImage.src = nextSrc;
  }

  /* -------------------------------------------------------
     Change gallery image
     ------------------------------------------------------- */

  function changeImage(step) {
    if (!images.length) return;

    const nextIndex =
      (currentIndex + step + images.length) % images.length;

    showImage(nextIndex, step);
  }

  /* -------------------------------------------------------
     Automatic carousel
     ------------------------------------------------------- */

  function stopCarousel() {
    if (autoRotate !== null) {
      clearInterval(autoRotate);
      autoRotate = null;
    }
  }

  function startCarousel() {
    stopCarousel();

    /*
      Respect reduced-motion preferences.
      Users who have requested reduced motion won't get
      automatic gallery movement.
    */
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || images.length <= 1) {
      return;
    }

    autoRotate = setInterval(() => {
      changeImage(1);
    }, AUTO_ROTATE_DELAY);
  }

  function restartCarousel() {
    startCarousel();
  }

  /* -------------------------------------------------------
     Pause carousel while user interacts with it
     ------------------------------------------------------- */

  if (carousel) {
    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", startCarousel);

    carousel.addEventListener("focusin", stopCarousel);
    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        startCarousel();
      }
    });
  }

  /* -------------------------------------------------------
     Touch/swipe support
     ------------------------------------------------------- */

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  if (carouselWrapper) {
    carouselWrapper.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();

        stopCarousel();
      },
      { passive: true }
    );

    carouselWrapper.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];

        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        const duration = Date.now() - touchStartTime;

        /*
          A swipe must:
          - move at least 45px horizontally
          - be more horizontal than vertical
          - happen within 800ms
        */

        const isHorizontalSwipe =
          Math.abs(deltaX) > 45 &&
          Math.abs(deltaX) > Math.abs(deltaY) * 1.25 &&
          duration < 800;

        if (isHorizontalSwipe) {
          if (deltaX < 0) {
            changeImage(1);
          } else {
            changeImage(-1);
          }
        }

        startCarousel();
      },
      { passive: true }
    );
  }

  /* -------------------------------------------------------
     Previous / Next buttons
     ------------------------------------------------------- */

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      changeImage(-1);
      restartCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      changeImage(1);
      restartCarousel();
    });
  }

  /* -------------------------------------------------------
     Keyboard gallery controls
     ------------------------------------------------------- */

  document.addEventListener("keydown", (event) => {
    /*
      Only use left/right arrow keys when the gallery is
      actually being interacted with.
    */

    if (!carousel || !carousel.contains(document.activeElement)) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeImage(-1);
      restartCarousel();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      changeImage(1);
      restartCarousel();
    }
  });

  /* -------------------------------------------------------
     Pause automatic rotation when browser tab is hidden
     ------------------------------------------------------- */

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopCarousel();
    } else {
      startCarousel();
    }
  });

  /* -------------------------------------------------------
     Initialize gallery
     ------------------------------------------------------- */

  if (carouselImg && images.length) {
    carouselImg.style.transition = "opacity 0.28s ease";

    createCarouselDots();
    preloadImages();

    /*
      Make sure the first image is correctly configured.
    */
    carouselImg.src = images[0];
    carouselImg.alt =
      `Noah's Wax N' Wrench detailing work - gallery image 1 of ${images.length}`;

    currentIndex = 0;
    updateCarouselDots();

    startCarousel();
  }


  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */

  const menuButton = document.querySelector(".menu-toggle");
  const header = document.querySelector("header");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  function openMobileMenu() {
    if (!header || !menuButton) return;

    header.classList.add("menu-open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
  }

  function closeMobileMenu() {
    if (!header || !menuButton) return;

    header.classList.remove("menu-open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
  }

  function toggleMobileMenu() {
    if (!header) return;

    const isOpen = header.classList.contains("menu-open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (menuButton && header) {
    menuButton.addEventListener("click", toggleMobileMenu);

    /*
      Close the menu with Escape.
    */
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        menuButton.focus();
      }
    });

    /*
      Close the menu when clicking outside of the header.
    */
    document.addEventListener("click", (event) => {
      if (
        header.classList.contains("menu-open") &&
        !header.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });
  }

  /*
    Close mobile menu after selecting a navigation link.
  */

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  /*
    If the browser is resized back to desktop width,
    automatically close the mobile menu.
  */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMobileMenu();
    }
  });


  /* =======================================================
     QUOTE FORM
     ======================================================= */

  const quoteForm = document.getElementById("quote-form");
  const formMessages = document.getElementById("form-messages");

  if (quoteForm && formMessages) {
    let isSubmitting = false;

    quoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      /*
        Prevent accidental double-clicks or duplicate
        submissions.
      */
      if (isSubmitting) {
        return;
      }

      /*
        Use the browser's built-in validation first.
      */
      if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      const submitButton = quoteForm.querySelector(
        "button[type='submit']"
      );

      const submitArrow = submitButton
        ? submitButton.querySelector("span")
        : null;

      const originalButtonText =
        submitButton?.childNodes[0]?.textContent ||
        "Send Quote Request";

      isSubmitting = true;

      if (submitButton) {
        submitButton.disabled = true;

        /*
          Preserve the arrow <span> inside the button.
        */
        if (submitButton.childNodes[0]) {
          submitButton.childNodes[0].textContent = "Sending... ";
        }

        if (submitArrow) {
          submitArrow.textContent = "→";
        }
      }

      /*
        Show loading message.
      */

      formMessages.hidden = false;
      formMessages.className = "form-message is-loading";
      formMessages.textContent =
        "Sending your quote request...";

      /*
        Scroll the message into view if necessary.
      */

      formMessages.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      try {
        const formData = new FormData(quoteForm);

        /*
          Add the page URL so the request contains context
          about where the quote came from.
        */

        formData.append(
          "Source",
          window.location.href
        );

        const response = await fetch(quoteForm.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (response.ok) {
          formMessages.className =
            "form-message is-success";

          formMessages.textContent =
            "✓ Thank you! Your quote request has been sent. We'll be in touch soon.";

          quoteForm.reset();

          /*
            Return focus to the success message for
            screen-reader users.
          */

          formMessages.setAttribute("tabindex", "-1");
          formMessages.focus({ preventScroll: true });
        } else {
          const errorMessage =
            data.errors
              ?.map((error) => error.message)
              .filter(Boolean)
              .join(" ") ||
            "Something went wrong while sending your request. Please try again.";

          formMessages.className =
            "form-message is-error";

          formMessages.textContent = errorMessage;
        }
      } catch (error) {
        console.error(
          "Quote form submission error:",
          error
        );

        formMessages.className =
          "form-message is-error";

        formMessages.textContent =
          "We couldn't send your request right now. Please check your internet connection and try again.";
      } finally {
        isSubmitting = false;

        if (submitButton) {
          submitButton.disabled = false;

          if (submitButton.childNodes[0]) {
            submitButton.childNodes[0].textContent =
              `${originalButtonText} `;
          }

          if (submitArrow) {
            submitArrow.textContent = "→";
          }
        }
      }
    });
  }


  /* =======================================================
     SMOOTH ANCHOR NAVIGATION
     ======================================================= */

  const anchorLinks = document.querySelectorAll(
    'a[href^="#"]'
  );

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      /*
        Close mobile navigation before scrolling.
      */
      closeMobileMenu();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start"
      });

      /*
        Update the URL without causing a page jump.
      */
      if (history.replaceState) {
        history.replaceState(
          null,
          "",
          targetId
        );
      }
    });
  });


  /* =======================================================
     EXTERNAL IMAGE ERROR HANDLING
     ======================================================= */

  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      console.warn(
        `Noah's Wax N' Wrench: Image failed to load: ${img.src}`
      );

      /*
        Don't replace the gallery image here because the
        carousel has its own error handling.
      */

      if (img.id !== "carouselImage") {
        img.setAttribute(
          "data-image-error",
          "true"
        );
      }
    });
  });


  /* =======================================================
     FORM FIELD ENHANCEMENTS
     ======================================================= */

  /*
    Automatically format the phone number while typing.
  */

  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      let value = phoneInput.value.replace(/\D/g, "");

      /*
        Limit to 10 digits for a standard US number.
      */
      value = value.substring(0, 10);

      if (value.length >= 7) {
        phoneInput.value =
          `(${value.substring(0, 3)}) ` +
          `${value.substring(3, 6)}-` +
          `${value.substring(6)}`;
      } else if (value.length >= 4) {
        phoneInput.value =
          `(${value.substring(0, 3)}) ${value.substring(3)}`;
      } else if (value.length > 0) {
        phoneInput.value =
          `(${value}`;
      }
    });
  }


  /* =======================================================
     CURRENT YEAR
     ======================================================= */

  /*
    Automatically keep the copyright year current.
    This means the footer won't need to be manually
    updated every year.

    The current HTML already says 2026, but this will
    automatically update it in future years.
  */

  const footerCopyright =
    document.querySelector(".footer-bottom span");

  if (
    footerCopyright &&
    footerCopyright.textContent.includes("©")
  ) {
    const currentYear = new Date().getFullYear();

    footerCopyright.textContent =
      footerCopyright.textContent.replace(
        /©\s*\d{4}/,
        `© ${currentYear}`
      );
  }


  /* =======================================================
     INITIAL STATE
     ======================================================= */

  /*
    Make sure the mobile menu starts closed even if the
    browser restores a previous page state.
  */

  closeMobileMenu();

  /*
    Make sure the form message starts hidden.
  */

  if (formMessages) {
    formMessages.hidden = true;
  }

});
