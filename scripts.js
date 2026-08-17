/* =========================================================
   NOAH'S WAX N' WRENCH
   Website JavaScript
   ========================================================= */


/* =========================================================
   GALLERY
   ========================================================= */

const images = [
  "Pictures/Tesla-Exterior.jpg",
  "Pictures/Engine-Bay-Side-by-Side.jpg",
  "Pictures/Infiniti-In-Action.jpg",
  "Pictures/Infiniti-Parts.jpg",
  "Pictures/Starters.jpg",
  "Pictures/Subaru-Driver-Seat.jpg",
  "Pictures/Subaru-Suds.jpg",
  "Pictures/Mini-Cooper-Front.jpg",
  "Pictures/Mini-Cooper-Interior.jpg",
  "Pictures/RAV4-Suds.jpg",
  "Pictures/Audi-Exhaust-Fumes-Fix.JPEG",
  "Pictures/Headlight-Restoration.JPEG",
  "Pictures/F150-Exterior.jpg",
  "Pictures/Highlander-Black-Exterior.jpg",
  "Pictures/Kia-Trunk.JPEG",
  "Pictures/Lexus-Front-Driver-And-Passenger-One.jpg"
];


const imageDescriptions = [
  "Tesla white exterior detailing in Menomonee Falls, WI",
  "Engine bay cleaning before and after comparison by Noah's Wax N' Wrench",
  "Noah's Wax N' Wrench owner working on a vehicle",
  "Automotive parts replacement service by Noah's Wax N' Wrench",
  "Starter replacement service by Noah's Wax N' Wrench",
  "Professional Subaru interior detailing",
  "Professional Subaru exterior wash and detailing",
  "Mini Cooper exterior detailing by Noah's Wax N' Wrench",
  "Mini Cooper interior detailing by Noah's Wax N' Wrench",
  "Toyota RAV4 exterior wash and detailing",
  "Audi exhaust repair work by Noah's Wax N' Wrench",
  "Professional headlight restoration service",
  "Professionally detailed Ford F-150 exterior",
  "Professionally detailed black Toyota Highlander exterior",
  "Kia trunk interior detailing by Noah's Wax N' Wrench",
  "Lexus front driver and passenger interior detailing"
];


let currentImage = 0;
let galleryTimer = null;
let galleryChanging = false;


const carouselImage =
  document.getElementById("carouselImage");

const carouselDots =
  document.getElementById("carouselDots");

const prevBtn =
  document.getElementById("prevBtn");

const nextBtn =
  document.getElementById("nextBtn");

const carouselWrapper =
  document.getElementById("carouselWrapper");


/* =========================================================
   REDUCED MOTION
   ========================================================= */

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


/* =========================================================
   PRELOAD IMAGES
   ========================================================= */

images.forEach((src) => {

  const img = new Image();

  img.decoding = "async";
  img.src = src;

});


/* =========================================================
   CREATE GALLERY DOTS
   ========================================================= */

function createGalleryDots() {

  if (!carouselDots) {
    return;
  }

  carouselDots.innerHTML = "";

  images.forEach((_, index) => {

    const dot =
      document.createElement("button");

    dot.type = "button";

    dot.className = "carousel-dot";

    dot.setAttribute(
      "aria-label",
      `View gallery image ${index + 1}`
    );

    dot.setAttribute(
      "aria-current",
      index === currentImage
        ? "true"
        : "false"
    );

    dot.addEventListener("click", () => {

      showImage(index);
      restartGallery();

    });

    carouselDots.appendChild(dot);

  });

}


/* =========================================================
   UPDATE GALLERY DOTS
   ========================================================= */

function updateGalleryDots() {

  if (!carouselDots) {
    return;
  }

  const dots =
    carouselDots.querySelectorAll(
      ".carousel-dot"
    );

  dots.forEach((dot, index) => {

    const isActive =
      index === currentImage;

    dot.classList.toggle(
      "active",
      isActive
    );

    dot.setAttribute(
      "aria-current",
      isActive
        ? "true"
        : "false"
    );

  });

}


/* =========================================================
   SHOW GALLERY IMAGE
   ========================================================= */

