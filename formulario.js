document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            
            // Validación de email básica
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingrese un correo electrónico válido.');
                return;
            }
            
            // Simulación de envío (en un caso real se conectaría con un backend)
            alert('¡Mensaje enviado con éxito! En una implementación real, esto se enviaría a un servidor.');
            contactForm.reset();
        });
    }
});