JavaScript
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
                alert('Inquiry successfully saved to LocalStorage!');
            }
        });
    }
});
