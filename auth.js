// Sistema de autenticación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth system initialized');
    
    // Inicializar usuarios si no existen
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }
    
    // Verificar usuario actual
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        console.log('User logged in:', currentUser.email);
        updateNavigation(currentUser);
    } else {
        console.log('No user logged in');
    }
    
    // Inicializar formularios
    initForms();
});

function initForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) {
        console.log('Login form found');
        // Eliminar listener previo si existe
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        console.log('Register form found');
        // Eliminar listener previo si existe
        registerForm.removeEventListener('submit', handleRegister);
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Deshabilitar botones sociales
    document.querySelectorAll('.social-btn.disabled').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showMessage('Esta opción no está disponible actualmente', 'error');
        });
    });
}

function handleLogin(event) {
    event.preventDefault();
    console.log('Login attempt');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Limpiar errores previos
    clearErrors();
    
    if (!validateEmail(email)) {
        showMessage('Por favor, introduce un correo electrónico válido', 'error');
        highlightErrorField('email', 'Correo electrónico inválido');
        return;
    }
    
    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Users in storage:', users);
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
        // Usuario no encontrado
        showMessage('Correo electrónico no registrado', 'error');
        highlightErrorField('email', 'Este correo no está registrado');
        return;
    }
    
    if (user.password !== password) {
        // Contraseña incorrecta
        showMessage('Contraseña incorrecta', 'error');
        highlightErrorField('password', 'Contraseña incorrecta');
        return;
    }
    
    console.log('User found:', user);
    // Guardar usuario actual
    localStorage.setItem('currentUser', JSON.stringify(user));
    showMessage('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
    
    // Redirigir a la página principal después de 1.5 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function handleRegister(event) {
    event.preventDefault();
    console.log('Registration attempt');
    
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Limpiar errores previos
    clearErrors();
    
    // Validaciones
    let hasError = false;
    
    if (!nombre) {
        highlightErrorField('nombre', 'El nombre es obligatorio');
        hasError = true;
    }
    
    if (!apellidos) {
        highlightErrorField('apellidos', 'Los apellidos son obligatorios');
        hasError = true;
    }
    
    if (!email) {
        highlightErrorField('email', 'El correo electrónico es obligatorio');
        hasError = true;
    } else if (!validateEmail(email)) {
        highlightErrorField('email', 'Correo electrónico inválido');
        hasError = true;
    }
    
    if (!password) {
        highlightErrorField('password', 'La contraseña es obligatoria');
        hasError = true;
    } else if (password.length < 6) {
        highlightErrorField('password', 'La contraseña debe tener al menos 6 caracteres');
        hasError = true;
    }
    
    if (!confirmPassword) {
        highlightErrorField('confirmPassword', 'Debes confirmar la contraseña');
        hasError = true;
    } else if (password !== confirmPassword) {
        highlightErrorField('confirmPassword', 'Las contraseñas no coinciden');
        if (password) {
            highlightErrorField('password', 'Las contraseñas no coinciden');
        }
        hasError = true;
    }
    
    if (hasError) {
        showMessage('Por favor, corrige los errores en el formulario', 'error');
        return;
    }
    
    // Obtener usuarios existentes
    const users = JSON.parse(localStorage.getItem('users')) || [];
    console.log('Existing users:', users);
    
    // Verificar si el usuario ya existe
    if (users.find(u => u.email === email)) {
        showMessage('Este correo ya está registrado', 'error');
        highlightErrorField('email', 'Este correo ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        nombre,
        apellidos,
        email,
        password,
        fechaRegistro: new Date().toISOString()
    };
    
    console.log('New user to add:', newUser);
    
    // Agregar nuevo usuario
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('¡Cuenta creada exitosamente! Redirigiendo al login...', 'success');
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function highlightErrorField(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');
        
        // Crear o actualizar mensaje de error debajo del campo
        let errorSpan = field.parentNode.querySelector('.field-error');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'field-error';
            field.parentNode.appendChild(errorSpan);
        }
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }
}

function clearErrors() {
    // Remover clases de error
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('error');
    });
    
    // Remover mensajes de error
    document.querySelectorAll('.field-error').forEach(errorSpan => {
        errorSpan.style.display = 'none';
    });
    
    // Limpiar mensaje principal
    const messageDiv = document.getElementById('authMessage');
    if (messageDiv) {
        messageDiv.textContent = '';
        messageDiv.className = 'auth-message';
    }
}

function showMessage(message, type) {
    console.log(`${type}: ${message}`);
    
    const messageDiv = document.getElementById('authMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        
        // Limpiar mensaje después de 5 segundos
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'auth-message';
        }, 5000);
    } else {
        alert(message);
    }
}

function logout() {
    console.log('Logging out');
    localStorage.removeItem('currentUser');
    showMessage('Sesión cerrada exitosamente', 'success');
    
    // Redirigir a la página principal
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function updateNavigation(user) {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.innerHTML = `
            <div class="user-menu-item">
                <a href="#" onclick="toggleUserDropdown(event)">
                    👤 ${user.nombre}
                </a>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" onclick="viewProfile()">Mi Perfil</a>
                    <a href="#" onclick="viewOrders()">Mis Pedidos</a>
                    <a href="#" onclick="logout()">Cerrar Sesión</a>
                </div>
            </div>
        `;
    }
}

function toggleUserDropdown(event) {
    event.preventDefault();
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function viewProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        alert(`Perfil de Usuario:\n\nNombre: ${user.nombre}\nApellidos: ${user.apellidos}\nEmail: ${user.email}\nMiembro desde: ${new Date(user.fechaRegistro).toLocaleDateString()}`);
    }
}

function viewOrders() {
    alert('Historial de pedidos - Esta funcionalidad estará disponible próximamente');
}

// Función global para verificar si hay usuario logueado
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return !!currentUser;
}