function showImage(index) {

  if (!carouselImage || galleryChanging) {
    return;
  }

  currentImage =
    (index + images.length) % images.length;

  galleryChanging = true;


  if (prefersReducedMotion.matches) {

    carouselImage.src =
      images[currentImage];

    carouselImage.alt =
      imageDescriptions[currentImage];

    carouselImage.classList.remove(
      "is-changing"
    );

    galleryChanging = false;

    updateGalleryDots();

    return;

  }


  carouselImage.classList.add(
    "is-changing"
  );


  const nextSrc =
    images[currentImage];

  const nextAlt =
    imageDescriptions[currentImage];


  setTimeout(() => {

    carouselImage.src =
      nextSrc;

    carouselImage.alt =
      nextAlt;


    const revealImage = () => {

      carouselImage.classList.remove(
        "is-changing"
      );

      galleryChanging = false;

      updateGalleryDots();

      carouselImage.removeEventListener(
        "load",
        revealImage
      );

    };


    carouselImage.addEventListener(
      "load",
      revealImage
    );


    if (carouselImage.complete) {

      setTimeout(() => {

        carouselImage.classList.remove(
          "is-changing"
        );

        galleryChanging = false;

        updateGalleryDots();

      }, 50);

    }

  }, 250);

}


/* =========================================================
   CHANGE IMAGE
   ========================================================= */

function changeImage(step) {

  showImage(
    currentImage + step
  );

}


/* =========================================================
   GALLERY TIMER
   ========================================================= */

function startGallery() {

  stopGallery();


  if (
    prefersReducedMotion.matches ||
    images.length <= 1
  ) {
    return;
  }


  galleryTimer =
    setInterval(() => {

      if (
        document.hidden ||
        galleryChanging
      ) {
        return;
      }

      changeImage(1);

    }, 5000);

}


function stopGallery() {

  if (galleryTimer) {

    clearInterval(
      galleryTimer
    );

    galleryTimer = null;

  }

}


function restartGallery() {

  if (
    prefersReducedMotion.matches
  ) {
    return;
  }

  startGallery();

}


/* =========================================================
   GALLERY BUTTONS
   ========================================================= */

if (prevBtn) {

  prevBtn.addEventListener(
    "click",
    () => {

      changeImage(-1);
      restartGallery();

    }
  );

}


if (nextBtn) {

  nextBtn.addEventListener(
    "click",
    () => {

      changeImage(1);
      restartGallery();

    }
  );

}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    const gallery =
      document.getElementById(
        "gallery"
      );

    if (!gallery) {
      return;
    }


    const rect =
      gallery.getBoundingClientRect();

    const galleryVisible =
      rect.top < window.innerHeight &&
      rect.bottom > 0;


    if (!galleryVisible) {
      return;
    }


    if (event.key === "ArrowLeft") {

      event.preventDefault();

      changeImage(-1);
      restartGallery();

    }


    if (event.key === "ArrowRight") {

      event.preventDefault();

      changeImage(1);
      restartGallery();

    }

  }
);


/* =========================================================
   SWIPE CONTROLS
   ========================================================= */

let touchStartX = 0;
let touchStartY = 0;


if (carouselWrapper) {

  carouselWrapper.addEventListener(
    "touchstart",
    (event) => {

      const touch =
        event.changedTouches[0];

      touchStartX =
        touch.clientX;

      touchStartY =
        touch.clientY;

    },
    {
      passive: true
    }
  );


  carouselWrapper.addEventListener(
    "touchend",
    (event) => {

      const touch =
        event.changedTouches[0];

      const deltaX =
        touch.clientX - touchStartX;

      const deltaY =
        touch.clientY - touchStartY;


      if (
        Math.abs(deltaX) < 45 ||
        Math.abs(deltaX) < Math.abs(deltaY)
      ) {
        return;
      }


      if (deltaX < 0) {

        changeImage(1);

      } else {

        changeImage(-1);

      }

      restartGallery();

    },
    {
      passive: true
    }
  );

}


/* =========================================================
   INITIALIZE GALLERY
   ========================================================= */

