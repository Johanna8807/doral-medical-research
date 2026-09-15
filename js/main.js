document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('prescreen-form');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Detiene el envío HTTP y evita el error 405

            // Obtener campos del formulario
            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const dob = document.getElementById('dob');
            const studyInterest = document.getElementById('study-interest');

            // Obtener contenedores de error
            const fullnameErr = document.getElementById('fullname-error');
            const emailErr = document.getElementById('email-error');
            const phoneErr = document.getElementById('phone-error');
            const dobErr = document.getElementById('dob-error');
            const studyErr = document.getElementById('study-error');

            let isValid = true;

            // Validar Nombre
            if (!fullname.value.trim()) {
                fullnameErr.textContent = 'Please enter your full name.';
                fullnameErr.style.color = 'red';
                isValid = false;
            } else {
                fullnameErr.textContent = '';
            }

            // Validar Email
            if (!email.value.trim() || !email.value.includes('@')) {
                emailErr.textContent = 'Please enter a valid email address.';
                emailErr.style.color = 'red';
                isValid = false;
            } else {
                emailErr.textContent = '';
            }

            // Validar Teléfono
            if (!phone.value.trim()) {
                phoneErr.textContent = 'Please enter your phone number.';
                phoneErr.style.color = 'red';
                isValid = false;
            } else {
                phoneErr.textContent = '';
            }

            // Validar Fecha de Nacimiento
            if (!dob.value) {
                dobErr.textContent = 'Please select your date of birth.';
                dobErr.style.color = 'red';
                isValid = false;
            } else {
                dobErr.textContent = '';
            }

            // Validar Selección de Estudio
            if (!studyInterest.value) {
                studyErr.textContent = 'Please select a therapeutic area.';
                studyErr.style.color = 'red';
                isValid = false;
            } else {
                studyErr.textContent = '';
            }

            // Si pasa la validación, guardar en LocalStorage
            if (isValid) {
                const formData = {
                    fullname: fullname.value.trim(),
                    email: email.value.trim(),
                    phone: phone.value.trim(),
                    dob: dob.value,
                    studyInterest: studyInterest.value,
                    submittedAt: new Date().toLocaleString()
                };

                localStorage.setItem('doral_participant_inquiry', JSON.stringify(formData));
                const status = document.getElementById('form-status');
                if (status) {
                    status.textContent = 'Thank you, ' + formData.fullname + '. Your inquiry has been received. Our recruitment team will contact you shortly.';
                    status.hidden = false;
                }
                form.reset();
            }
        });
    }
});

// --- Listado y filtrado de estudios (services.html) ---
// DATOS DE EJEMPLO: sustituir por los estudios reales del centro.
const TRIALS = [
    { id: 'DMR-CARD-01', area: 'cardiology',     title: 'Hipertensión resistente', phase: 'Fase III', desc: 'Estudio de tratamiento añadido en adultos con presión arterial no controlada con dos o más fármacos.' },
    { id: 'DMR-CARD-02', area: 'cardiology',     title: 'Insuficiencia cardíaca crónica', phase: 'Fase II', desc: 'Evaluación de una terapia complementaria en pacientes con fracción de eyección reducida.' },
    { id: 'DMR-ENDO-01', area: 'endocrinology',  title: 'Diabetes tipo 2', phase: 'Fase III', desc: 'Control glucémico en adultos con diabetes tipo 2 tratados con metformina.' },
    { id: 'DMR-ENDO-02', area: 'endocrinology',  title: 'Obesidad y síndrome metabólico', phase: 'Fase II', desc: 'Estudio de pérdida de peso y perfil metabólico en adultos con IMC ≥ 30.' },
    { id: 'DMR-GEN-01',  area: 'general',        title: 'Registro de voluntarios sanos', phase: 'Fase I', desc: 'Banco de participantes para estudios de farmacocinética y biodisponibilidad.' }
];

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('trials-container');
    const filter = document.getElementById('area-filter');

    if (!container) return; // Esta página no es services.html

    const render = (area) => {
        const list = (area === 'all') ? TRIALS : TRIALS.filter(t => t.area === area);

        if (!list.length) {
            container.innerHTML = '<p class="no-results">No hay estudios abiertos en esta área ahora mismo.</p>';
            return;
        }

        container.innerHTML = list.map(t => `
            <article class="study-card">
                <span class="phase">${t.phase}</span>
                <h3>${t.title}</h3>
                <p>${t.desc}</p>
                <p><small>Protocolo: ${t.id}</small></p>
                <a class="btn-select" href="contact.html">Solicitar información</a>
            </article>
        `).join('');
    };

    render('all');

    if (filter) {
        filter.addEventListener('change', () => render(filter.value));
    }
});
