document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        themeToggle.classList.toggle('dark');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Course Filtering
    const courseSearch = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const courses = document.querySelectorAll('.course-card');

    const filterCourses = () => {
        const searchTerm = courseSearch.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        courses.forEach(course => {
            const title = course.querySelector('h3').textContent.toLowerCase();
            const description = course.querySelector('.course-description').textContent.toLowerCase();
            const category = course.dataset.category;

            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                course.classList.remove('hidden');
                course.style.opacity = '1';
            } else {
                course.classList.add('hidden');
                course.style.opacity = '0';
            }
        });
    };

    courseSearch.addEventListener('input', filterCourses);
    categoryFilter.addEventListener('change', filterCourses);

    // Enroll Button Redirect
    document.querySelectorAll('.enroll-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
            ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
            btn.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
                const course = encodeURIComponent(btn.dataset.course);
                const price = btn.dataset.price;
                window.location.href = `/payment/payment.html?course=${course}&price=${price}`;
            }, 600);
        });
    });

    // Preload Images to Ensure Loading
    const imageUrls = [
        'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/392018/pexels-photo-392018.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/3184610/pexels-photo-3184610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
});