createGalleryDots();
updateGalleryDots();

if (
  carouselImage &&
  images.length
) {

  carouselImage.src =
    images[0];

  carouselImage.alt =
    imageDescriptions[0];

}

startGallery();


/* =========================================================
   REVIEWS CAROUSEL
   ========================================================= */

const reviewCards =
  document.querySelectorAll(
    ".review-card"
  );

const reviewsDots =
  document.getElementById(
    "reviewsDots"
  );


let currentReview = 0;
let reviewTimer = null;


/* =========================================================
   CREATE REVIEW DOTS
   ========================================================= */

function createReviewDots() {

  if (!reviewsDots) {
    return;
  }

  reviewsDots.innerHTML = "";

  reviewCards.forEach((_, index) => {

    const dot =
      document.createElement("button");

    dot.type = "button";

    dot.className = "review-dot";

    dot.setAttribute(
      "aria-label",
      `View customer review ${index + 1}`
    );

    dot.setAttribute(
      "aria-current",
      index === currentReview
        ? "true"
        : "false"
    );

    dot.addEventListener(
      "click",
      () => {

        showReview(index);
        restartReviews();

      }
    );

    reviewsDots.appendChild(dot);

  });

}


/* =========================================================
   SHOW REVIEW
   ========================================================= */

function showReview(index) {

  if (!reviewCards.length) {
    return;
  }

  currentReview =
    (index + reviewCards.length) %
    reviewCards.length;


  reviewCards.forEach(
    (card, cardIndex) => {

      const isActive =
        cardIndex === currentReview;

      card.classList.toggle(
        "active",
        isActive
      );

      card.setAttribute(
        "aria-hidden",
        isActive
          ? "false"
          : "true"
      );

    }
  );


  if (reviewsDots) {

    const dots =
      reviewsDots.querySelectorAll(
        ".review-dot"
      );

    dots.forEach(
      (dot, dotIndex) => {

        const isActive =
          dotIndex === currentReview;

        dot.classList.toggle(
          "active",
          isActive
        );

        dot.setAttribute(
          "aria-current",
          isActive
            ? "true"
            : "false"
        );

      }
    );

  }

}


/* =========================================================
   REVIEW TIMER
   ========================================================= */

function startReviews() {

  stopReviews();


  if (
    prefersReducedMotion.matches ||
    reviewCards.length <= 1
  ) {
    return;
  }


  reviewTimer =
    setInterval(() => {

      if (!document.hidden) {

        showReview(
          currentReview + 1
        );

      }

    }, 6500);

}


function stopReviews() {

  if (reviewTimer) {

    clearInterval(
      reviewTimer
    );

    reviewTimer = null;

  }

}


function restartReviews() {

  if (
    prefersReducedMotion.matches
  ) {
    return;
  }

  startReviews();

}


createReviewDots();
showReview(0);
startReviews();


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle =
  document.querySelector(
    ".menu-toggle"
  );

const mobileNav =
  document.getElementById(
    "mobileNav"
  );


function closeMobileMenu() {

  if (!menuToggle || !mobileNav) {
    return;
  }

  menuToggle.setAttribute(
    "aria-expanded",
    "false"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  mobileNav.classList.remove(
    "open"
  );

}


function openMobileMenu() {

  if (!menuToggle || !mobileNav) {
    return;
  }

  menuToggle.setAttribute(
    "aria-expanded",
    "true"
  );

  menuToggle.setAttribute(
    "aria-label",
    "Close navigation menu"
  );

  mobileNav.classList.add(
    "open"
  );

}


if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    () => {

      const expanded =
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true";


      if (expanded) {

        closeMobileMenu();

      } else {

        openMobileMenu();

      }

    }
  );

}


if (mobileNav) {

  mobileNav
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMobileMenu
      );

    });

}


document.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Escape") {

      closeMobileMenu();

    }

  }
);


document.addEventListener(
  "click",
  (event) => {

    if (!mobileNav || !menuToggle) {
      return;
    }

    const clickedInsideMenu =
      mobileNav.contains(
        event.target
      );

    const clickedToggle =
      menuToggle.contains(
        event.target
      );


    if (
      !clickedInsideMenu &&
      !clickedToggle
    ) {

      closeMobileMenu();

    }

  }
);


