// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const startBtn = document.getElementById('startBtn');
const questionnaire = document.getElementById('questionnaire');
const results = document.getElementById('results');
const resultsContent = document.getElementById('resultsContent');
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const questionsContainer = document.getElementById('questionsContainer');

// Questions Data
const questions = [
    { id: 'q1', question: '1. რა საქმიანობა გაგრძნობინებთ ყველაზე მეტ კმაყოფილებას, და რა ხდის მას განსაკუთრებულს?', type: 'text' },
    { id: 'q2', question: '2. რა არის თქვენი უმთავრესი ძლიერი მხარე, რომელიც სამუშაო გარემოში გამოიყენებოდა?', type: 'text' },
    { id: 'q3', question: '3. როგორი სამუშაო გარემო გიხდებათ ყველაზე მეტად (მაგ., გუნდური, დამოუკიდებელი, სტრუქტურირებული)?', type: 'text' },
    { id: 'q4', question: '4. რა ღირებულებებია თქვენთვის პრიორიტეტული სამუშაო ადგილზე (მაგ., ინოვაცია, თანამშრომლობა)?', type: 'text' },
    { id: 'q5', question: '5. როგორ მართავთ სტრესს ან ზეაყოლას პროფესიულ სიტუაციებში? მაგალითი მოიყვანეთ.', type: 'text' },
    { id: 'q6', question: '6. რა ტიპის პრობლემების გადაჭრა გაძლევთ ყველაზე დიდ სიამოვნებას, და რატომ?', type: 'text' },
    { id: 'q7', question: '7. გქონიათ თუ არა გამოცდილება, სადაც ხელმძღვანელის როლი ითამაშეთ? აღწერეთ.', type: 'text' },
    { id: 'q8', question: '8. რა მოტივაციით ისწრაფვით პროფესიული წარმატებისკენ (მაგ., ფინანსები, გავლენა)?', type: 'text' },
    { id: 'q9', question: '9. როგორი სამუშაო გრაფიკი ან სტრუქტურა გირჩევნიათ, და რა მიზეზით?', type: 'text' },
    { id: 'q10', question: '10. რამდენად მნიშვნელოვანია თქვენთვის სხვების დახმარება სამუშაოს ფარგლებში?', type: 'text' },
    { id: 'q11', question: '11. რა სახის გამოწვევები გიზიდავთ პროფესიულად, და რა ხდის მათ საინტერესოს?', type: 'text' },
    { id: 'q12', question: '12. როგორი ხელმძღვანელის ქვეშ გსურთ მუშაობა (მაგ., მხარდამჭერი, ავტორიტარული)?', type: 'text' },
    { id: 'q13', question: '13. რა გავლენის მოხდენა გსურთ თქვენი სამუშაოთი საზოგადოებაზე ან ინდუსტრიაზე?', type: 'text' },
    { id: 'q14', question: '14. აღწერეთ თქვენი ოცნების სამუშაოს ძირითადი მახასიათებლები.', type: 'text' },
    { id: 'q15', question: '15. რა განგასხვავებთ სხვებისგან, როგორც პროფესიონალი? მაგალითი მოიყვანეთ.', type: 'text' },
    { id: 'q16', question: '16. რა ტიპის უნივერსიტეტი გირჩევნიათ?', type: 'select', options: ['სახელმწიფო უნივერსიტეტი', 'კერძო უნივერსიტეტი'] },
    { id: 'q17', question: '17. რა არის თქვენი ბიუჯეტი სწავლისთვის (წელიწადში)?', type: 'select', options: ['2,000 ლარამდე', '2,000-5,000 ლარი', '5,000-10,000 ლარი', '10,000 ლარზე მეტი', 'მხოლოდ სტიპენდიის პირობებში'] }
];

// State
let currentQuestion = 0;
const answers = {};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderQuestions();
    showQuestion(0);
    questionnaire.style.display = 'none';
    results.style.display = 'none';
    chatContainer.style.display = 'none';
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

// Start Questionnaire
startBtn.addEventListener('click', () => {
    document.querySelector('.hero').style.display = 'none';
    questionnaire.style.display = 'block';
    questionnaire.classList.add('animate__animated', 'animate__fadeIn');
});

