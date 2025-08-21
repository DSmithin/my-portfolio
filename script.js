// Animate sections on scroll
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const reveal = () => {
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    });
  };

  // Initial check
  reveal();

  // Scroll event
  window.addEventListener("scroll", reveal);

  // Mobile nav toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
