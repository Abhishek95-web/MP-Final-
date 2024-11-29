document.addEventListener('scroll', function() {
    const loginContainer = document.getElementById('login');
    const scrollPosition = window.scrollY;

    // Check if the scroll position is greater than a certain value
    if (scrollPosition > window.innerHeight / 2) {
        loginContainer.style.opacity = 1;
        loginContainer.style.transform = 'translateY(0)';
    }
});