window.addEventListener(
  "resize",
  () => {

    if (window.innerWidth > 800) {

      closeMobileMenu();

    }

  }
);


/* =========================================================
   QUOTE FORM
   ========================================================= */

const quoteForm =
  document.getElementById(
    "quote-form"
  );

const formMessage =
  document.getElementById(
    "form-messages"
  );


/* =========================================================
   MULTI-SERVICE SELECTION
   ========================================================= */

const serviceSelection =
  document.getElementById(
    "serviceSelection"
  );

const serviceInputs =
  document.querySelectorAll(
    ".service-option-input"
  );

const serviceCount =
  document.getElementById(
    "serviceCount"
  );

const serviceSelectionFooter =
  document.getElementById(
    "serviceSelectionFooter"
  );

const serviceError =
  document.getElementById(
    "serviceError"
  );


function getSelectedServices() {

  return Array.from(
    serviceInputs
  )
    .filter(
      (input) => input.checked
    )
    .map(
      (input) => input.value
    );

}


function updateServiceSelection() {

  const selectedServices =
    getSelectedServices();

  const count =
    selectedServices.length;


  if (serviceCount) {

    serviceCount.textContent =
      count;

  }


  if (serviceSelection) {

    serviceSelection.classList.remove(
      "has-error"
    );

  }


  if (serviceError) {

    serviceError.hidden =
      true;

  }


  if (serviceSelectionFooter) {

    serviceSelectionFooter.classList.toggle(
      "has-selection",
      count > 0
    );

  }

}


serviceInputs.forEach(
  (input) => {

    input.addEventListener(
      "change",
      updateServiceSelection
    );

  }
);


updateServiceSelection();


/* =========================================================
   SERVICE VALIDATION
   ========================================================= */

function validateServices() {

  const selectedServices =
    getSelectedServices();


  if (selectedServices.length > 0) {

    if (serviceError) {
      serviceError.hidden = true;
    }

    if (serviceSelection) {
      serviceSelection.classList.remove(
        "has-error"
      );
    }

    return true;

  }


  if (serviceError) {

    serviceError.hidden =
      false;

  }


  if (serviceSelection) {

    serviceSelection.classList.add(
      "has-error"
    );

    serviceSelection.scrollIntoView({
      behavior: prefersReducedMotion.matches
        ? "auto"
        : "smooth",
      block: "center"
    });

  }

  return false;

}


/* =========================================================
   FORM MESSAGES
   ========================================================= */

function showFormMessage(
  message,
  type
) {

  if (!formMessage) {
    return;
  }

  formMessage.hidden =
    false;

  formMessage.className =
    `form-message ${type}`;

  formMessage.textContent =
    message;

}


function hideFormMessage() {

  if (!formMessage) {
    return;
  }

  formMessage.hidden =
    true;

  formMessage.className =
    "form-message";

  formMessage.textContent =
    "";

}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

