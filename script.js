function updateGreeting() {
    var hour = new Date().getHours();
    var greeting = 'Good Evening';
    if (hour < 12) {
        greeting = 'Good Morning';
    } else if (hour < 18) {
        greeting = 'Good Afternoon';
    }
    var greetingElement = document.getElementById('greeting');
    if (greetingElement) {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var name = currentUser ? currentUser.fullName.split(' ')[0] : 'Member';
        greetingElement.innerHTML = greeting + ', ' + name + '!';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    updateGreeting();
    loadOrders();
    updateCartCount();
});
function openModal(id) {
    var el = document.getElementById(id);
    if (el) {
        el.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
function closeModal(id) {
    var el = document.getElementById(id);
    if (el) {
        el.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
window.addEventListener('click', function (event) {
    if (event.target && event.target.classList && event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});
function handleLogin(e) {
    e.preventDefault();
    var userVal = document.getElementById('username').value;
    var passVal = document.getElementById('password').value;
    var users = JSON.parse(localStorage.getItem('users')) || [];
    var foundUser = null;
    for (var i = 0; i < users.length; i++) {
        if ((users[i].username === userVal || users[i].email === userVal) && users[i].password === passVal) {
            foundUser = users[i];
            break;
        }
    }
    if (!foundUser && userVal === 'akhilesh' && passVal === 'akhi') {
        var defaultUser = { fullName: 'Akhilesh', username: 'akhilesh', email: 'akhi@tech.com' };
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
        if (!localStorage.getItem('orders_akhilesh')) {
            var defaultOrders = [
                { id: 'ORD-9921', service: 'App Development', date: 'Mar 2026', status: 'In Progress' },
                { id: 'ORD-8812', service: 'Web Development', date: 'Jan 2026', status: 'Completed' },
                { id: 'ORD-7734', service: 'Cloud Solutions', date: 'Nov 2025', status: 'Completed' }
            ];
            localStorage.setItem('orders_akhilesh', JSON.stringify(defaultOrders));
        }
        window.location.href = 'dashboard.html';
        return;
    }
    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        window.location.href = 'dashboard.html';
    } else {
        var errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.textContent = 'Invalid username or password. Please try again.';
            errorMsg.style.display = 'block';
        }
    }
}
function handleSignup(e) {
    e.preventDefault();
    var fullName = document.getElementById('signupFullName').value;
    var email = document.getElementById('signupEmail').value;
    var username = document.getElementById('signupUsername').value;
    var password = document.getElementById('signupPassword').value;
    var users = JSON.parse(localStorage.getItem('users')) || [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === email) {
            alert('Username or Email already exists. Please use different details.');
            return;
        }
    }
    users.push({ fullName: fullName, email: email, username: username, password: password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful! Please login with your new credentials.');
    window.location.href = 'login.html';
}
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
function checkAuth() {
    var currentUser = localStorage.getItem('currentUser');
    var path = window.location.pathname;
    var isDashboard = path.includes('dashboard.html');
    var isCustomerPage = path.includes('-customer.html');
    if ((isDashboard || isCustomerPage) && !currentUser) {
        window.location.href = 'login.html';
    }
    var heroButtons = document.getElementById('heroButtons');
    if (heroButtons && currentUser) {
        heroButtons.innerHTML =
            '<a href="dashboard.html" class="btn btn-primary">Go to Dashboard</a>' +
            '<a href="#services" class="btn btn-secondary">Explore Services</a>';
    }
}
function toggleFAQ(element) {
    if (!element) return;
    element.classList.toggle('active');
    var symbol = element.querySelector('span:last-child');
    if (symbol) {
        symbol.textContent = element.classList.contains('active') ? '−' : '+';
    }
}
function toggleDropdown() {
    var dropdown = document.getElementById('serviceDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show-dropdown');
    }
}
window.addEventListener('click', function (event) {
    if (!event.target.matches('.btn-primary') && !event.target.closest('.dropdown')) {
        var dropdowns = document.getElementsByClassName('dropdown-content');
        for (var i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show-dropdown')) {
                dropdowns[i].classList.remove('show-dropdown');
            }
        }
    }
});
function addToCart(serviceName) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        alert('Please login first to add services to your cart.');
        window.location.href = 'login.html';
        return;
    }
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i] === serviceName) {
            alert(serviceName + ' is already in your cart!');
            return;
        }
    }
    cart.push(serviceName);
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
    alert(serviceName + ' has been added to your cart! Go to dashboard to book.');
}
function updateCartCount() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    var cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        if (cart.length > 0) {
            cartCountEl.textContent = cart.length;
            cartCountEl.style.display = 'inline';
        } else {
            cartCountEl.style.display = 'none';
        }
    }
}
function viewCart() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Use "Request Service" to add services!');
        return;
    }
    openModal('cartModal');
    renderCart(cart);
}
function renderCart(cart) {
    var cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">Your cart is empty.</p>';
        return;
    }
    var html = '';
    for (var i = 0; i < cart.length; i++) {
        html += '<div style="display: flex; justify-content: space-between; align-items: center;' +
            'padding: 15px; background: var(--bg-alt); border-radius: 10px; margin-bottom: 10px; border: 1px solid var(--border-color);">';
        html += '<span style="color: var(--text-main); font-weight: 600; font-size: 15px;">' + cart[i] + '</span>';
        html += '<button onclick="removeFromCart(\'' + cart[i] + '\')" ' +
            'style="background: #fee2e2; border: 1px solid #fca5a5; color: #dc2626;' +
            'padding: 5px 14px; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600;">Remove</button>';
        html += '</div>';
    }
    cartItems.innerHTML = html;
}
function removeFromCart(serviceName) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i] !== serviceName) {
            newCart.push(cart[i]);
        }
    }
    localStorage.setItem(cartKey, JSON.stringify(newCart));
    updateCartCount();
    renderCart(newCart);
}
function bookCart() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    var ordersKey = 'orders_' + currentUser.username;
    var orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    for (var i = 0; i < cart.length; i++) {
        var newOrder = {
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            service: cart[i],
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            status: 'In Progress'
        };
        orders.unshift(newOrder);
    }
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    localStorage.setItem(cartKey, JSON.stringify([]));
    updateCartCount();
    closeModal('cartModal');
    alert('All services booked successfully! Your orders are now active on the dashboard.');
    loadOrders();
}
function loadOrders() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    var activeList = document.getElementById('activeOrdersList');
    var prevList = document.getElementById('previousOrdersList');
    if (!activeList || !prevList) return;
    var ordersKey = 'orders_' + currentUser.username;
    var orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    var activeOrders = [];
    var prevOrders = [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].status === 'In Progress') {
            activeOrders.push(orders[i]);
        } else {
            prevOrders.push(orders[i]);
        }
    }
    if (activeOrders.length === 0) {
        activeList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">' +
            'No active orders yet. Use "Request Service" to get started!</p>';
    } else {
        activeList.innerHTML = '';
        for (var i = 0; i < activeOrders.length; i++) {
            var o = activeOrders[i];
            activeList.innerHTML +=
                '<div class="order-card" onclick="toggleOrderDetails(\'' + o.id + '\')" style="cursor: pointer;">' +
                '<div class="order-header">' +
                '<div>' +
                '<strong style="color: var(--text-main); font-size: 18px;">' + o.id + '</strong>' +
                '<p style="color: var(--text-light); font-size: 14px; margin-top: 5px;">' + o.service + ' &bull; ' + o.date + '</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                '<span class="status-badge status-active">' + o.status + '</span>' +
                '<span id="icon-' + o.id + '" style="color: var(--text-muted); font-size: 12px;">▼</span>' +
                '</div>' +
                '</div>' +
                '<div id="details-' + o.id + '" class="order-details" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">' +
                '<p style="color: var(--text-light); font-size: 14px; line-height: 1.6;">' + getServiceDescription(o.service) + '</p>' +
                '<div style="margin-top: 10px; display: flex; gap: 15px;">' +
                '<a href="#" style="color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;">View Project Files</a>' +
                '<a href="#" style="color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;">Contact Manager</a>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }
    if (prevOrders.length === 0) {
        prevList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 20px;">' +
            'No completed orders yet.</p>';
    } else {
        prevList.innerHTML = '';
        for (var i = 0; i < prevOrders.length; i++) {
            var o = prevOrders[i];
            prevList.innerHTML +=
                '<div class="order-card" onclick="toggleOrderDetails(\'' + o.id + '\')" style="cursor: pointer;">' +
                '<div class="order-header">' +
                '<div>' +
                '<strong style="color: var(--text-main); font-size: 18px;">' + o.id + '</strong>' +
                '<p style="color: var(--text-light); font-size: 14px; margin-top: 5px;">' + o.service + ' &bull; ' + o.date + '</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                '<span class="status-badge status-completed">' + o.status + '</span>' +
                '<span id="icon-' + o.id + '" style="color: var(--text-muted); font-size: 12px;">▼</span>' +
                '</div>' +
                '</div>' +
                '<div id="details-' + o.id + '" class="order-details" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">' +
                '<p style="color: var(--text-light); font-size: 14px; line-height: 1.6;">' + getServiceDescription(o.service) + '</p>' +
                '<p style="margin-top: 8px; color: var(--accent); font-size: 13px; font-weight: 600;">Project Archive Available</p>' +
                '</div>' +
                '</div>';
        }
    }
}
function toggleOrderDetails(id) {
    var details = document.getElementById('details-' + id);
    var icon = document.getElementById('icon-' + id);
    if (details) {
        if (details.style.display === 'none') {
            details.style.display = 'block';
            if (icon) icon.textContent = '▲';
        } else {
            details.style.display = 'none';
            if (icon) icon.textContent = '▼';
        }
    }
}
function getServiceDescription(service) {
    var descriptions = {
        'Web Development': 'Developing a responsive corporate website using modern frontend frameworks. Current focus: Performance optimization and SEO integration.',
        'App Development': 'Building an e-commerce mobile application for iOS and Android. Current focus: Payment gateway integration and user authentication.',
        'Cloud Solutions': 'Migrating legacy infrastructure to AWS cloud environment with focus on zero-downtime and high availability architecture.',
        'UI/UX Design': 'Researching user personas and creating high-fidelity prototypes. Designing intuitive workflows for maximum user engagement.',
        'Digital Marketing': 'Social media ad campaigns and Google Ads management to boost brand visibility and lead generation.',
        'Cybersecurity': 'System-wide security audit and implementation of zero-trust architecture to protect sensitive business data.'
    };
    return descriptions[service] || 'Project details are being updated by our team. Check back soon for more information.';
}
