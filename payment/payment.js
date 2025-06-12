document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.classList.add('dark');
    } else {
        body.classList.remove('dark-mode');
        themeToggle.classList.remove('dark');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Get URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || 'კურსის დასახელება';
    const price = urlParams.get('price') || '0';

    // Update Payment Page Content
    document.getElementById('courseTitle').textContent = decodeURIComponent(course);
    document.getElementById('coursePrice').textContent = `${price} ლარი`;

    // Payment Form Submission
    const paymentForm = document.querySelector('.submit-payment-btn');
    paymentForm.addEventListener('click', () => {
        const cardholderName = document.getElementById('cardholderName').value;
        const cardNumber = document.getElementById('cardNumber').value;
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (cardholderName && cardNumber && expiryDate && cvv) {
            alert('გადახდა წარმატებით განხორციელდა!');
            // Add actual payment processing logic here
        } else {
            alert('გთხოვთ, შეავსოთ ყველა ველი!');
        }
    });
});