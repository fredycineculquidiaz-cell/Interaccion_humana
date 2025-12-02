// --- LISTA DE PRODUCTOS ---
const productos = [
    {id: 1, nombre: 'Chicharonera Amore', precio: 28.00, categoria: 'Ollas', imagen: 'images/chicharoneria.png', stock: 10},
    {id: 2, nombre: 'Copa Sodera de Vidrio', precio: 3.50, categoria: 'Vasos', imagen: 'images/copa sodera.png', stock: 50},
    {id: 3, nombre: 'Jarrón de Vidrio Labrado', precio: 15.00, categoria: 'Jarras', imagen: 'images/jarron.png', stock: 5},
    {id: 4, nombre: 'Olla Banbuada Antiadherente', precio: 18.00, categoria: 'Ollas', imagen: 'images/olla Banbuada.png', stock: 0},
    {id: 5, nombre: 'Juego de Ollas de Acero', precio: 35.00, categoria: 'Ollas', imagen: 'images/olla de acero.png', stock: 12},
    {id: 6, nombre: 'Set de Platos de Loza', precio: 22.00, categoria: 'Platos', imagen: 'images/platos.png', stock: 20},
    {id: 7, nombre: 'Juego de Cubiertos', precio: 8.00, categoria: 'Cubiertos', imagen: 'images/juego de cubiertos.png', stock: 30},
    {id: 8, nombre: 'Vajilla Completa', precio: 45.00, categoria: 'Vajillas', imagen: 'images/vajillas.png', stock: 7},
    {id: 9, nombre: 'Vaso Mikonos', precio: 4.50, categoria: 'Vasos', imagen: 'images/vaso mikonos .png', stock: 25}
];

let carrito = [];
let slideIndex = 0;
let slideInterval;

document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos();
    startSlideshow();
    document.getElementById('btn-pedir').addEventListener('click', enviarPedido);
    
    // Atajo de teclado CTRL+U para abrir el panel de accesibilidad
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            toggleUserWayPanel();
        }
    });

    // Inicializar menú de usuario si está en la página principal
    initUserMenu();
});

function renderizarProductos() {
    const catalogo = document.getElementById('catalogo');
    if (!catalogo) return;

    const productosParaCatalogo = productos.filter(producto => producto.categoria !== 'Marca');

    catalogo.innerHTML = productosParaCatalogo.map(producto => `
    <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <div class="producto-info">
            <h3>${producto.nombre}</h3>
            <p class="categoria">Categoría: ${producto.categoria}</p>
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <p class="stock ${producto.stock === 0 ? 'agotado' : ''}">Stock: ${producto.stock > 0 ? producto.stock : 'Agotado'}</p>
            <button ${producto.stock === 0 ? 'disabled' : ''} onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
        </div>
    </div>
    `).join('');
}

function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);

    if (producto.stock === 0) {
        alert('Este producto está agotado.');
        return;
    }

    const itemExistente = carrito.find(item => item.id === id);
    if (itemExistente) {
        if (itemExistente.cantidad < producto.stock) {
            itemExistente.cantidad++;
        } else {
            alert(`No hay más stock disponible de ${producto.nombre}.`);
            return;
        }
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    renderizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    renderizarCarrito();
}

function renderizarCarrito() {
    const itemsContainer = document.getElementById('items');
    const totalContainer = document.getElementById('total');
    const cartCount = document.getElementById('cart-count');

    if (!itemsContainer || !totalContainer || !cartCount) return;

    itemsContainer.innerHTML = carrito.map(item => `
    <div class="item">
        <span>${item.nombre} (x${item.cantidad})</span>
        <strong>$${(item.precio * item.cantidad).toFixed(2)}</strong>
        <button onclick="eliminarDelCarrito(${item.id})">X</button>
    </div>
    `).join('');

    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    totalContainer.textContent = `Total: $${total.toFixed(2)}`;
    cartCount.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

function enviarPedido() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;

    if (!nombre || !direccion) {
        alert("Por favor, completa tu nombre y dirección.");
        return;
    }

    let mensaje = `¡Hola Locería Sanches! 👋\n\nQuisiera hacer el siguiente pedido:\n`;
    mensaje += `-----------------------------------\n`;
    carrito.forEach(item => {
        mensaje += `🔹 ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}\n`;
    });
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    mensaje += `-----------------------------------\n`;
    mensaje += `*TOTAL: $${total.toFixed(2)}*\n\n`;
    mensaje += `*Datos de Envío:*\n`;
    mensaje += `👤 *Nombre:* ${nombre}\n`;
    mensaje += `🚚 *Dirección:* ${direccion}\n\n`;
    mensaje += `¡Gracias! Quedo a la espera de la confirmación.`;

    const telefono = '51999888777';
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

function showSlides() {
    let slides = document.querySelectorAll('.slide');
    if (!slides.length) return;

    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
}

function startSlideshow() {
    let slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        slides[slideIndex].classList.add('active');
    }
    slideInterval = setInterval(showSlides, 4000);
}

function nextSlide() {
    clearInterval(slideInterval);
    showSlides();
    slideInterval = setInterval(showSlides, 4000);
}

