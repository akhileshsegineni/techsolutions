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
        var currentEmployee = JSON.parse(localStorage.getItem('currentEmployee'));
        var isEmployeeView = window.location.pathname.includes('employee-dashboard.html');
        
        var name = 'Member';
        if (isEmployeeView && currentEmployee) {
            name = 'Team ' + currentEmployee.name;
        } else if (currentUser) {
            name = currentUser.fullName.split(' ')[0];
        }
        greetingElement.innerHTML = greeting + ', ' + name + '!';
    }
}
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    updateGreeting();
    loadOrders();
    updateCartCount();
    
    // Auto-update if data changes in another tab (Real-time sync)
    window.addEventListener('storage', function(e) {
        if (e.key && e.key.startsWith('orders_')) {
            loadOrders();       // For customer dashboard
            loadEmployeeOrders(); // For employee dashboard
        }
    });
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
                { id: 'ORD-9921', assignedEmployee: 'emp1', service: 'App Development', date: 'Mar 2026', status: 'In Progress', checkpoints: [{title: 'Started', completed: true}, {title: 'Backend Setup', completed: true}, {title: 'Completed', completed: false}], messages: [{sender: 'AS Project Manager', text: 'We have added Elasticsearch to the current sprint to handle instant auto-complete.'}] },
                { id: 'ORD-8812', assignedEmployee: 'emp2', service: 'Web Development', date: 'Jan 2026', status: 'Completed', checkpoints: [{title: 'Started', completed: true}, {title: 'QA Testing', completed: true}, {title: 'Completed', completed: true}], messages: [{sender: 'Lead Developer', text: 'We heavily optimized all assets and set up CDN routing as discussed.'}] },
                { id: 'ORD-7734', assignedEmployee: 'emp1', service: 'Cloud Solutions', date: 'Nov 2025', status: 'Completed', checkpoints: [{title: 'Started', completed: true}, {title: 'Cloud Migration', completed: true}, {title: 'Completed', completed: true}], messages: [{sender: 'Cloud Architect', text: 'The global DNS propagation is complete.'}] }
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
    var currentEmployee = localStorage.getItem('currentEmployee');
    var path = window.location.pathname;
    
    if (path.includes('employee-dashboard.html')) {
        if (!currentEmployee) {
            window.location.href = 'employee-login.html';
        }
        return;
    }
    
    var isDashboard = path.includes('dashboard.html') && !path.includes('employee-dashboard.html');
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
function openBookingModal() {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    closeModal('cartModal');
    openModal('bookingModal');
}

function handleBookingSubmit(e) {
    e.preventDefault();

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));

    var personDetails = {
        name: currentUser ? currentUser.fullName : 'Guest',
        email: currentUser ? currentUser.email : '',
        phone: 'N/A' // No longer collected in the form
    };

    var projectDetails = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDesc').value,
        timeline: document.getElementById('projectTimeline').value
    };

    bookCart(personDetails, projectDetails);
}

