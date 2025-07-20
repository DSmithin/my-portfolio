// Simple scroll animation effect for visibility of sections
window.addEventListener('scroll', function () {
    let sections = document.querySelectorAll('section');
    sections.forEach(section => {
        let rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
            section.classList.add('visible');
        } else {
            section.classList.remove('visible');
        }
    });
});
