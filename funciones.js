// La URL base de tu API de Flask
const API_BASE_URL = 'http://127.0.0.1:5000/api/auth';

// Sección 1: Lógica de Interfaz y Navegación
// ------------------------------------------

const btnMenu = document.getElementById("btnMenu");
const menu = document.getElementById("menuLateral");
const btnCerrar = document.getElementById("btnCerrar");
const circuloHabilidades = document.getElementById("circuloHabilidades");

// Elementos de las nuevas tarjetas
const tarjetaPersonales = document.getElementById("tarjetaPersonales");
const tarjetaEquipo = document.getElementById("tarjetaEquipo");

// Todas las sub-tarjetas
const subtarjetas = document.querySelectorAll("#subTarjetasFlotantes .subtarjeta");
const subtarjetasPersonales = document.querySelectorAll(".personal-card");
const subtarjetasEquipo = document.querySelectorAll(".equipo-card");
const btnCerrarSubtarjeta = document.querySelectorAll(".cerrar-subtarjeta");

// Funcionalidad del Menú Lateral
if (btnMenu && menu) {
    btnMenu.addEventListener("click", () => {
        menu.classList.toggle("mostrar");
    });
}
if (btnCerrar && menu) {
    btnCerrar.addEventListener("click", () => {
        menu.classList.remove("mostrar");
    });
}

// Animación de rotación del círculo
if (circuloHabilidades) {
    circuloHabilidades.addEventListener("click", () => {
        circuloHabilidades.classList.add("girar");
        setTimeout(() => {
            circuloHabilidades.classList.remove("girar");
        }, 800); 
    });
}

// Lógica de las Tarjetas Flotantes Individuales
function mostrarTarjetas(cardsToShow) {
    subtarjetas.forEach(card => {
        card.classList.remove("mostrar-individual");
        card.style.animationDelay = '';
    });

    cardsToShow.forEach((card, index) => {
        setTimeout(() => {
            card.style.animationDelay = `${0.1 + index * 0.1}s`; 
            card.classList.add("mostrar-individual");
        }, 10); 
    });
}

// Eventos de clic para las tarjetas principales
if (tarjetaPersonales) {
    tarjetaPersonales.addEventListener("click", () => {
        mostrarTarjetas(subtarjetasPersonales);
    });
}
if (tarjetaEquipo) {
    tarjetaEquipo.addEventListener("click", () => {
        mostrarTarjetas(subtarjetasEquipo);
    });
}

// Eventos de clic para los botones de cerrar (ocultan solo su propia tarjeta)
btnCerrarSubtarjeta.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const subtarjeta = e.target.closest(".subtarjeta");
        if (subtarjeta) {
            subtarjeta.classList.remove("mostrar-individual");
        }
    });
});


// Sección 2: Lógica de Autenticación (Login, Register, Logout)
// -------------------------------------------------------------

/**
 * Función para manejar el registro de nuevos usuarios (iniciore.html).
 */
async function handleRegister(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ ' + data.msg);
            // Redirige al inicio de sesión después del registro
            window.location.href = '/iniciose'; 
        } else {
            alert('❌ Error de registro: ' + data.msg);
        }
    } catch (error) {
        console.error('Error de conexión con la API:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
}

/**
 * Función para manejar el inicio de sesión de usuarios (iniciose.html).
 */
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('🎉 ' + data.msg);
            // Redirige al index.html después del login exitoso
            window.location.href = '/index'; 
        } else {
            alert('❌ Error al iniciar sesión: ' + data.msg);
        }
    } catch (error) {
        console.error('Error de conexión con la API:', error);
        alert('Hubo un problema al conectar con el servidor.');
    }
}

/**
 * Función para manejar el cierre de sesión.
 */
async function handleLogout(event) {
    if (event) event.preventDefault(); 

    try {
        await fetch(`${API_BASE_URL}/logout`, {
            method: 'GET',
        });
        
        // Siempre redirige al inicio, ya que la sesión en el backend se limpió
        alert('Sesión cerrada correctamente.');
        window.location.href = '/'; 

    } catch (error) {
        console.error('Error al cerrar la sesión:', error);
        alert('Hubo un problema al intentar cerrar la sesión. Redirigiendo al inicio.');
        window.location.href = '/';
    }
}


// Sección 3: Inicialización y Enlace de Eventos
// ---------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Enlazar el formulario de REGISTRO
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Enlazar el formulario de INICIO DE SESIÓN
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Enlazar el botón de CERRAR SESIÓN (Necesita un id="logoutButton" en el HTML)
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

//___________________________________________________________________________________________________
// // funciones.js

// Función para enviar la encuesta
async function submitSurvey(event) {
    // Solo existe en encuesta.html, pero se asegura de que no haya un error si se llama desde otro lado
    if (event) { 
        event.preventDefault();
    } else {
        return;
    }

    const form = document.getElementById('surveyForm');
    const formData = new FormData(form);
    const questions = {};
    let allAnswered = true;

    // Recolectar las 20 respuestas
    for (let i = 1; i <= 20; i++) {
        const q_name = `q${i}`;
        const answer = formData.get(q_name);
        
        // Verifica si la pregunta fue respondida
        if (answer === null) {
            allAnswered = false;
            break;
        }
        questions[q_name] = answer;
    }

    if (!allAnswered) {
        alert("Por favor, responde las 20 preguntas antes de enviar.");
        return;
    }

    const dataToSend = { questions: questions };
    const messageBox = document.getElementById('surveyMessage');
    messageBox.textContent = 'Enviando respuestas...';
    messageBox.style.color = 'gray';

    try {
        const response = await fetch('/api/survey/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        const result = await response.json();
        
        if (response.ok) {
            messageBox.style.color = 'green';
            messageBox.textContent = result.msg;
            
            // Recargar la página para mostrar el nuevo resultado (el nivel Alto, Medio o Bajo)
            setTimeout(() => {
                window.location.reload(); 
            }, 1500);
        } else {
            messageBox.style.color = 'red';
            messageBox.textContent = result.msg || 'Error al guardar la encuesta.';
        }

    } catch (error) {
        messageBox.style.color = 'red';
        messageBox.textContent = 'Error de conexión con el servidor.';
        console.error('Error:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica del menú (copiada de tu código original) ---
    const menuLateral = document.getElementById('menuLateral');
    const btnMenu = document.getElementById('btnMenu');
    const btnCerrar = document.getElementById('btnCerrar');

    if (btnMenu) {
        btnMenu.addEventListener('click', () => {
            menuLateral.classList.add('visible');
        });
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            menuLateral.classList.remove('visible');
        });
    }

    // --- Lógica para mostrar/ocultar el formulario de encuesta en encuesta.html ---
    const startNewSurveyBtn = document.getElementById('startNewSurveyBtn');
    const surveyForm = document.getElementById('surveyForm');
    const lastResultBox = document.getElementById('lastResultBox');
    const noResultBox = document.getElementById('noResultBox');
    
    // Esta lógica solo se ejecuta en la página encuesta.html
    if (startNewSurveyBtn && surveyForm) {
        startNewSurveyBtn.addEventListener('click', () => {
            // Oculta el contenedor de resultados (si existe)
            if (lastResultBox) {
                lastResultBox.classList.add('hidden');
            }
            // Oculta el contenedor de 'no resultados' (si existe)
            if (noResultBox) {
                noResultBox.classList.add('hidden');
            }
            // Muestra el formulario
            surveyForm.classList.remove('hidden');
            
            // Mover la vista hacia el inicio del formulario
            surveyForm.scrollIntoView({ behavior: 'smooth' });
        });
    }
    // Fin de la lógica de encuesta
});