function bookCart(person, project) {
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var cartKey = 'cart_' + currentUser.username;
    var cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    var ordersKey = 'orders_' + currentUser.username;
    var orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    var lastAssigned = localStorage.getItem('lastAssigned') === 'emp1' ? 'emp2' : 'emp1';
    localStorage.setItem('lastAssigned', lastAssigned);
    
    for (var i = 0; i < cart.length; i++) {
        var assignedEmp = lastAssigned;
        var newOrder = {
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            assignedEmployee: assignedEmp,
            service: cart[i],
            date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            status: 'In Progress',
            person: person,
            project: project,
            checkpoints: [{title: 'Started', completed: true}, {title: 'Completed', completed: false}],
            messages: []
        };
        orders.unshift(newOrder);
    }
    localStorage.setItem(ordersKey, JSON.stringify(orders));
    localStorage.setItem(cartKey, JSON.stringify([]));
    updateCartCount();
    closeModal('bookingModal');
    alert('All services booked successfully! Your orders are now active on the dashboard.');

    // Reset form
    var form = document.getElementById('bookingForm');
    if (form) form.reset();

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
            var displayTitle = (o.project && o.project.title) ? o.project.title : o.id;
            var projectInfo = (o.project && o.project.description) ? o.project.description : getServiceDescription(o.service);

            var timelineHtml = renderOrderTimelines(o);
            activeList.innerHTML +=
                '<div class="order-card" onclick="toggleOrderDetails(\'' + o.id + '\')" style="cursor: pointer;">' +
                '<div class="order-header">' +
                '<div>' +
                '<strong style="color: var(--accent); font-size: 18px;">' + displayTitle + '</strong>' +
                '<p style="color: var(--text-light); font-size: 14px; margin-top: 5px;">' + o.service + ' (' + o.id + ') &bull; ' + o.date + '</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                '<span class="status-badge status-active">' + o.status + '</span>' +
                '<span id="icon-' + o.id + '" style="color: var(--text-muted); font-size: 12px;">▼</span>' +
                '</div>' +
                '</div>' +
                '<div id="details-' + o.id + '" class="order-details" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">' +
                '<p style="color: var(--text-light); font-size: 14px; line-height: 1.6;">' + projectInfo + '</p>' +
                timelineHtml +
                '<div style="margin-top: 10px; display: flex; gap: 15px;">' +
                '<a href="javascript:void(0)" onclick="contactManager(\'' + o.id + '\')" style="color: var(--accent); font-size: 13px; font-weight: 600; text-decoration: none;">Contact Manager</a>' +
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
            var displayTitle = (o.project && o.project.title) ? o.project.title : o.id;
            var projectInfo = (o.project && o.project.description) ? o.project.description : getServiceDescription(o.service);
            var timelineHtml = renderOrderTimelines(o);

            prevList.innerHTML +=
                '<div class="order-card" onclick="toggleOrderDetails(\'' + o.id + '\')" style="cursor: pointer;">' +
                '<div class="order-header">' +
                '<div>' +
                '<strong style="color: var(--accent); font-size: 18px;">' + displayTitle + '</strong>' +
                '<p style="color: var(--text-light); font-size: 14px; margin-top: 5px;">' + o.service + ' (' + o.id + ') &bull; ' + o.date + '</p>' +
                '</div>' +
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                '<span class="status-badge status-completed">' + o.status + '</span>' +
                '<span id="icon-' + o.id + '" style="color: var(--text-muted); font-size: 12px;">▼</span>' +
                '</div>' +
                '</div>' +
                '<div id="details-' + o.id + '" class="order-details" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);">' +
                '<p style="color: var(--text-light); font-size: 14px; line-height: 1.6;">' + projectInfo + '</p>' +
                timelineHtml +
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
function viewProjectFiles(id) {
    var filesIDTitle = document.getElementById('filesOrderID');
    var list = document.getElementById('filesList');
    if (filesIDTitle) filesIDTitle.textContent = id;
    
    if (list) {
        var files = [
            { name: 'project_requirements.pdf', size: '1.2 MB' },
            { name: 'design_brief_v2.docx', size: '2.4 MB' },
            { name: 'timeline_schedule.xlsx', size: '0.8 MB' }
        ];
        var html = '';
        files.forEach(function(f) {
            html += '<div style="display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="alert(\'Downloading \' + f.name + \'...\')">' +
                   '<span style="color: var(--accent); font-weight: 500;">📄 ' + f.name + '</span>' +
                   '<span style="color: var(--text-muted); font-size: 12px;">' + f.size + '</span>' +
                   '</div>';
        });
        list.innerHTML = html;
    }
    openModal('filesModal');
}

function contactManager(id) {
    var contactIDTitle = document.getElementById('contactOrderID');
    var details = document.getElementById('managerDetails');
    if (contactIDTitle) contactIDTitle.textContent = id;
    
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    var ordersKey = 'orders_' + (currentUser ? currentUser.username : '');
    var orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
    var assignedEmp = 'emp1';
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === id) {
            assignedEmp = orders[i].assignedEmployee || 'emp1';
            break;
        }
    }
    
    var name = assignedEmp === 'emp2' ? 'Alia Bhatt' : 'Suresh Khanna';
    var email = assignedEmp === 'emp2' ? 'alia.b@techsolutions.com' : 'suresh.k@techsolutions.com';
    var avatar = assignedEmp === 'emp2' ? '👩‍💼' : '👨‍💼';
    var role = assignedEmp === 'emp2' ? 'Project Manager' : 'Senior Project Lead';

    if (details) {
        details.innerHTML = 
            '<div style="width: 80px; height: 80px; background: var(--accent-light); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 30px;">' + avatar + '</div>' +
            '<h3 style="color: var(--text-main); margin-bottom: 5px;">' + name + '</h3>' +
            '<p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">' + role + '</p>' +
            '<p style="color: var(--text-light); font-size: 14px;">Email: ' + email + '</p>' +
            '<p style="color: var(--text-light); font-size: 14px;">Hours: 9 AM - 6 PM (Mon-Fri)</p>';
    }
    openModal('contactModal');
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

