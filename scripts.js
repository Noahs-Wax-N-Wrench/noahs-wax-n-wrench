const images = [
  "Pictures/Kia-Front-Before-and-After.jpeg",
  "Pictures/Kia-Backseat-Before-and-After.jpeg",
  "Pictures/Lexus Back Before and After.jpg",
  "Pictures/Clear Coat Scratch Before and After.jpeg"
];

let currentIndex = 0;
const imgElement = document.getElementById("carouselImage");

function showImage(index) {
  imgElement.src = images[index];
}

function nextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
}

function prevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
}

// Initial image load
showImage(currentIndex);

// Auto-rotate every 5 seconds
setInterval(nextImage, 5000);

document.getElementById("nextBtn").addEventListener("click", nextImage);
document.getElementById("prevBtn").addEventListener("click", prevImage);

// Form submission with fetch
const form = document.getElementById("quote-form");
const formMessages = document.getElementById("form-messages");

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      formMessages.style.display = "block";
      formMessages.style.color = "lightgreen";
      formMessages.innerText = "✅ Thank you! Your quote request has been sent.";
      form.reset();
    } else {
      const data = await response.json();
      formMessages.style.display = "block";
      formMessages.style.color = "orange";
      formMessages.innerText = data.errors
        ? data.errors.map(e => e.message).join(", ")
        : "⚠️ Something went wrong. Please try again.";
    }
  } catch (error) {
    formMessages.style.display = "block";
    formMessages.style.color = "red";
    formMessages.innerText = "❌ Network error. Please try again later.";
  }
});