// Render Questions
function renderQuestions() {
    questionsContainer.innerHTML = questions.map((q, index) => `
        <div class="question" id="${q.id}" data-index="${index}">
            <h3>${q.question}</h3>
            ${q.type === 'text' ? `
                <textarea class="answer-input" id="input-${q.id}" placeholder="ჩაწერეთ თქვენი პასუხი..." oninput="saveAnswer('${q.id}')"></textarea>
            ` : `
                <div class="options" data-question-id="${q.id}">
                    ${q.options.map(opt => `
                        <div class="option" data-option="${opt}" role="button" tabindex="0">
                            ${opt}
                            <span class="option-check">✓</span>
                        </div>
                    `).join('')}
                </div>
            `}
        </div>
    `).join('') + `
        <div class="navigation">
            <button class="nav-btn" id="prevBtn" onclick="prevQuestion()" disabled>
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M15.41 16.58L10.83 12 15.41 7.41 14 6 8 12 14 18 15.41 16.58Z"/>
                </svg>
                წინა
            </button>
            <button class="nav-btn" id="nextBtn" onclick="nextQuestion()">
                შემდეგი
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M8.59 16.58L13.17 12 8.59 7.41 10 6 16 12 10 18 8.59 16.58Z"/>
                </svg>
            </button>
            <button class="nav-btn" id="submitBtn" onclick="submitQuestionnaire()" style="display: none;">
                რეკომენდაციების მიღება
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M4 11V13H16L10.5 18.5 11.92 19.92 19.84 12 11.92 4.08 10.5 5.5 16 11H4Z"/>
                </svg>
            </button>
        </div>
    `;

    // Attach event delegation for option clicks and keyboard interaction
    questionsContainer.addEventListener('click', (event) => {
        const option = event.target.closest('.option');
        if (!option) return;
        const optionsContainer = option.closest('.options');
        if (!optionsContainer) return;
        const questionId = optionsContainer.dataset.questionId;
        const optionText = option.dataset.option;
        selectOption(questionId, optionText, option);
    });

    questionsContainer.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            const option = event.target.closest('.option');
            if (!option) return;
            const optionsContainer = option.closest('.options');
            if (!optionsContainer) return;
            const questionId = optionsContainer.dataset.questionId;
            const optionText = option.dataset.option;
            selectOption(questionId, optionText, option);
        }
    });
}