function renderOrderTimelines(o, isEmployee) {
    if (!o.checkpoints || o.checkpoints.length === 0) {
        var isDone = (o.status === 'Completed');
        o.checkpoints = [
            {title: 'Started', completed: true}, 
            {title: 'Completed', completed: isDone}
        ];
    }
    
    var html = '<div class="timeline" style="margin-top: 25px; margin-bottom: 25px; padding: 0 10px;">';
    if (o.checkpoints && o.checkpoints.length > 0) {
        html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; position: relative;">';
        
        for (var j = 0; j < o.checkpoints.length; j++) {
            var c = o.checkpoints[j];
            var color = c.completed ? 'var(--accent)' : '#e5e7eb';
            var textColor = c.completed ? 'var(--text-main)' : 'var(--text-muted)';
            
            html += '<div style="flex: 1; position: relative; text-align: center;">';
            
            // Connecting line (do not draw for the last element)
            if (j < o.checkpoints.length - 1) {
                var nextColor = o.checkpoints[j + 1].completed ? 'var(--accent)' : '#e5e7eb';
                html += '<div style="position: absolute; top: 12px; left: 50%; right: -50%; height: 3px; background: ' + (c.completed && o.checkpoints[j+1].completed ? 'var(--accent)' : '#e5e7eb') + '; z-index: 1;"></div>';
            }
            
            // Dot
            var cursorStyle = isEmployee ? 'cursor: pointer;' : '';
            var clickAction = isEmployee ? ' onclick="toggleCheckpointStatus(\'' + o.customerUsername + '\', \'' + o.id + '\', ' + j + ')" title="Click to toggle status"' : '';
            html += '<div' + clickAction + ' style="' + cursorStyle + ' position: relative; z-index: 2; margin: 0 auto; width: 26px; height: 26px; border-radius: 50%; background-color: ' + color + '; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 5px var(--bg-card);">';
            if (c.completed) {
                html += '<span style="color: #fff; font-size: 14px; line-height: 1;">✓</span>';
            } else {
                html += '<span style="width: 8px; height: 8px; background-color: #fff; border-radius: 50%;"></span>';
            }
            html += '</div>';
            
            // Title
            html += '<div style="color: ' + textColor + '; font-size: 13px; font-weight: 600; margin-top: 14px; line-height: 1.3; padding: 0 5px;">' + c.title + '</div>';
            
            html += '</div>';
        }
        
        html += '</div>';
    }
    if (o.messages && o.messages.length > 0) {
        for (var j = 0; j < o.messages.length; j++) {
            var m = o.messages[j];
            var align = m.sender === 'Customer' ? 'margin-left: 20px; background: #f0fdf4; border-left: 3px solid #22c55e;' : 'margin-right: 20px; background: var(--bg-alt); border-left: 3px solid var(--accent);';
            html += '<div class="chat-msg" style="padding: 10px; border-radius: 6px; margin-top: 10px; ' + align + '">';
            html += '<strong style="display: block; font-size: 12px; margin-bottom: 4px;">' + m.sender + ':</strong>';
            html += '<span style="font-size: 13px; color: var(--text-main);">' + m.text + '</span>';
            html += '</div>';
        }
    }
    html += '</div>';
    return html;
}

// =======================
// EMPLOYEE FUNCTIONS
// =======================

