document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.classList.add('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            themeToggle.classList.toggle('dark');
            // Save theme preference
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }

    // Job Application Modal Functionality
    const applicationModal = document.getElementById('applicationModal');
    const modalJobTitle = document.getElementById('modalJobTitle');
    const applicationForm = document.getElementById('applicationForm');
    const closeModalBtn = document.querySelector('.close-modal');

    // Function to open modal with job title
    window.applyForJob = function(jobTitle) {
        if (applicationModal && modalJobTitle) {
            modalJobTitle.textContent = jobTitle;
            applicationModal.style.display = 'flex';
            setTimeout(() => applicationModal.classList.add('show'), 10); // Trigger animation
        }
    };

    // Function to close modal
    window.closeModal = function() {
        if (applicationModal) {
            applicationModal.classList.remove('show');
            setTimeout(() => applicationModal.style.display = 'none', 300); // Match transition duration
        }
    };

    // Close modal on button click
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Handle form submission
    if (applicationForm) {
        applicationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('განაცხადი გაგზავნილია!');
            closeModal();
        });
    }

    // Initialize Animations for Job Cards
    const jobCards = document.querySelectorAll('.job-card');
    if (jobCards.length > 0) {
        jobCards.forEach((card, index) => {
            // Ensure animation is applied
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('animate__animated', 'animate__fadeInUp');
        });
    }
});