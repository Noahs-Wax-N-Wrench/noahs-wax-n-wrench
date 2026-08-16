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
  "Pictures/Lexus-Front-Driver-And-Passenger-One.jpg",
];


const imageDescriptions = [
  "Tesla White Exterior Detailing in Menomonee Falls, WI",
  "Engine bay cleaning before and after comparison",
  "Noah's Wax N' Wrench Owner replacing parts on a car",
  "Starter replacement and part replacement at Noah's Wax N' Wrench",
  "Interior Detailing results driver seat",
  "Exterior car wash at Noah's Wax N' Wrench in Menomonee Falls, WI",
  "Luxury vehicle interior detailing Menomonee Falls, WI",
  "Mini Cooper professional detailing",
  "Car wash and polishing in Waukesha County",
  "Audi detailing and exhaust repair work by Noah's Wax N' Wrench",
  "Headlight restoration by Noah's Wax N' Wrench",
  "Professionally detailed Ford F-150",
  "Professionally detailed black Toyota Highlander",
  "Subaru interior detailing by Noah's Wax N' Wrench",
  "Kia trunk detailing by Noah's Wax N' Wrench",
  "Lexus front driver and passenger area detailing",
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


/* ---------------------------------------------------------
   Preload images
   --------------------------------------------------------- */

images.forEach((src) => {

  const img = new Image();

  img.src = src;

});


/* ---------------------------------------------------------
   Create gallery dots
   --------------------------------------------------------- */

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

    dot.addEventListener("click", () => {

      showImage(index);
      restartGallery();

    });

    carouselDots.appendChild(dot);

  });

}


/* ---------------------------------------------------------
   Update dots
   --------------------------------------------------------- */

function updateGalleryDots() {

  if (!carouselDots) {
    return;
  }

  const dots =
    carouselDots.querySelectorAll(
      ".carousel-dot"
    );

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentImage
    );

  });

}


/* ---------------------------------------------------------
   Show gallery image
   --------------------------------------------------------- */

function showImage(index) {

  if (!carouselImage || galleryChanging) {
    return;
  }

  currentImage =
    (index + images.length) % images.length;

  galleryChanging = true;

  carouselImage.classList.add(
    "is-changing"
  );

  const nextSrc =
    images[currentImage];

  const nextAlt =
    imageDescriptions[currentImage];


  setTimeout(() => {

    carouselImage.src = nextSrc;
    carouselImage.alt = nextAlt;


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


/* ---------------------------------------------------------
   Change image
   --------------------------------------------------------- */

function changeImage(step) {

  showImage(
    currentImage + step
  );

}


/* ---------------------------------------------------------
   Gallery timer
   --------------------------------------------------------- */

function startGallery() {

  stopGallery();

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

  startGallery();

}


/* ---------------------------------------------------------
   Gallery buttons
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   Keyboard controls
   --------------------------------------------------------- */

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

      changeImage(-1);
      restartGallery();

    }


    if (event.key === "ArrowRight") {

      changeImage(1);
      restartGallery();

    }

  }
);


/* ---------------------------------------------------------
   Swipe controls
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   Initialize gallery
   --------------------------------------------------------- */

createGalleryDots();
updateGalleryDots();
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


function showReview(index) {

  if (!reviewCards.length) {
    return;
  }

  currentReview =
    (index + reviewCards.length) %
    reviewCards.length;


  reviewCards.forEach(
    (card, cardIndex) => {

      card.classList.toggle(
        "active",
        cardIndex === currentReview
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

        dot.classList.toggle(
          "active",
          dotIndex === currentReview
        );

      }
    );

  }

}


function startReviews() {

  stopReviews();

  if (reviewCards.length <= 1) {
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


/* ---------------------------------------------------------
   Multi-service selection
   --------------------------------------------------------- */

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

    serviceSelection.classList.toggle(
      "has-error",
      false
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


/* ---------------------------------------------------------
   Service validation
   --------------------------------------------------------- */

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

  }


  if (serviceSelection) {

    serviceSelection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }

  return false;

}


/* ---------------------------------------------------------
   Form messages
   --------------------------------------------------------- */

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


/* ---------------------------------------------------------
   Form submission
   --------------------------------------------------------- */

if (quoteForm) {

  quoteForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      hideFormMessage();


      /*
        First make sure at least one
        service has been selected.
      */

      if (!validateServices()) {

        return;

      }


      /*
        Let native browser validation
        handle required fields.
      */

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


      /*
        Convert the selected services
        into one clean Formspree field.
      */

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


          formMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
          });


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
            /*
              Use default error message.
            */
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
          behavior: "smooth",
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

const prefersReducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );


if (prefersReducedMotion.matches) {

  stopGallery();
  stopReviews();

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
