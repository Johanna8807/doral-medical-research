/* ============================================================
   Doral Medical Research
   Touchstone 4 - Interactivity and Client-Side Data
   ============================================================ */

/* ------------------------------------------------------------
   1. DATOS (dos arrays y un objeto)
   ------------------------------------------------------------ */

// Array 1: los estudios clinicos que se muestran en services.html.
// DATOS DE EJEMPLO: sustituir por los estudios reales del centro.
const TRIALS = [
    { id: 'DMR-CARD-01', area: 'cardiology',    title: 'Resistant Hypertension',            phase: 'Phase III', desc: 'Add-on treatment study for adults whose blood pressure stays high on two or more medications.' },
    { id: 'DMR-CARD-02', area: 'cardiology',    title: 'Chronic Heart Failure',              phase: 'Phase II',  desc: 'Evaluation of a complementary therapy in patients with reduced ejection fraction.' },
    { id: 'DMR-ENDO-01', area: 'endocrinology', title: 'Type 2 Diabetes',                    phase: 'Phase III', desc: 'Glycemic control in adults with type 2 diabetes already treated with metformin.' },
    { id: 'DMR-ENDO-02', area: 'endocrinology', title: 'Obesity and Metabolic Syndrome',     phase: 'Phase II',  desc: 'Weight loss and metabolic profile study in adults with a BMI of 30 or higher.' },
    { id: 'DMR-GEN-01',  area: 'general',       title: 'Healthy Volunteer Registry',         phase: 'Phase I',   desc: 'Participant bank for pharmacokinetic and bioavailability studies.' }
];

// Array 2: las areas terapeuticas que rellenan el desplegable del filtro.
const THERAPEUTIC_AREAS = [
    { value: 'all',           label: 'All Therapeutic Areas' },
    { value: 'cardiology',    label: 'Cardiology' },
    { value: 'endocrinology', label: 'Endocrinology (Metabolic)' },
    { value: 'general',       label: 'General Clinical Trials' }
];

// Objeto con las claves que usamos en localStorage, en un solo sitio.
const STORAGE_KEYS = {
    filter: 'doral_selected_area',
    inquiry: 'doral_participant_inquiry'
};

/* ------------------------------------------------------------
   2. AYUDANTES DE ALMACENAMIENTO
   ------------------------------------------------------------ */

function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (err) {
        // Navegacion privada o almacenamiento bloqueado: la pagina sigue funcionando.
        return false;
    }
}

function loadFromStorage(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch (err) {
        return null;
    }
}

/* ------------------------------------------------------------
   3. PAGINA DE SERVICIOS: listado y filtro
   ------------------------------------------------------------ */

function getAreaLabel(value) {
    const area = THERAPEUTIC_AREAS.find(a => a.value === value);
    return area ? area.label : value;
}

function populateAreaFilter(select) {
    select.innerHTML = THERAPEUTIC_AREAS
        .map(area => `<option value="${area.value}">${area.label}</option>`)
        .join('');
}

function buildTrialCard(trial) {
    return `
        <article class="study-card">
            <span class="phase">${trial.phase}</span>
            <h3>${trial.title}</h3>
            <p>${trial.desc}</p>
            <p><small>Protocol: ${trial.id}</small></p>
            <a class="btn-select" href="contact.html">Request Information</a>
        </article>
    `;
}

function renderTrials(container, area) {
    const list = (area === 'all') ? TRIALS : TRIALS.filter(trial => trial.area === area);

    if (!list.length) {
        container.innerHTML = '<p class="no-results">No hay estudios abiertos en esta area ahora mismo.</p>';
        return;
    }

    container.innerHTML = list.map(buildTrialCard).join('');
}

function countTrials(area) {
    return (area === 'all') ? TRIALS.length : TRIALS.filter(trial => trial.area === area).length;
}

function showFilterNotice(notice, area, wasRestored) {
    if (!notice) return;

    if (wasRestored) {
        // Al volver a la pagina avisamos de que mantenemos su ultima eleccion.
        notice.textContent = 'Welcome back. We kept your last selection: ' + getAreaLabel(area) + '.';
        notice.hidden = false;
        return;
    }

    notice.textContent = 'Showing ' + countTrials(area) + ' studies in ' + getAreaLabel(area) + '.';
    notice.hidden = false;
}

function initServicesPage() {
    const container = document.getElementById('trials-container');
    const select = document.getElementById('area-filter');
    const notice = document.getElementById('filter-notice');

    if (!container || !select) return; // No estamos en services.html

    populateAreaFilter(select);

    // Recuperamos el area que el visitante eligio la ultima vez.
    const savedArea = loadFromStorage(STORAGE_KEYS.filter);
    const startArea = savedArea || 'all';

    select.value = startArea;
    renderTrials(container, startArea);
    if (savedArea) showFilterNotice(notice, savedArea, true);

    select.addEventListener('change', () => {
        const area = select.value;
        renderTrials(container, area);
        saveToStorage(STORAGE_KEYS.filter, area);
        showFilterNotice(notice, area, false);
    });
}

