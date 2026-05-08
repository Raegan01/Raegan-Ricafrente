const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.88;

  revealElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      element.classList.add("active");
    }
  });
};

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

const posterTrack = document.getElementById("posterTrack");
const posterPrev = document.getElementById("posterPrev");
const posterNext = document.getElementById("posterNext");

if (posterTrack && posterPrev && posterNext) {
  let posterCards = Array.from(posterTrack.children);
  let currentIndex = 0;
  let autoSlide;

  posterCards.forEach((card) => {
    const clone = card.cloneNode(true);
    posterTrack.appendChild(clone);
  });

  function getCardStep() {
    const card = posterTrack.querySelector(".poster-card");
    const gap = parseFloat(getComputedStyle(posterTrack).gap) || 22;
    return card.offsetWidth + gap;
  }

  function movePosterCarousel() {
    const step = getCardStep();
    posterTrack.style.transform = `translateX(-${currentIndex * step}px)`;
  }

  function nextPoster() {
    currentIndex++;
    posterTrack.style.transition = "transform 0.45s ease";
    movePosterCarousel();

    if (currentIndex >= posterCards.length) {
      setTimeout(() => {
        posterTrack.style.transition = "none";
        currentIndex = 0;
        movePosterCarousel();
      }, 460);
    }
  }

  function prevPoster() {
    if (currentIndex <= 0) {
      posterTrack.style.transition = "none";
      currentIndex = posterCards.length;
      movePosterCarousel();

      setTimeout(() => {
        posterTrack.style.transition = "transform 0.45s ease";
        currentIndex--;
        movePosterCarousel();
      }, 20);
    } else {
      currentIndex--;
      posterTrack.style.transition = "transform 0.45s ease";
      movePosterCarousel();
    }
  }

  function startAutoSlide() {
    autoSlide = setInterval(nextPoster, 2500);
  }

  function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
  }

  posterNext.addEventListener("click", () => {
    nextPoster();
    resetAutoSlide();
  });

  posterPrev.addEventListener("click", () => {
    prevPoster();
    resetAutoSlide();
  });

  window.addEventListener("resize", movePosterCarousel);

  startAutoSlide();
}
