const images = [
  "Pictures/Lexus-Back-Carpet-Before-And-After.jpg",
  "Pictures/Lexus-Front-Carpet-Before-And-After.jpg",
  "Pictures/Lexus-Back-Stripes-One.jpg",
  "Pictures/Lexus-Front-Driver-And-Passenger-One.jpg",
  "Pictures/Clear-Coat-Scratch-Before-and-After.jpeg",
  "Pictures/Kia-Front-Before-and-After.jpeg",
  "Pictures/Kia-Backseat-Before-and-After.jpeg",
  "Pictures/Lexus-Back-Before-and-After.jpg",
  "Pictures/Lexus-Front-Before-and-After.png",
];

let currentIndex = 0;
const carouselImg = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

function showImage(index) {
  if (carouselImg) {
    carouselImg.src = images[index];
    carouselImg.alt = `Detailing image ${index + 1}`;
  }
}

function changeImage(step) {
  currentIndex = (currentIndex + step + images.length) % images.length;
  showImage(currentIndex);
}

document.addEventListener("DOMContentLoaded", () => {
  showImage(currentIndex);

  prevBtn?.addEventListener("click", () => changeImage(-1));
  nextBtn?.addEventListener("click", () => changeImage(1));
  setInterval(() => changeImage(1), 5000);

  const form = document.getElementById("quote-form");
  const formMessages = document.getElementById("form-messages");

  if (form && formMessages) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        formMessages.style.display = "block";

        if (response.ok) {
          formMessages.style.color = "lightgreen";
          formMessages.textContent = "✅ Thank you! Your quote request has been sent.";
          form.reset();
        } else {
          const data = await response.json();
          formMessages.style.color = "orange";
          formMessages.textContent = data.errors?.map(e => e.message).join(", ") || "⚠️ Something went wrong.";
        }
      } catch {
        formMessages.style.display = "block";
        formMessages.style.color = "red";
        formMessages.textContent = "❌ Network error. Please try again later.";
      }
    });
  }

  // --- Mobile Dropdown Menu Toggle ---
  const menuToggleBtn = document.querySelector('.header-buttons > button');
  const headerButtons = document.querySelector('.header-buttons');

  if (menuToggleBtn && headerButtons) {
    menuToggleBtn.addEventListener('click', () => {
      headerButtons.classList.toggle('open');
    });

    // Optional: Close menu when clicking a link (mobile UX)
    const menuLinks = headerButtons.querySelectorAll('ul li a.button');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        headerButtons.classList.remove('open');
      });
    });
  }
});