// Show Question
function showQuestion(index) {
    currentQuestion = index;
    const progressPercent = ((index + 1) / questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `${index + 1}/${questions.length}`;

    document.querySelectorAll('.question').forEach((q, i) => {
        q.classList.toggle('active', i === index);
        if (i === index) q.style.animation = 'fadeInUp 0.5s ease';
    });

    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index === questions.length - 1 ? 'none' : 'flex';
    document.getElementById('submitBtn').style.display = index === questions.length - 1 ? 'flex' : 'none';

    document.querySelector(`#${questions[index].id}`).scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Restore saved answers
    const question = questions[index];
    if (question.type === 'text') {
        const input = document.getElementById(`input-${question.id}`);
        input.value = answers[question.id] || '';
    } else if (question.type === 'select') {
        document.querySelectorAll(`#${question.id} .option`).forEach(opt => {
            const isSelected = opt.dataset.option === answers[question.id];
            opt.classList.toggle('selected', isSelected);
            opt.querySelector('.option-check').style.transform = isSelected ? 'scale(1)' : 'scale(0)';
            opt.querySelector('.option-check').style.opacity = isSelected ? '1' : '0';
        });
    }
}

// Save Text Answer
function saveAnswer(questionId) {
    const input = document.getElementById(`input-${questionId}`);
    answers[questionId] = input.value.trim();
}

// Select Option
function selectOption(questionId, optionText, element) {
    const question = questions.find(q => q.id === questionId);
    if (!question || question.type !== 'select') return;

    // Clear previous selection
    const options = document.querySelectorAll(`#${questionId} .option`);
    options.forEach(opt => {
        opt.classList.remove('selected');
        opt.querySelector('.option-check').style.transform = 'scale(0)';
        opt.querySelector('.option-check').style.opacity = '0';
    });

    // Apply new selection
    element.classList.add('selected');
    const checkmark = element.querySelector('.option-check');
    checkmark.style.transform = 'scale(1)';
    checkmark.style.opacity = '1';
    answers[questionId] = optionText;

    // Add ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    const rect = element.getBoundingClientRect();
    ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}

// Navigation
function nextQuestion() {
    if (currentQuestion < questions.length - 1) showQuestion(currentQuestion + 1);
}

function prevQuestion() {
    if (currentQuestion > 0) showQuestion(currentQuestion - 1);
}

// Submit Questionnaire
async function submitQuestionnaire() {
    const unanswered = questions.filter(q => !answers[q.id]).map(q => q.id.replace('q', ''));
    if (unanswered.length > 0) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message animate__animated animate__shakeX';
        errorMessage.textContent = `გთხოვთ უპასუხოთ კითხვებს: ${unanswered.join(', ')}`;
        const activeQuestion = document.querySelector('.question.active');
        activeQuestion.insertBefore(errorMessage, activeQuestion.querySelector('.options, .answer-input'));
        setTimeout(() => errorMessage.remove(), 3000);
        showQuestion(parseInt(unanswered[0]) - 1);
        return;
    }

    localStorage.setItem('questionnaireAnswers', JSON.stringify(answers));

    questionnaire.style.opacity = '0.5';
    questionnaire.style.pointerEvents = 'none';

    results.style.display = 'block';
    results.style.opacity = '0';
    results.style.transform = 'translateY(20px)';
    resultsContent.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>თქვენი პასუხების ანალიზი...</p>
        </div>
    `;

    setTimeout(() => {
        results.style.opacity = '1';
        results.style.transform = 'translateY(0)';
        results.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }, 100);

    try {
        const professionRecommendations = await getProfessionRecommendations(answers);
        const universityRecommendations = await getUniversityRecommendations(answers, professionRecommendations);

        // Redirect to profile page
        window.location.href = '/profile/index.html';
    } catch (error) {
        resultsContent.innerHTML = `
            <div class="error animate__animated animate__shakeX">
                <p>შეცდომა: ${error.message}</p>
                <button class="nav-btn" onclick="window.location.reload()">
                    სცადეთ ხელახლა
                    <svg viewBox="0 0 24 24" width="18" height="18">
                        <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4A8 8 0 0 0 4 12 8 8 0 0 0 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18A6 6 0 0 1 6 12 6 6 0 0 1 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z"/>
                    </svg>
                </button>
            </div>
        `;
    } finally {
        questionnaire.style.opacity = '1';
        questionnaire.style.pointerEvents = 'auto';
    }
}

// Get Profession Recommendations
async function getProfessionRecommendations(answers) {
    const answerText = Object.entries(answers)
        .filter(([key]) => key.startsWith('q') && parseInt(key.replace('q', '')) <= 15)
        .map(([key, value], index) => `Question ${index + 1}: ${questions[index].question}\nAnswer: ${value}`)
        .join('\n\n');

    const prompt = `
You are a career counselor. Based on the following answers to 15 psychological questions, recommend two suitable professions for the user. For each profession, provide:
- Title (in Georgian)
- Description (in Georgian, 20-30 words)
- Detailed reason for recommendation (in Georgian, 100-150 words, explaining why this profession suits the user based on their answers, referencing specific traits, values, or preferences)
- Average salary range in Georgia (in GEL, e.g., "2,000-4,000 ლარი")

Input:
${answerText}

Output format (JSON):
{
  "professions": [
    {
      "title": "...",
      "description": "...",
      "reason": "...",
      "salary": "..."
    },
    {
      "title": "...",
      "description": "...",
      "reason": "...",
      "salary": "..."
    }
  ]
}
`;

    try {
        // Simulated API response
        await new Promise(resolve => setTimeout(resolve, 2000));
        const professions = [
            {
                title: 'მონაცემთა ანალიტიკოსი',
                description: 'მონაცემთა შეგროვება, ანალიზი და ინტერპრეტაცია ბიზნესის გადაწყვეტილებების მხარდასაჭერად, სტატისტიკისა და პროგრამირების გამოყენებით.',
                reason: 'თქვენი პასუხებიდან ჩანს, რომ გაგაჩნიათ ანალიტიკური აზროვნება და სიამოვნებას განიჭებთ რთული პრობლემების გადაჭრა, რაც მონაცემთა ანალიზისთვის გადამწყვეტია (q6). თქვენი პრიორიტეტი სტრუქტურირებული სამუშაო გარემოსადმი (q3) იდეალურად ერგება ამ პროფესიას, სადაც ზუსტი მუშაობა მნიშვნელოვანია. თქვენი ინტერესი ინოვაციებისადმი (q4) და მოტივაცია, გქონდეთ გავლენა ინდუსტრიაზე (q13), შეესაბამება ამ სფეროს, რომელიც გთავაზობთ მუდმივ განვითარებას. თქვენი სტრესის მართვის უნარი (q5) უზრუნველყოფს წარმატებას მაღალი ზეაყოლის პირობებში. ეს პროფესია თქვენს ძლიერ მხარეებს, როგორიცაა დეტალებზე ორიენტირებულობა (q2), მაქსიმალურად გამოზღავის.',
                salary: '3,250-6,500 ლარი'
            },
            {
                title: 'პროექტის მენეჯერი',
                description: 'პოექტების დაგეგმვა, გუნდის ხელმძღვანელობა და მიზნების მიღწევა დროულად, ოესუსების ეფექტური მართვით.',
                reason: 'თქვენი ლიდერობის გამოცდილება (q7) და თანამშრომლობისადმი ორიენტაცია (q4) ხდის პოექტის მენეჯმენტს თქვენთვის იდეალურ აზევანს. თქვენი ოგანიზების უნარი (q9) და სტრესის მართვის სტრატეგიები (q5) საშუალებას გაძლევთ ეფექტურად მართოთ გუნდები. თქვენი მოტივაცია, მიაღწიოთ წარმატებას (q8) და გქონდეთ გავლენა (q13), ემთხვევა ამ პროფესიის მოთხოვნებს, სადაც ხელმძღვანელობა მთავარია. თქვენი პრიორიტეტი მხარდამჭერ ხელმძღვანელებთან მუშაობაზე (q12) ხელს უწყობს გუნდურ დინამიკას. ეს პროფესია თქვენს ოცნებას მრავალფეროვანი სამუშაოს შესახებ (q14) ახორციელებს, რადგან გთავაზობთ მუდმივ გამოწვევებს.',
                salary: '3,500-7,000 ლარი'
            }
        ];

        const html = professions.map((p, index) => `
            <div class="profession-card animate__animated animate__fadeIn" style="animation-delay: ${index * 0.2}s">
                <h5><i class="fas fa-briefcase"></i> ${p.title}</h5>
                <p>${p.description}</p>
                <div class="reason">${p.reason}</div>
                <p class="salary"><i class="fas fa-money-bill-wave"></i> საშუალო ხელფასი: ${p.salary}</p>
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
                            <span>8,500-12,000 ლარი/წელი</span>
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
                            <span>5,000-8,000 ლარი/წელი</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-icon"><i class="fas fa-award"></i></span>
                            <span>ფინანსური დახმარება</span>
                        </div>
                    </div>
                    <div class="budget-info"><p>${budgetText}</p></div>
                    <button class="more-info-btn"><i class="fas fa-info-circle"></i> மேலும் முதல்</button>
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
                            <span>2,250-3,500 ლარი/წელი</span>
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
                            <span>3,000-4,500 ლარი/წელი</span>
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

// Chat Functions
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    showTypingIndicator();

    setTimeout(() => {
        removeTypingIndicator();
        const botResponse = generateChatResponse(message);
        addMessage(botResponse, 'bot');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

function addMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message animate__animated animate__fadeIn`;
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

function generateChatResponse(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('სტიპენდია')) {
        return 'სტიპენდიები ხელმისაწვდომია სახელმწიფო უნივერსიტეტებში მაღალი ქულებისთვის. კერძო უნივერსიტეტები გთავაზობთ გრანტებს მაღალი მოსწრების შემთხვევაში.';
    } else if (lowerMessage.includes('საფასური')) {
        return 'სახელმწიფო უნივერსიტეტები: 2,250-4,500 ლარი/წელი. კერძო უნივერსიტეტები: 5,000-12,000 ლარი/წელი, პროგრამის მიხედვით.';
    } else if (lowerMessage.includes('მისაღები')) {
        return 'სახელმწიფო უნივერსიტეტები მოითხოვენ ეროვნულ გამოცდებს. კერძო უნივერსიტეტები ზოგჯერ იღებენ საშუალო ქულებით.';
    } else if (lowerMessage.includes('დაღირებულება')) {
        return 'ორივე ტიპის უნივერსიტეტის დიპლომი აღიარებულია. კერძო უნივერსიტეტებს აქვთ მჭიდრო კავშირები ბიზნეს სექტორთან.';
    } else if (lowerMessage.includes('პროფესია')) {
        return 'პროფესიის არჩევანი თქვენს ინტერესებზეა დამოკიდებული. გაიარეთ ტესტი პერსონალიზებული რჩევებისთვის.';
    }
    return 'გთხოვთ, განმარტეთ თქვენი შეკითხვა, ან სცადეთ თემები: სტიპენდია, საფასური, მისაღები, პროფესია.';
}