function prevSlide() {
    clearInterval(slideInterval);
    let slides = document.querySelectorAll('.slide');
    if (!slides.length) return;
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    slides[slideIndex].classList.add('active');
    slideInterval = setInterval(showSlides, 4000);
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function toggleMenu() {
    const navUl = document.querySelector('header nav ul');
    if (navUl) {
        if (navUl.style.display === 'flex') {
            navUl.style.display = 'none';
        } else {
            navUl.style.display = 'flex';
            navUl.style.flexDirection = 'column';
            navUl.style.position = 'absolute';
            navUl.style.top = '70px';
            navUl.style.left = '0';
            navUl.style.width = '100%';
            navUl.style.background = '#E53935';
            navUl.style.padding = '1rem';
            navUl.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        }
    }
}

// Funciones para accesibilidad estilo UserWay
function toggleUserWayPanel() {
    const panel = document.getElementById('userWayPanel');
    if (panel) {
        panel.classList.toggle('show');
    }
}

function toggleContrast() {
    document.body.classList.toggle('high-contrast');
}

function toggleHighlightLinks() {
    document.body.classList.toggle('highlight-links');
}

function toggleLargeText() {
    document.body.classList.toggle('large-text');
}

function toggleTextSpacing() {
    document.body.classList.toggle('text-spacing');
}

function toggleAnimations() {
    document.body.classList.toggle('no-animations');
    if (document.body.classList.contains('no-animations')) {
        clearInterval(slideInterval);
    } else {
        startSlideshow();
    }
}

function toggleHideImages() {
    document.body.classList.toggle('hide-images');
}

function resetAccessibility() {
    document.body.classList.remove(
        'high-contrast', 
        'highlight-links', 
        'large-text', 
        'text-spacing', 
        'no-animations', 
        'hide-images'
    );
    startSlideshow();
}

// Inicializar menú de usuario
// En la función initUserMenu(), reemplazar con esto:
function initUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (!userMenu) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        userMenu.innerHTML = `
            <div class="user-menu-item">
                <a href="#" onclick="toggleUserDropdown(event)">
                    👤 ${currentUser.nombre}
                </a>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" onclick="viewProfile()">Mi Perfil</a>
                    <a href="#" onclick="viewOrders()">Mis Pedidos</a>
                    <a href="#" onclick="logout()">Cerrar Sesión</a>
                </div>
            </div>
        `;
    } else {
        userMenu.innerHTML = '<a href="login.html">Iniciar Sesión</a>';
    }
}

// Agregar estas funciones al final del archivo script.js:
function viewProfile() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        alert(`Perfil de Usuario:\n\nNombre: ${user.nombre}\nApellidos: ${user.apellidos}\nEmail: ${user.email}\nMiembro desde: ${new Date(user.fechaRegistro).toLocaleDateString()}`);
    }
}

function viewOrders() {
    alert('Historial de pedidos - Esta funcionalidad estará disponible próximamente');
}

function logout() {
    localStorage.removeItem('currentUser');
    alert('Sesión cerrada exitosamente');
    
    // Actualizar menú
    initUserMenu();
    // Recargar página
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

// Actualizar el evento click para cerrar dropdowns
document.addEventListener('click', function(event) {
    const panel = document.getElementById('userWayPanel');
    const btn = document.querySelector('.userway-btn');
    
    if (panel && btn) {
        if (!panel.contains(event.target) && !btn.contains(event.target)) {
            panel.classList.remove('show');
        }
    }

    // Cerrar dropdown de usuario al hacer clic fuera
    const userDropdown = document.getElementById('userDropdown');
    const userMenuItem = document.querySelector('.user-menu-item');
    
    if (userDropdown && userMenuItem) {
        if (!event.target.closest('.user-menu-item')) {
            userDropdown.classList.remove('show');
        }
    }
});

// Funciones del menú de usuario (se implementan en auth.js)
function viewProfile() {
    alert('Perfil del usuario - Esta funcionalidad estará disponible próximamente');
}

function viewOrders() {
    alert('Historial de pedidos - Esta funcionalidad estará disponible próximamente');
}

// Agregar esta función para inicializar el menú de usuario
function initUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (!userMenu) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        userMenu.innerHTML = `
            <div class="user-menu-item">
                <a href="#" onclick="toggleUserDropdown(event)">
                    👤 ${currentUser.nombre}
                </a>
                <div class="user-dropdown" id="userDropdown">
                    <a href="#" onclick="viewProfile()">Mi Perfil</a>
                    <a href="#" onclick="viewOrders()">Mis Pedidos</a>
                    <a href="#" onclick="logout()">Cerrar Sesión</a>
                </div>
            </div>
        `;
    } else {
        userMenu.innerHTML = '<a href="login.html">Iniciar Sesión</a>';
    }
}

// Llamar a initUserMenu cuando se carga la página principal
document.addEventListener('DOMContentLoaded', function() {
    // ... tu código existente ...
    
    // Inicializar menú de usuario
    initUserMenu();
});

// Resto de tu código existente...