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
let autoRotate;

const carouselImg = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showImage(index) {
  if (!carouselImg) return;

  carouselImg.style.opacity = "0";

  setTimeout(() => {
    carouselImg.src = images[index];
    carouselImg.alt = `Sussex Auto Detailing work - image ${index + 1}`;

    carouselImg.onload = () => {
      carouselImg.style.opacity = "1";
    };
  }, 120);
}

function changeImage(step) {
  currentIndex =
    (currentIndex + step + images.length) % images.length;

  showImage(currentIndex);
}

function startCarousel() {
  clearInterval(autoRotate);

  autoRotate = setInterval(() => {
    changeImage(1);
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------
     Gallery
  --------------------------------------------- */

  if (carouselImg) {
    carouselImg.style.transition = "opacity 0.2s ease";
    showImage(currentIndex);
  }

  prevBtn?.addEventListener("click", () => {
    changeImage(-1);
    startCarousel();
  });

  nextBtn?.addEventListener("click", () => {
    changeImage(1);
    startCarousel();
  });

  startCarousel();


  /* ---------------------------------------------
     Quote Form
  --------------------------------------------- */

  const form = document.getElementById("quote-form");
  const formMessages = document.getElementById("form-messages");

  if (form && formMessages) {

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const submitButton = form.querySelector("button[type='submit']");
      const originalButtonText = submitButton?.textContent;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      formMessages.style.display = "block";
      formMessages.style.color = "#aeb6bd";
      formMessages.textContent = "Sending your quote request...";

      const formData = new FormData(form);

      try {

        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json"
          }
        });

        if (response.ok) {

          formMessages.style.color = "#66ccff";
          formMessages.textContent =
            "✓ Thank you! Your quote request has been sent. We'll be in touch soon.";

          form.reset();

        } else {

          let data = {};

          try {
            data = await response.json();
          } catch {
            data = {};
          }

          formMessages.style.color = "#ffb86b";

          formMessages.textContent =
            data.errors?.map(error => error.message).join(", ") ||
            "Something went wrong. Please try again.";
        }

      } catch {

        formMessages.style.color = "#ff7b7b";

        formMessages.textContent =
          "Network error. Please try again or contact us directly.";
      }

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    });
  }


  /* ---------------------------------------------
     Mobile Navigation
  --------------------------------------------- */

  const menuToggleBtn =
    document.querySelector(".header-buttons > button");

  const headerButtons =
    document.querySelector(".header-buttons");

  if (menuToggleBtn && headerButtons) {

    menuToggleBtn.setAttribute("aria-expanded", "false");

    menuToggleBtn.addEventListener("click", () => {

      const isOpen =
        headerButtons.classList.toggle("open");

      menuToggleBtn.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );

      menuToggleBtn.innerHTML =
        isOpen ? "&#10005;" : "&#9776;";
    });


    const menuLinks =
      headerButtons.querySelectorAll("ul li a.button");

    menuLinks.forEach(link => {

      link.addEventListener("click", () => {

        headerButtons.classList.remove("open");

        menuToggleBtn.setAttribute(
          "aria-expanded",
          "false"
        );

        menuToggleBtn.innerHTML = "&#9776;";
      });

    });
  }

});
