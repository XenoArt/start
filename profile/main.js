// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const testResults = document.getElementById('testResults');
const testQuestions = document.getElementById('testQuestions');
const retakeTestBtn = document.getElementById('retakeTestBtn');
const showResultsBtn = document.getElementById('showResultsBtn');
const showQuestionsBtn = document.getElementById('showQuestionsBtn');
const userName = document.getElementById('userName');
const userDetails = document.getElementById('userDetails');
const userInterests = document.getElementById('userInterests');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    displayProfile();
    initToggles();
});

// Theme Functions
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        themeToggle.classList.add('dark');
    }
}

function toggleTheme() {
    const isDark = body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

themeToggle.addEventListener('click', toggleTheme);

// Retake Test
retakeTestBtn.addEventListener('click', () => {
    localStorage.removeItem('questionnaireAnswers');
    window.location.href = '/index.html';
});

// Initialize Toggle Buttons
function initToggles() {
    showResultsBtn.addEventListener('click', () => {
        testResults.classList.toggle('hidden');
        testResults.classList.toggle('visible');
        showResultsBtn.querySelector('i').classList.toggle('fa-chart-bar');
        showResultsBtn.querySelector('i').classList.toggle('fa-times');
    });

    showQuestionsBtn.addEventListener('click', () => {
        testQuestions.classList.toggle('hidden');
        testQuestions.classList.toggle('visible');
        showQuestionsBtn.querySelector('i').classList.toggle('fa-question-circle');
        showQuestionsBtn.querySelector('i').classList.toggle('fa-times');
    });
}

// Display Profile
async function displayProfile() {
    // Load user info
    userName.textContent = localStorage.getItem('userName') || 'ნინო გიორგაძე';
    userDetails.textContent = localStorage.getItem('userDetails') || 'სტუდენტი | თბილისის სახელმწიფო უნივერსიტეტი';
    userInterests.textContent = localStorage.getItem('userInterests') || 'ინტერესები: IT, Data Science, Design';

    let answers;
    try {
        answers = JSON.parse(localStorage.getItem('questionnaireAnswers')) || {};
    } catch (error) {
        testResults.innerHTML = `
            <div class="error animate__animated animate__shakeX">
                <p>შეცდომა: ტესტის მონაცემები დაზიანებულია. გთხოვთ, გაიაროთ ტესტი ხელახლა.</p>
                <a href="/index.html" class="nav-btn">
                    <i class="fas fa-redo"></i> გაიარეთ ტესტი
                </a>
            </div>
        `;
        testQuestions.innerHTML = '';
        return;
    }

    if (Object.keys(answers).length === 0) {
        testResults.innerHTML = `
            <div class="error animate__animated animate__shakeX">
                <p>ტესტის შედეგები არ არის ნაპოვნი. გთხოვთ, ჯერ გაიაროთ კარიერული ტესტი.</p>
                <a href="/index.html" class="nav-btn">
                    <i class="fas fa-redo"></i> გაიარეთ ტესტი
                </a>
            </div>
        `;
        testQuestions.innerHTML = '';
        return;
    }

    try {
        const professionRecommendations = await getProfessionRecommendations(answers);
        const universityRecommendations = await getUniversityRecommendations(answers, professionRecommendations);

        testResults.innerHTML = `
            <div class="recommendations-intro animate__animated animate__fadeIn">
                <h3>თქვენი პერსონალური რეკომენდაციები</h3>
                <p>ჩვენი სისტემის ანალიზის საფუძველზე, აქ მოცემულია თქვენთვის საუკეთესო ვარიანტები:</p>
            </div>
            <div class="profession-section">
                <h4><i class="fas fa-briefcase"></i> თქვენთვის რეკომენდირებული პროფესიები</h4>
                <div class="profession-list">${professionRecommendations.html}</div>
            </div>
            <h4 class="university-recommendations-title"><i class="fas fa-university"></i> თქვენთვის რეკომენდირებული უნივერსიტეტები</h4>
            <div class="university-list">${universityRecommendations}</div>
        `;

        testQuestions.innerHTML = `
            <div class="answers-section animate__animated animate__fadeIn">
                <h4><i class="fas fa-question-circle"></i> თქვენი პასუხები</h4>
                <div class="answers-list">
                    ${Object.entries(answers).map(([key, value]) => `
                        <div class="answer-card animate__animated animate__fadeInUp">
                            <h5>${key.replace('q', 'კითხვა ')}:</h5>
                            <p>${value}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (error) {
        testResults.innerHTML = `
            <div class="error animate__animated animate__shakeX">
                <p>შეცდომა: ${error.message}. გთხოვთ, სცადეთ ხელახლა.</p>
                <a href="/index.html" class="nav-btn">
                    <i class="fas fa-redo"></i> გაიარეთ ტესტი
                </a>
            </div>
        `;
        testQuestions.innerHTML = '';
    }
}

// Get Profession Recommendations
async function getProfessionRecommendations(answers) {
    const questions = [
        { id: 'q1', question: '1. რა საქმიანობა გაგრძნობინებთ ყველაზე მეტ კმაყოფილებას, და რა ხდის მას განსაკუთრებულს?' },
        { id: 'q2', question: '2. რა არის თქვენი უმთავრესი ძლიერი მხარე, რომელიც სამუშაო გარემოში გამოიყენებოდა?' },
        { id: 'q3', question: '3. როგორი სამუშაო გარემო გიხდებათ ყველაზე მეტად (მაგ., გუნდური, დამოუკიდებელი)?' },
        { id: 'q4', question: '4. რა ღირებულებებია თქვენთვის პრიორიტეტული სამუშაო ადგილზე (მაგ., ინოვაცია)?' },
        { id: 'q5', question: '5. როგორ მართავთ სტრესს ან ზეაყოლას პროფესიულ სიტუაციებში?' },
        { id: 'q6', question: '6. რა ტიპის პრობლემების გადაჭრა გაძლევთ ყველაზე დიდ სიამოვნებას, და რატომ?' },
        { id: 'q7', question: '7. გქონიათ თუ არა გამოცდილება, სადაც ხელმძღვანელის როლი ითამაშეთ?' },
        { id: 'q8', question: '8. რა მოტივაციით ისწრაფვით პროფესიული წარმატებისკენ (მაგ., ფინანსები)?' },
        { id: 'q9', question: '9. როგორი სამუშაო გრაფიკი ან სტრუქტურა გირჩევნიათ, და რა მიზეზით?' },
        { id: 'q10', question: '10. რამდენად მნიშვნელოვანია თქვენთვის სხვების დახმარება სამუშაოს ფარგლებში?' },
        { id: 'q11', question: '11. რა სახის გამოწვევები გიზიდავთ პროფესიულად, და რა ხდის მათ საინტერესოს?' },
        { id: 'q12', question: '12. როგორი ხელმძღვანელის ქვეშ გსურთ მუშაობა (მაგ., მხარდამჭერი)?' },
        { id: 'q13', question: '13. რა გავლენის მოხდენა გსურთ თქვენი სამუშაოთი საზოგადოებაზე?' },
        { id: 'q14', question: '14. აღწერეთ თქვენი ოცნების სამუშაოს ძირითადი მახასიათებლები.' },
        { id: 'q15', question: '15. რა განგასხვავებთ სხვებისგან, როგორც პროფესიონალი?' },
    ];

    const answerText = Object.entries(answers)
        .filter(([key]) => key.startsWith('q') && parseInt(key.replace('q', '')) <= 15)
        .map(([key, value], index) => `Question ${index + 1}: ${questions[index].question}\nAnswer: ${value}`)
        .join('\n\n');

    try {
        // Simulated API response
        await new Promise(resolve => setTimeout(resolve, 2000));
        const professions = [
            {
                title: 'მონაცემთა ანალიტიკოსი',
                description: 'მონაცემთა შეგროვება, ანალიზი და ინტერპრეტაცია ბიზნესის გადაწყვეტილებების მხარდასაჭერად.',
                reason: 'თქვენი ანალიტიკური აზროვნება (q6) და სტრუქტურირებული მუშაობის პრიორიტეტი (q3) იდეალურია ამ სფეროსთვის. თქვენი ინოვაციების ინტერესი (q4) და სტრესის მართვის უ�ნარი (q5) უზრუნველყოფს წარმატებას.',
                salary: '3,250-6,500 ლარი'
            },
            {
                title: 'პროექტის მენეჯერი',
                description: 'პროექტების დაგეგმვა, გუნდის ხელმძღვანელობა და მიზნების მიღწევა.',
                reason: 'თქვენი ლიდერული გამოცდილება (q7) და თანამშრომლობის პრიორიტეტი (q4) ხდის ამ პროფესიას თქვენთვის შესაფერისს. თქვენი ორგანიზებულობა (q9) და მოტივაცია (q8) ხელს უწყობს წარმატებას.',
                salary: '3,500-7,000 ლარი'
            }
        ];

        const html = professions.map((p, index) => `
            <div class="profession-card animate__animated animate__fadeIn" style="animation-delay: ${index * 0.2}s">
                <h5><i class="fas fa-briefcase"></i> ${p.title}</h5>
                <p>${p.description}</p>
                <div class="reason">${p.reason}</div>
                <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: ${p.salary}</p>
                <a href="/professionals/${encodeURIComponent(p.title)}.html" class="professionals-btn">
                    <i class="fas fa-users"></i> პროფესიონალების ნახვა
                </a>
            </div>
        `).join('');

        return { html, professions };
    } catch (error) {
        throw new Error(`Profession recommendation failed: ${error.message}`);
    }
}

// Get University Recommendations
async function getUniversityRecommendations(answers, professionRecommendations) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const budget = answers.q17 || '';
    const isPrivate = answers.q16?.includes('კერძო');
    const profession = professionRecommendations.professions[0].title;

    let budgetText = '';
    if (budget.includes('2,000 ლარამდე')) budgetText = 'ეს უნივერსიტეტი შეესაბამება თქვენს მინიმალურ ბიუჯეტს.';
    else if (budget.includes('2,000-5,000')) budgetText = 'ეს უნივერსიტეტი თქვენს ბიუჯეტის ფარგლებშია.';
    else if (budget.includes('5,000-10,000')) budgetText = 'ეს პროგრამა შეესაბამება თქვენს ბიუჯეტს.';
    else if (budget.includes('10,000 ლარზე')) budgetText = 'ეს პრესტიჟული პროგრამა თქვენს ბიუჯეტს შეესაბამება.';
    else if (budget.includes('სტიპენდიის')) budgetText = 'ხელმისაწვდომია სტიპენდიის პროგრამები.';
    else budgetText = 'გთხოვთ, აირჩიოთ ბიუჯეტი სწორი რეკომენდაციისთვის.';

    const faculty = getFaculty(profession);

    if (isPrivate) {
        return `
            <div class="university-card animate__animated animate__fadeInUp">
                <div class="university-header">
                    <h3>ქართულ-ამერიკული უნივერსიტეტი</h3>
                    <span class="university-badge">კერძო</span>
                </div>
                <div class="university-body">
                    <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                    <p class="metadata">ამერიკული სასწავლო მოდელი თქვენს პროფესიულ მიზნებს ერგება.</p>
                    <div class="stats-wrapper">
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                            <span>8,500-12,000 ლარი</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-award"></i></span>
                            <span>მაღალი აკადემიური სტანდარტი</span>
                        </div>
                    </div>
                    <div class="budget-info"><p>${budgetText}</p></div>
                    <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                </div>
            </div>
            <div class="university-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
                <div class="university-header">
                    <h3>კავკასიის უნივერსიტეტი</h3>
                    <span class="university-badge">კერძო</span>
                </div>
                <div class="university-body">
                    <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                    <p class="metadata">პრაქტიკაზე ორიენტირებული სწავლება თქვენს კარიერულ მიზნებს უწყობს ხელს.</p>
                    <div class="stats-wrapper">
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                            <span>5,000-8,000 ლარი</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-award"></i></span>
                            <span>ფინანსური დახმარება</span>
                        </div>
                    </div>
                    <div class="budget-info"><p>${budgetText}</p></div>
                    <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინ�ფორმაცია</button>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="university-card animate__animated animate__fadeInUp">
                <div class="university-header">
                    <h3>თბილისის სახელმწიფო უნივერსიტეტი</h3>
                    <span class="university-badge">სახელმწიფო</span>
                </div>
                <div class="university-body">
                    <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                    <p class="metadata">პრესტიჟული აკადემიური გარემო თქვენს პროფესიულ მიზნებს ერგება.</p>
                    <div class="stats-wrapper">
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                            <span>2,250-3,500 ლარი</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-award"></i></span>
                            <span>მაღალი აკადემიური სტანდარტი</span>
                        </div>
                    </div>
                    <div class="budget-info"><p>${budgetText}</p></div>
                    <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                </div>
            </div>
            <div class="university-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
                <div class="university-header">
                    <h3>ილიას სახელმწიფო უნივერსიტეტი</h3>
                    <span class="university-badge">სახელმწიფო</span>
                </div>
                <div class="university-body">
                    <p class="faculty-info"><i class="fas fa-graduation-cap"></i> <strong>ფაკულტეტი:</strong> ${faculty}</p>
                    <p class="metadata">ინოვაციაზე ორიენტირებული სწავლება თქვენს კარიერულ მიზნებს უწყობს ხელს.</p>
                    <div class="stats-wrapper">
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-money-bill-wave"></i></span>
                            <span>3,000-4,500 ლარი</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-award"></i></span>
                            <span>აქტიური სტუდენტური ცხოვრება</span>
                        </div>
                    </div>
                    <div class="budget-info"><p>${budgetText}</p></div>
                    <button class="more-info-btn"><i class="fas fa-info-circle"></i> მეტი ინფორმაცია</button>
                </div>
            </div>
        `;
    }
}

// Get Faculty
function getFaculty(profession) {
    if (profession.includes('მონაცემთა') || profession.includes('პროგრამისტი')) {
        return 'ზუსტ და საბუნებისმეტყველო მეცნიერებათა ფაკულტეტი';
    } else if (profession.includes('მენეჯერი') || profession.includes('მარკეტინგი') || profession.includes('ფინანსები')) {
        return 'ბიზნესისა და ეკონომიკის ფაკულტეტი';
    } else if (profession.includes('დიზაინერი')) {
        return 'ჰუმანიტარულ მეცნიერებათა ფაკულტეტი';
    } else if (profession.includes('ფსიქოლოგი') || profession.includes('სოციალური')) {
        return 'სოციალურ და პოლიტიკურ მეცნიერებათა ფაკულტეტი';
    }
    return 'საერთო ფაკულტეტი';
}