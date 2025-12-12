const IVA_RATE = 0.15; 
let users = [ 
    { username: 'admin', email: 'admin@petspa.com', password: '123' },
    { username: 'prueba', email: 'prueba@test.com', password: 'Password1!' }
];

let owners = [];
let pets = [];
let appointments = [];
let cart = []; 


const products = [
    { id: 1, name: "Shampoo Hipoalergénico", price: 15.50, image: 'ShampooHipoalergenico.jpg' },
    { id: 2, name: "Pelota de Goma", price: 5.99, image: 'PelotadeGoma.jpg' },
    { id: 3, name: "Comida Premium 1kg", price: 25.00, image: 'ComidaPremium1kg.jpg' },
    { id: 4, name: "Juguete Cuerda", price: 7.50, image: 'JugueteCuerda.jpg' },
];

const loginContainer = document.getElementById('login-container');
const systemContainer = document.getElementById('system-container');

const viewLogin = document.getElementById('view-login');
const viewRegister = document.getElementById('view-register');
const viewReset = document.getElementById('view-reset');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const resetForm = document.getElementById('reset-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');
const resetMessage = document.getElementById('reset-message');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const backToLoginBtns = document.querySelectorAll('#back-to-login, #back-to-login-from-reset');
const logoutBtn = document.getElementById('logout-btn');
const regPasswordInput = document.getElementById('reg-password');
const passwordRequirements = document.getElementById('password-requirements');

const ownerForm = document.getElementById('owner-form');
const petForm = document.getElementById('pet-form');
const scheduleForm = document.getElementById('schedule-form');
const catalogContainer = document.getElementById('catalog-container');
const petSelect = document.getElementById('schedule-pet');
const scheduledAppointmentsContainer = document.getElementById('scheduled-appointments');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');



function showMessage(element, message, isSuccess = false) {
    element.className = isSuccess ? 'success-message' : 'error-message';
    element.textContent = message;
}

function showFormMessage(formElement, message, isSuccess) {
    let messageElement = formElement.querySelector('.form-message');
    if (!messageElement) {
        messageElement = document.createElement('p');
        messageElement.classList.add('form-message');
        formElement.appendChild(messageElement);
    }
    showMessage(messageElement, message, isSuccess);
    
    setTimeout(() => {
        messageElement.textContent = '';
    }, 3000);
}



function switchLoginView(viewId) {
    [viewLogin, viewRegister, viewReset].forEach(v => v.classList.add('hidden'));
    [tabLogin, tabRegister].forEach(t => t.classList.remove('active'));

    if (viewId === 'login') {
        viewLogin.classList.remove('hidden');
        tabLogin.classList.add('active');
        loginMessage.textContent = '';
    } else if (viewId === 'register') {
        viewRegister.classList.remove('hidden');
        tabRegister.classList.add('active');
        validatePasswordComplexity(""); 
    } else if (viewId === 'reset') {
        viewReset.classList.remove('hidden');
    }
}

tabLogin.addEventListener('click', () => switchLoginView('login'));
tabRegister.addEventListener('click', () => switchLoginView('register'));
backToLoginBtns.forEach(btn => btn.addEventListener('click', () => switchLoginView('login')));
forgotPasswordLink.addEventListener('click', () => {
    switchLoginView('reset');
    resetMessage.textContent = '';
    resetForm.reset();
});

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const usernameOrEmail = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const user = users.find(u => 
        (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
    );
    if (user) {
        sessionStorage.setItem('isLoggedIn', 'true');
        showSystem();
    } else {
        showMessage(loginMessage, 'Usuario, correo o contraseña incorrectos.', false);
    }
});

function validatePasswordComplexity(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[!@#$%^&*()]/.test(password),
    };

    if (passwordRequirements) {
        document.getElementById('req-length').classList.toggle('valid', requirements.length);
        document.getElementById('req-uppercase').classList.toggle('valid', requirements.uppercase);
        document.getElementById('req-number').classList.toggle('valid', requirements.number);
        document.getElementById('req-symbol').classList.toggle('valid', requirements.symbol);
    }
    return Object.values(requirements).every(val => val);
}
regPasswordInput.addEventListener('input', function() { validatePasswordComplexity(this.value); });

registerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = regPasswordInput.value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (users.find(u => u.username === username)) { showMessage(registerMessage, '❌ Error: El usuario ya existe.', false); return; }
    if (!emailPattern.test(email)) { showMessage(registerMessage, '❌ Error: Formato de correo electrónico no válido.', false); return; }
    if (password !== confirmPassword) { showMessage(registerMessage, '❌ Error: Las contraseñas no coinciden.', false); return; }
    if (!validatePasswordComplexity(password)) { showMessage(registerMessage, '❌ Error: La contraseña no cumple los requisitos.', false); return; }

    users.push({ username, email, password }); 
    showMessage(registerMessage, `✅ Cuenta creada con éxito para ${username}.`, true);
    registerForm.reset();
    setTimeout(() => switchLoginView('login'), 2000); 
});

resetForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('reset-email').value.trim();
    const user = users.find(u => u.email === email);
    if (user) {
        showMessage(resetMessage, `✅ Instrucciones de restablecimiento enviadas a ${email}.`, true);
    } else {
        showMessage(resetMessage, '❌ Error: Correo no asociado a ninguna cuenta.', false);
    }
});

document.querySelectorAll('.password-toggle').forEach(toggle => {
    toggle.addEventListener('click', function() {
        let targetInput;
        const formGroup = this.closest('.form-group');
        targetInput = formGroup.querySelector('input[type="password"], input[type="text"]'); 

        if (this.dataset.inputId) {
            targetInput = document.getElementById(this.dataset.inputId);
        }
        
        if (targetInput) {
            const type = targetInput.getAttribute('type') === 'password' ? 'text' : 'password';
            targetInput.setAttribute('type', type);
            this.textContent = (type === 'password' ? '👁️' : '🔒');
        }
    });
});