function handleEmployeeLogin(e) {
    e.preventDefault();
    var userVal = document.getElementById('employeeUsername').value;
    var passVal = document.getElementById('employeePassword').value;
    
    // Default employee accounts
    var employees = [
        { email: 'emp1@tech.com', username: 'emp1', password: 'emp123', name: 'Suresh Khanna' },
        { email: 'emp2@tech.com', username: 'emp2', password: 'emp123', name: 'Alia Bhatt' }
    ];
    
    var foundEmp = null;
    for (var i = 0; i < employees.length; i++) {
        if ((employees[i].email === userVal || employees[i].username === userVal) && employees[i].password === passVal) {
            foundEmp = employees[i];
            break;
        }
    }
    
    if (foundEmp) {
        localStorage.setItem('currentEmployee', JSON.stringify(foundEmp));
        window.location.href = 'employee-dashboard.html';
    } else {
        var errorMsg = document.getElementById('errorMsg');
        if (errorMsg) {
            errorMsg.textContent = 'Invalid employee credentials.';
            errorMsg.style.display = 'block';
        }
    }
}

function handleEmployeeLogout() {
    localStorage.removeItem('currentEmployee');
    window.location.href = 'employee-login.html';
}

function loadEmployeeOrders() {
    var currentEmployee = JSON.parse(localStorage.getItem('currentEmployee'));
    if (!currentEmployee) return;

    var empList = document.getElementById('employeeOrdersList');
    if (!empList) return;
    
    var allOrders = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith('orders_')) {
            var customerUsername = key.split('_')[1];
            var parsedOrders = JSON.parse(localStorage.getItem(key)) || [];
            for (var j = 0; j < parsedOrders.length; j++) {
                var o = parsedOrders[j];
                var assigned = o.assignedEmployee || 'emp1';
                if (assigned === currentEmployee.username) {
                    o.customerUsername = customerUsername;
                    allOrders.push(o);
                }
            }
        }
    }
    
    if (allOrders.length === 0) {
        empList.innerHTML = '<p style="text-align:center; padding: 20px;">No customer orders found in the system.</p>';
        return;
    }
    
    empList.innerHTML = '';
    for (var i = 0; i < allOrders.length; i++) {
        var o = allOrders[i];
        var title = (o.project && o.project.title) ? o.project.title : o.id;
        var badgeClass = o.status === 'Completed' ? 'status-completed' : 'status-active';
        var timelineHtml = renderOrderTimelines(o, true);
        
        var html = '<div class="order-card" style="margin-bottom: 25px;">' +
            '<div class="order-header">' +
            '<div>' +
            '<strong style="color: var(--accent); font-size: 18px;">' + title + '</strong>' +
            '<p style="color: var(--text-light); font-size: 14px; margin-top: 5px;">Customer: <b>' + o.customerUsername + '</b> &bull; ' + o.service + ' (' + o.id + ')</p>' +
            '</div>' +
            '<span class="status-badge ' + badgeClass + '">' + o.status + '</span>' +
            '</div>' +
            '<div style="border-top: 1px solid var(--border-color); padding-top: 15px; margin-top: 15px;">' +
            timelineHtml +
            '<!-- Employee Action Forms -->' +
            '<div class="action-box">' +
            '<h4 style="font-size: 14px; margin-bottom: 10px;">Update Status</h4>' +
            '<select id="status-' + o.id + '" style="padding: 6px; font-size: 13px; margin-right: 10px;">' +
            '<option value="In Progress" ' + (o.status === 'In Progress' ? 'selected' : '') + '>In Progress</option>' +
            '<option value="Completed" ' + (o.status === 'Completed' ? 'selected' : '') + '>Completed</option>' +
            '</select>' +
            '<button onclick="updateOrderStatus(\'' + o.customerUsername + '\', \'' + o.id + '\')" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">Save Status</button>' +
            '</div>' +
            '<div class="action-box">' +
            '<h4 style="font-size: 14px; margin-bottom: 10px;">Add Checkpoint</h4>' +
            '<input type="text" id="chk-title-' + o.id + '" placeholder="e.g. Design Phase" style="width: calc(100% - 130px); padding: 8px; font-size: 13px; display: inline-block;">' +
            '<button onclick="addCheckpoint(\'' + o.customerUsername + '\', \'' + o.id + '\')" class="btn btn-secondary" style="padding: 8px 12px; font-size: 12px; width: 110px; display: inline-block; margin-left: 10px;">Add</button>' +
            '<p style="font-size: 12px; color: var(--text-muted); margin-top: 5px;">*New checkpoints are marked as completed by default.</p>' +
            '</div>' +
            '<div class="action-box">' +
            '<h4 style="font-size: 14px; margin-bottom: 10px;">Send Message</h4>' +
            '<input type="text" id="msg-text-' + o.id + '" placeholder="Type message to customer..." style="width: calc(100% - 130px); padding: 8px; font-size: 13px; display: inline-block;">' +
            '<button onclick="addMessage(\'' + o.customerUsername + '\', \'' + o.id + '\')" class="btn btn-secondary" style="padding: 8px 12px; font-size: 12px; width: 110px; display: inline-block; margin-left: 10px;">Send</button>' +
            '</div>' +
            '</div>' +
            '</div>';
        empList.innerHTML += html;
    }
}