if (quoteForm) {

  quoteForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      hideFormMessage();


      if (!validateServices()) {

        return;

      }


      if (!quoteForm.checkValidity()) {

        quoteForm.reportValidity();

        return;

      }


      const submitButton =
        quoteForm.querySelector(
          ".form-submit"
        );


      if (!submitButton) {
        return;
      }


      const originalButtonHTML =
        submitButton.innerHTML;


      submitButton.disabled =
        true;

      submitButton.innerHTML =
        "Sending Request...";


      const formData =
        new FormData(
          quoteForm
        );


      const selectedServices =
        getSelectedServices();


      formData.set(
        "service",
        selectedServices.join(", ")
      );


      try {

        const response =
          await fetch(
            quoteForm.action,
            {
              method: "POST",

              body: formData,

              headers: {
                Accept:
                  "application/json"
              }
            }
          );


        if (response.ok) {

          showFormMessage(
            "Your quote request has been sent! We'll review your information and get back to you shortly.",
            "success"
          );


          quoteForm.reset();

          updateServiceSelection();


          submitButton.disabled =
            false;

          submitButton.innerHTML =
            originalButtonHTML;


          if (formMessage) {

            formMessage.scrollIntoView({
              behavior:
                prefersReducedMotion.matches
                  ? "auto"
                  : "smooth",
              block: "center"
            });

          }


        } else {

          let errorMessage =
            "Something went wrong while sending your request. Please try again.";


          try {

            const data =
              await response.json();


            if (
              data &&
              data.errors &&
              data.errors.length
            ) {

              errorMessage =
                data.errors
                  .map(
                    (error) =>
                      error.message
                  )
                  .join(" ");

            }

          } catch {
            /* Use default error message. */
          }


          showFormMessage(
            errorMessage,
            "error"
          );


          submitButton.disabled =
            false;

          submitButton.innerHTML =
            originalButtonHTML;

        }

      } catch (error) {

        console.error(
          "Form submission error:",
          error
        );


        showFormMessage(
          "We couldn't send your request right now. Please try again in a moment.",
          "error"
        );


        submitButton.disabled =
          false;

        submitButton.innerHTML =
          originalButtonHTML;

      }

    }
  );

}


/* =========================================================
   PHONE NUMBER FORMATTING
   ========================================================= */

const phoneInput =
  document.getElementById(
    "phone"
  );


if (phoneInput) {

  phoneInput.addEventListener(
    "input",
    () => {

      let digits =
        phoneInput.value.replace(
          /\D/g,
          ""
        );


      if (digits.length > 10) {

        digits =
          digits.substring(
            0,
            10
          );

      }


      if (digits.length > 6) {

        phoneInput.value =
          `(${digits.substring(0, 3)}) ` +
          `${digits.substring(3, 6)}-` +
          `${digits.substring(6)}`;

      } else if (digits.length > 3) {

        phoneInput.value =
          `(${digits.substring(0, 3)}) ` +
          digits.substring(3);

      } else {

        phoneInput.value =
          digits;

      }

    }
  );

}


/* =========================================================
   YEAR VALIDATION
   ========================================================= */

const yearInput =
  document.getElementById(
    "year"
  );


if (yearInput) {

  yearInput.addEventListener(
    "input",
    () => {

      yearInput.value =
        yearInput.value
          .replace(
            /\D/g,
            ""
          )
          .substring(
            0,
            4
          );

    }
  );

}


/* =========================================================
   SMOOTH ANCHOR HANDLING
   ========================================================= */

document
  .querySelectorAll(
    'a[href^="#"]'
  )
  .forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const targetId =
          link.getAttribute(
            "href"
          );


        if (
          !targetId ||
          targetId === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(
            targetId
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior:
            prefersReducedMotion.matches
              ? "auto"
              : "smooth",
          block: "start"
        });

      }
    );

  });


/* =========================================================
   VISIBILITY / PERFORMANCE
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      stopGallery();
      stopReviews();

    } else {

      startGallery();
      startReviews();

    }

  }
);


/* =========================================================
   REDUCED MOTION
   ========================================================= */

if (prefersReducedMotion.matches) {

  stopGallery();
  stopReviews();

}


if (
  typeof prefersReducedMotion.addEventListener ===
  "function"
) {

  prefersReducedMotion.addEventListener(
    "change",
    (event) => {

      if (event.matches) {

        stopGallery();
        stopReviews();

      } else {

        startGallery();
        startReviews();

      }

    }
  );

}


/* =========================================================
   DYNAMIC COPYRIGHT YEAR
   ========================================================= */

const copyrightYear =
  document.getElementById(
    "copyrightYear"
  );


if (copyrightYear) {

  copyrightYear.textContent =
    new Date().getFullYear();

}


/* =========================================================
   IMAGE ERROR HANDLING
   ========================================================= */

if (carouselImage) {

  carouselImage.addEventListener(
    "error",
    () => {

      carouselImage.classList.remove(
        "is-changing"
      );

      galleryChanging = false;

      console.error(
        "Unable to load gallery image:",
        carouselImage.src
      );

    }
  );

}