function showSystem() {
    loginContainer.classList.add('hidden');
    systemContainer.classList.remove('hidden');
    loadCatalog(); 
    initializeModuleHandlers();
    populatePetSelect(); 
    renderAppointments(); 
    renderCart(); 
}

function showLogin() {
    loginContainer.classList.remove('hidden');
    systemContainer.classList.add('hidden');
    switchLoginView('login');
}

logoutBtn.addEventListener('click', function() {
    sessionStorage.removeItem('isLoggedIn');
    showLogin();
});



ownerForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('owner-name').value.trim();
    const phone = document.getElementById('owner-phone').value.trim();
    const email = document.getElementById('owner-email').value.trim(); 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (name.length < 3 || !emailPattern.test(email)) {
        showFormMessage(ownerForm, '⚠️ Verifique nombre (mín 3 caracteres) y correo electrónico.', false);
        return;
    }
    const newOwner = { id: owners.length + 1, name, phone, email };
    owners.push(newOwner);
    showFormMessage(ownerForm, `✅ Dueño '${name}' registrado con ID ${newOwner.id}.`, true);
    ownerForm.reset();
});

petForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('pet-name').value.trim();
    const species = document.getElementById('pet-species').value.trim();
    
    if (name.length === 0 || species.length === 0) {
        showFormMessage(petForm, '⚠️ Nombre y Especie de la mascota son obligatorios.', false);
        return;
    }
    const newPet = { 
        id: pets.length + 1, 
        name, 
        species, 
        breed: document.getElementById('pet-breed').value.trim() 
    };
    pets.push(newPet);
    showFormMessage(petForm, `✅ Mascota '${name}' registrada.`, true);
    petForm.reset();
    populatePetSelect(); 
});



function populatePetSelect() {
    petSelect.innerHTML = '<option value="">Seleccione una mascota</option>';
    if (pets.length === 0) {
        petSelect.innerHTML += '<option disabled>No hay mascotas registradas</option>';
        petSelect.disabled = true;
        return;
    }
    petSelect.disabled = false;
    pets.forEach(pet => {
        const option = document.createElement('option');
        option.value = pet.name; 
        option.textContent = `${pet.name} (${pet.species})`;
        petSelect.appendChild(option);
    });
}

scheduleForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const date = document.getElementById('schedule-date').value;
    const time = document.getElementById('schedule-time').value;
    const pet = petSelect.value; 
    const service = document.getElementById('schedule-service').value;

    if (!pet || pet === "" || !service || service === "") {
        showFormMessage(scheduleForm, "🚨 Por favor, complete todos los campos.", false);
        return;
    }

    const newAppointment = { date, time, pet, service };
    appointments.push(newAppointment);
    showFormMessage(scheduleForm, `✅ Cita agendada para ${pet} en ${date} a las ${time}.`, true);
    scheduleForm.reset();
    renderAppointments(); 
});

function renderAppointments() {
    if (!scheduledAppointmentsContainer) return;

    scheduledAppointmentsContainer.innerHTML = '';
    if (appointments.length === 0) {
        scheduledAppointmentsContainer.innerHTML = '<p style="text-align: center; color: #555;">No hay citas agendadas aún.</p>';
        return;
    }
    let html = '<ul>';
    appointments.forEach((appt) => {
        html += `<li>📅 <strong>${appt.date}</strong> a las <strong>${appt.time}</strong> | Mascota: <strong>${appt.pet}</strong> | Servicio: <strong>${appt.service}</strong></li>`;
    });
    html += '</ul>';
    scheduledAppointmentsContainer.innerHTML = html;
}



function loadCatalog() {
    if (!catalogContainer) return;
    catalogContainer.innerHTML = '';
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="imagenes/${product.image || 'default.jpg'}" alt="${product.name}" class="product-img">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
            <button class="btn-buy" data-product-id="${product.id}">Comprar</button>
        `;
        catalogContainer.appendChild(card);
    });
}

function addProductToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1; 
    } else {
        cart.push({ ...product, quantity: 1 }); 
    }
    
    renderCart(); 
}

function renderCart() {
    if (!cartItemsContainer || !cartSubtotalElement || !cartTotalElement) return;

    cartItemsContainer.innerHTML = ''; 
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="5" style="text-align: center;">El carrito está vacío.</td></tr>';
        subtotal = 0;
    } else {
        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <img src="imagenes/${item.image}" alt="${item.name}" class="cart-product-img">
                </td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemSubtotal.toFixed(2)}</td>
            `;
            cartItemsContainer.appendChild(row);
        });
    }

    const total = subtotal * (1 + IVA_RATE);

    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = ''; 
    let subtotal = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="4" style="text-align: center;">El carrito está vacío.</td></tr>';
        subtotal = 0;
    } else {
        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${itemSubtotal.toFixed(2)}</td>
            `;
            cartItemsContainer.appendChild(row);
        });
    }

    const total = subtotal * (1 + IVA_RATE);

    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

function initializeModuleHandlers() {
    const navLinks = document.querySelectorAll('#navbar ul li a');
    const modules = document.querySelectorAll('.module');

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const moduleToShow = this.getAttribute('data-module');
            modules.forEach(module => {
                module.classList.add('hidden');
                if (module.id === `${moduleToShow}-module`) {
                    module.classList.remove('hidden');
                }
            });
        });
    });

    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.onclick = function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            addProductToCart(productId);
        };
    });
}

document.addEventListener('DOMContentLoaded', checkSession);