function updateOrderStatus(customerUsername, orderId) {
    var selectEl = document.getElementById('status-' + orderId);
    if (!selectEl) return;
    var newStatus = selectEl.value;
    
    var key = 'orders_' + customerUsername;
    var orders = JSON.parse(localStorage.getItem(key)) || [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            orders[i].status = newStatus;
            break;
        }
    }
    localStorage.setItem(key, JSON.stringify(orders));
    alert('Order status updated!');
    loadEmployeeOrders();
}

function addCheckpoint(customerUsername, orderId) {
    var titleEl = document.getElementById('chk-title-' + orderId);
    if (!titleEl || !titleEl.value.trim()) return;
    
    var key = 'orders_' + customerUsername;
    var orders = JSON.parse(localStorage.getItem(key)) || [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            if (!orders[i].checkpoints) {
                orders[i].checkpoints = [{title: 'Started', completed: true}, {title: 'Completed', completed: false}];
            }
            var len = orders[i].checkpoints.length;
            var newCp = { title: titleEl.value.trim(), completed: true };
            if (len > 0 && orders[i].checkpoints[len - 1].title === 'Completed') {
                orders[i].checkpoints.splice(len - 1, 0, newCp);
            } else {
                orders[i].checkpoints.push(newCp);
            }
            break;
        }
    }
    localStorage.setItem(key, JSON.stringify(orders));
    titleEl.value = '';
    loadEmployeeOrders();
}

function toggleCheckpointStatus(customerUsername, orderId, cpIndex) {
    if (confirm('Toggle this checkpoint status?')) {
        var key = 'orders_' + customerUsername;
        var orders = JSON.parse(localStorage.getItem(key)) || [];
        for (var i = 0; i < orders.length; i++) {
            if (orders[i].id === orderId) {
                if (orders[i].checkpoints && orders[i].checkpoints.length > cpIndex) {
                    orders[i].checkpoints[cpIndex].completed = !orders[i].checkpoints[cpIndex].completed;
                }
                break;
            }
        }
        localStorage.setItem(key, JSON.stringify(orders));
        loadEmployeeOrders();
    }
}

function addMessage(customerUsername, orderId) {
    var msgEl = document.getElementById('msg-text-' + orderId);
    if (!msgEl || !msgEl.value.trim()) return;
    
    var currentEmployee = JSON.parse(localStorage.getItem('currentEmployee'));
    var senderName = currentEmployee ? currentEmployee.name : 'Team';
    
    var key = 'orders_' + customerUsername;
    var orders = JSON.parse(localStorage.getItem(key)) || [];
    for (var i = 0; i < orders.length; i++) {
        if (orders[i].id === orderId) {
            if (!orders[i].messages) orders[i].messages = [];
            orders[i].messages.push({ sender: senderName, text: msgEl.value.trim() });
            break;
        }
    }
    localStorage.setItem(key, JSON.stringify(orders));
    msgEl.value = '';
    loadEmployeeOrders();
}
