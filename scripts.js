/* =========================================================
   NOAH'S WAX N' WRENCH
   Website JavaScript
   ========================================================= */


/* =========================================================
   GALLERY
   ========================================================= */

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

let currentIndex = 0;
let autoRotate = null;

const carouselImg = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const carouselDots = document.getElementById("carouselDots");


function createCarouselDots() {

  if (!carouselDots) return;

  carouselDots.innerHTML = "";

  images.forEach((_, index) => {

    const dot = document.createElement("button");

    dot.type = "button";

    dot.className = "carousel-dot";

    dot.setAttribute(
      "aria-label",
      `View image ${index + 1}`
    );

    dot.addEventListener("click", () => {

      currentIndex = index;

      showImage(currentIndex);

      startCarousel();

    });

    carouselDots.appendChild(dot);

  });

}


function updateCarouselDots() {

  if (!carouselDots) return;

  const dots =
    carouselDots.querySelectorAll(".carousel-dot");

  dots.forEach((dot, index) => {

    dot.classList.toggle(
      "active",
      index === currentIndex
    );

  });

}


function showImage(index) {

  if (!carouselImg) return;

  carouselImg.style.opacity = "0";

  const nextImage = new Image();

  nextImage.src = images[index];

  nextImage.onload = () => {

    carouselImg.src = images[index];

    carouselImg.alt =
      `Noah's Wax N' Wrench detailing work - image ${index + 1}`;

    carouselImg.style.opacity = "1";

  };

  updateCarouselDots();

}


function changeImage(step) {

  currentIndex =
    (currentIndex + step + images.length) %
    images.length;

  showImage(currentIndex);

}


function startCarousel() {

  clearInterval(autoRotate);

  autoRotate = setInterval(() => {

    changeImage(1);

  }, 5000);

}


/* =========================================================
   QUOTE FORM
   ========================================================= */

function setupQuoteForm() {

  const form =
    document.getElementById("quote-form");

  const formMessages =
    document.getElementById("form-messages");

  if (!form || !formMessages) return;


  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const submitButton =
      form.querySelector(
        "button[type='submit']"
      );


    const originalButtonText =
      submitButton
        ? submitButton.textContent
        : "Send Quote Request";


    /*
      Basic browser validation.
    */

    if (!form.checkValidity()) {

      form.reportValidity();

      return;

    }


    if (submitButton) {

      submitButton.disabled = true;

      submitButton.textContent =
        "Sending...";

    }


    formMessages.style.display = "block";

    formMessages.style.color =
      "#aeb6bd";

    formMessages.textContent =
      "Sending your quote request...";


    const formData =
      new FormData(form);


    try {

      const response =
        await fetch(
          form.action,
          {
            method: "POST",

            body: formData,

            headers: {
              Accept: "application/json"
            }
          }
        );


      if (response.ok) {

        formMessages.style.color =
          "#66ccff";

        formMessages.textContent =
          "✓ Thank you! Your quote request has been sent. We'll be in touch soon.";

        form.reset();

      } else {

        let data = {};

        try {

          data =
            await response.json();

        } catch {

          data = {};

        }


        formMessages.style.color =
          "#ffb86b";


        formMessages.textContent =
          data.errors
            ?.map(error => error.message)
            .join(", ") ||
          "Something went wrong. Please try again.";

      }

    } catch (error) {

      formMessages.style.color =
        "#ff7b7b";

      formMessages.textContent =
        "Network error. Please try again or contact us directly.";

    }


    if (submitButton) {

      submitButton.disabled = false;

      submitButton.textContent =
        originalButtonText;

    }

  });

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

function setupMobileNavigation() {

  const menuButton =
    document.querySelector(".menu-toggle");

  const header =
    document.querySelector("header");

  const mobileLinks =
    document.querySelectorAll(
      ".mobile-nav a"
    );


  if (!menuButton || !header) return;


  menuButton.addEventListener(
    "click",
    () => {

      const isOpen =
        header.classList.toggle(
          "menu-open"
        );


      menuButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );


      menuButton.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );


      menuButton.textContent =
        isOpen ? "✕" : "☰";

    }
  );


  mobileLinks.forEach(link => {

    link.addEventListener(
      "click",
      () => {

        header.classList.remove(
          "menu-open"
        );


        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );


        menuButton.setAttribute(
          "aria-label",
          "Open navigation menu"
        );


        menuButton.textContent =
          "☰";

      }
    );

  });

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Gallery
    */

    if (carouselImg) {

      carouselImg.style.transition =
        "opacity 0.25s ease";

      createCarouselDots();

      showImage(currentIndex);

      startCarousel();


      /*
        Pause automatic rotation while
        the user is interacting with it.
      */

      carouselImg.addEventListener(
        "mouseenter",
        () => clearInterval(autoRotate)
      );


      carouselImg.addEventListener(
        "mouseleave",
        startCarousel
      );

    }


    if (prevBtn) {

      prevBtn.addEventListener(
        "click",
        () => {

          changeImage(-1);

          startCarousel();

        }
      );

    }


    if (nextBtn) {

      nextBtn.addEventListener(
        "click",
        () => {

          changeImage(1);

          startCarousel();

        }
      );

    }


    /*
      Quote form
    */

    setupQuoteForm();


    /*
      Mobile navigation
    */

    setupMobileNavigation();

  }
);