/* ------------------------------------------------------------
   4. PAGINA DE CONTACTO: validacion y almacenamiento
   ------------------------------------------------------------ */

function getFormFields() {
    return {
        fullname: document.getElementById('fullname'),
        email: document.getElementById('email'),
        phone: document.getElementById('phone'),
        dob: document.getElementById('dob'),
        studyInterest: document.getElementById('study-interest')
    };
}

function showFieldError(input, errorId, message) {
    const box = document.getElementById(errorId);
    if (box) box.textContent = message;
    if (input) input.classList.add('input-error');
}

function clearFieldError(input, errorId) {
    const box = document.getElementById(errorId);
    if (box) box.textContent = '';
    if (input) input.classList.remove('input-error');
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
    return /^\d{3}-\d{3}-\d{4}$/.test(value);
}

function validateForm(fields) {
    let isValid = true;

    // Comprobacion 1: el nombre no puede estar vacio.
    if (!fields.fullname.value.trim()) {
        showFieldError(fields.fullname, 'fullname-error', 'Please enter your full name.');
        isValid = false;
    } else {
        clearFieldError(fields.fullname, 'fullname-error');
    }

    // Comprobacion 2: el correo tiene que tener forma de correo.
    if (!isValidEmail(fields.email.value.trim())) {
        showFieldError(fields.email, 'email-error', 'Please enter a valid email address, for example name@example.com.');
        isValid = false;
    } else {
        clearFieldError(fields.email, 'email-error');
    }

    // Comprobacion 3: el telefono tiene que seguir el formato 123-456-7890.
    if (!isValidPhone(fields.phone.value.trim())) {
        showFieldError(fields.phone, 'phone-error', 'Please enter your phone number as 123-456-7890.');
        isValid = false;
    } else {
        clearFieldError(fields.phone, 'phone-error');
    }

    // Comprobacion 4: hay que elegir fecha de nacimiento y no puede ser futura.
    if (!fields.dob.value) {
        showFieldError(fields.dob, 'dob-error', 'Please select your date of birth.');
        isValid = false;
    } else if (new Date(fields.dob.value) > new Date()) {
        showFieldError(fields.dob, 'dob-error', 'The date of birth cannot be in the future.');
        isValid = false;
    } else {
        clearFieldError(fields.dob, 'dob-error');
    }

    // Comprobacion 5: hay que elegir un area terapeutica.
    if (!fields.studyInterest.value) {
        showFieldError(fields.studyInterest, 'study-error', 'Please select a therapeutic area.');
        isValid = false;
    } else {
        clearFieldError(fields.studyInterest, 'study-error');
    }

    return isValid;
}

function collectFormData(fields) {
    return {
        fullname: fields.fullname.value.trim(),
        email: fields.email.value.trim(),
        phone: fields.phone.value.trim(),
        dob: fields.dob.value,
        studyInterest: fields.studyInterest.value,
        submittedAt: new Date().toLocaleString()
    };
}

function restoreSavedInquiry(fields) {
    const saved = loadFromStorage(STORAGE_KEYS.inquiry);
    const notice = document.getElementById('restore-notice');

    if (!saved) return;

    // Volvemos a poner en el formulario lo que esta persona envio la ultima vez.
    fields.fullname.value = saved.fullname || '';
    fields.email.value = saved.email || '';
    fields.phone.value = saved.phone || '';
    fields.dob.value = saved.dob || '';
    fields.studyInterest.value = saved.studyInterest || '';

    if (notice) {
        notice.textContent = 'Welcome back, ' + saved.fullname + '. We restored the details you sent on ' + saved.submittedAt + ' so you do not have to type them again.';
        notice.hidden = false;
    }
}

function showSuccessMessage(data) {
    const status = document.getElementById('form-status');
    if (!status) return;

    status.textContent = 'Thank you, ' + data.fullname + '. Your inquiry for ' + getAreaLabel(data.studyInterest) + ' has been received. Our recruitment team will contact you shortly.';
    status.hidden = false;
}

function initContactForm() {
    const form = document.getElementById('prescreen-form');
    if (!form) return; // No estamos en contact.html

    const fields = getFormFields();

    // Al abrir o recargar la pagina recuperamos los datos guardados.
    restoreSavedInquiry(fields);

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impide el envio y el error 405

        // Si algo falla, NO se borra nada: el visitante corrige y reenvia.
        if (!validateForm(fields)) return;

        const data = collectFormData(fields);
        saveToStorage(STORAGE_KEYS.inquiry, data);
        showSuccessMessage(data);
    });
}

/* ------------------------------------------------------------
   5. ARRANQUE
   ------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', () => {
    initServicesPage();
    initContactForm();
});
