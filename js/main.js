JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initClinicalTrialFilter();
    initFormValidation();
    restoreUserPreferences();
});

const clinicalStudies = [
    {
        id: "cardio-01",
        title: "Estudio de Prevención Cardiovascular Fase III",
        area: "cardiology",
        phase: "Fase III",
        sponsor: "Sanofi",
        description: "Evaluación de un tratamiento innovador para la reducción del riesgo vascular en pacientes adultos."
    },
    {
        id: "endo-01",
        title: "Ensayo de Manejo de Diabetes Tipo 2",
        area: "endocrinology",
        phase: "Fase II",
        sponsor: "AstraZeneca",
        description: "Protocolo clínico enfocado en el control glucémico y perfiles de tolerabilidad a largo plazo."
    },
    {
        id: "gen-01",
        title: "Evaluación General de Biomarcadores Metabólicos",
        area: "general",
        phase: "Fase IV",
        sponsor: "Doral Medical Research",
        description: "Monitoreo longitudinal para identificación temprana de indicadores de salud metabólica."
    }
];

function initClinicalTrialFilter() {
    const filterSelect = document.getElementById('area-filter');
    const trialsContainer = document.getElementById('trials-container');

    if (!filterSelect || !trialsContainer) return;

    filterSelect.addEventListener('change', (e) => {
        const selectedArea = e.target.value;
        filterAndDisplayStudies(selectedArea, trialsContainer);
        localStorage.setItem('preferred_area', selectedArea);
    });

    const savedArea = localStorage.getItem('preferred_area') || 'all';
    filterSelect.value = savedArea;
    filterAndDisplayStudies(savedArea, trialsContainer);
}

function filterAndDisplayStudies(area, container) {
    container.innerHTML = '';

    const filtered = (area === 'all') 
        ? clinicalStudies 
        : clinicalStudies.filter(study => study.area === area);

    if (filtered.length === 0) {
        container.innerHTML = '<p class="no-results">No se encontraron ensayos para esta área temática.</p>';
        return;
    }

    filtered.forEach(study => {
        const card = document.createElement('article');
        card.className = 'study-card';
        card.innerHTML = `
            <h3>${study.title}</h3>
            <p><strong>Patrocinador:</strong> ${study.sponsor} | <strong>Fase:</strong> ${study.phase}</p>
            <p>${study.description}</p>
            <button onclick="selectStudyInterest('${study.area}')" class="btn-select">Consultar sobre este estudio</button>
        `;
        container.appendChild(card);
    });
}

function selectStudyInterest(area) {
    localStorage.setItem('selected_study_interest', area);
    window.location.href = 'contact.html';
}

function initFormValidation() {
    const form = document.getElementById('prescreen-form');
    if (!form) return;

    const fields = [
        { id: 'fullname', validator: validateFullName },
        { id: 'email', validator: validateEmail },
        { id: 'phone', validator: validatePhone },
        { id: 'dob', validator: validateDOB },
        { id: 'study-interest', validator: validateStudyInterest }
    ];

    fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('blur', () => field.validator(input));
            input.addEventListener('input', () => clearError(input));
        }
    });

    form.addEventListener('submit', (e) => {
        let isValid = true;
        fields.forEach(field => {
            const input = document.getElementById(field.id);
            if (input && !field.validator(input)) isValid = false;
        });

        if (!isValid) {
            e.preventDefault();
        } else {
            const nameInput = document.getElementById('fullname');
            const emailInput = document.getElementById('email');
            if (nameInput) localStorage.setItem('user_fullname', nameInput.value);
            if (emailInput) localStorage.setItem('user_email', emailInput.value);
        }
    });
}

function validateFullName(input) {
    if (input.value.trim().length < 3) {
        showError(input, 'Por favor, ingrese su nombre completo (mínimo 3 caracteres).');
        return false;
    }
    clearError(input);
    return true;
}

function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(input.value.trim())) {
        showError(input, 'Ingrese un correo electrónico válido (ejemplo: usuario@dominio.com).');
        return false;
    }
    clearError(input);
    return true;
}

function validatePhone(input) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    if (!phoneRegex.test(input.value.trim())) {
        showError(input, 'El formato debe ser 123-456-7890.');
        return false;
    }
    clearError(input);
    return true;
}

function validateDOB(input) {
    if (!input.value) {
        showError(input, 'Seleccione su fecha de nacimiento.');
        return false;
    }
    clearError(input);
    return true;
}

function validateStudyInterest(input) {
    if (!input.value) {
        showError(input, 'Por favor, seleccione un área terapéutica.');
        return false;
    }
    clearError(input);
    return true;
}

function showError(input, message) {
    const container = input.parentElement;
    let errorSpan = container.querySelector('.error-message');
    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        container.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    input.classList.add('input-error');
}

function clearError(input) {
    const container = input.parentElement;
    const errorSpan = container.querySelector('.error-message');
    if (errorSpan) errorSpan.remove();
    input.classList.remove('input-error');
}

function restoreUserPreferences() {
    const studyInterestSelect = document.getElementById('study-interest');
    const savedInterest = localStorage.getItem('selected_study_interest');
    if (studyInterestSelect && savedInterest) studyInterestSelect.value = savedInterest;

    const nameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    if (nameInput && localStorage.getItem('user_fullname')) nameInput.value = localStorage.getItem('user_fullname');
    if (emailInput && localStorage.getItem('user_email')) emailInput.value = localStorage.getItem('user_email');
}
