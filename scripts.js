/* =========================================================
   NOAH'S WAX N' WRENCH
   Website JavaScript
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
    dot.setAttribute("aria-label", `View gallery image ${index + 1}`);

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

  carouselDots.querySelectorAll(".carousel-dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
    dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
  });
}

function showImage(index) {
  if (!carouselImg) return;

  carouselImg.style.opacity = "0";

  const nextImage = new Image();
  nextImage.src = images[index];

  nextImage.onload = () => {
    carouselImg.src = images[index];
    carouselImg.alt = `Noah's Wax N' Wrench detailing work - image ${index + 1}`;
    carouselImg.style.opacity = "1";
  };

  nextImage.onerror = () => {
    carouselImg.style.opacity = "1";
  };

  updateCarouselDots();
}

function changeImage(step) {
  currentIndex = (currentIndex + step + images.length) % images.length;
  showImage(currentIndex);
}

function startCarousel() {
  clearInterval(autoRotate);
  autoRotate = setInterval(() => changeImage(1), 5000);
}

function setupQuoteForm() {
  const form = document.getElementById("quote-form");
  const formMessages = document.getElementById("form-messages");

  if (!form || !formMessages) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("button[type='submit']");
    const originalButtonText = submitButton
      ? submitButton.textContent
      : "Send Quote Request";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    formMessages.hidden = false;
    formMessages.className = "form-message is-loading";
    formMessages.textContent = "Sending your quote request...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        formMessages.className = "form-message is-success";
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

        formMessages.className = "form-message is-error";
        formMessages.textContent =
          data.errors?.map(error => error.message).join(", ") ||
          "Something went wrong. Please try again.";
      }
    } catch {
      formMessages.className = "form-message is-error";
      formMessages.textContent =
        "Network error. Please try again or contact us directly.";
    }

    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  });
}

function setupMobileNavigation() {
  const menuButton = document.querySelector(".menu-toggle");
  const header = document.querySelector("header");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  if (!menuButton || !header) return;

  const closeMenu = () => {
    header.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    menuButton.innerHTML = "<span></span><span></span><span></span>";
  };

  menuButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");

    menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.innerHTML = isOpen
      ? "<span></span><span></span><span></span>"
      : "<span></span><span></span><span></span>";
  });

  mobileLinks.forEach(link => link.addEventListener("click", closeMenu));
}

document.addEventListener("DOMContentLoaded", () => {
  if (carouselImg) {
    carouselImg.style.transition = "opacity 0.28s ease";
    createCarouselDots();
    showImage(currentIndex);
    startCarousel();

    const pause = () => clearInterval(autoRotate);
    const resume = () => startCarousel();

    carouselImg.addEventListener("mouseenter", pause);
    carouselImg.addEventListener("mouseleave", resume);
    carouselImg.addEventListener("touchstart", pause, { passive: true });
    carouselImg.addEventListener("touchend", resume, { passive: true });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      changeImage(-1);
      startCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      changeImage(1);
      startCarousel();
    });
  }

  setupQuoteForm();
  setupMobileNavigation();
});
