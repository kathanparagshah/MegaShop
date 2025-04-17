// Authentication System
document.addEventListener('DOMContentLoaded', function() {
    initAuthSystem();
});

function initAuthSystem() {
    const accountIcon = document.querySelector('.account-icon');
    
    if (accountIcon) {
        accountIcon.addEventListener('click', function(e) {
            e.preventDefault();
            // Check if user is logged in
            const currentUser = getCurrentUser();
            if (currentUser) {
                // Show user menu
                showUserMenu(currentUser);
            } else {
                // Show login modal
                showLoginModal();
            }
        });
    }
}

// Create and show login modal
function showLoginModal() {
    // Create modal elements
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'auth-modal-overlay';
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'auth-modal-container';
    
    // Create login form
    const loginForm = document.createElement('form');
    loginForm.className = 'auth-form login-form';
    loginForm.innerHTML = `
        <h2>Login to Your Account</h2>
        <div class="form-group">
            <label for="login-email">Email Address</label>
            <input type="email" id="login-email" name="email" required>
        </div>
        <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" name="password" required>
        </div>
        <div class="form-error" id="login-error"></div>
        <button type="submit" class="btn btn-primary btn-block">Login</button>
        <div class="auth-separator">
            <span>OR</span>
        </div>
        <button type="button" class="btn btn-google btn-block">
            <i class="fab fa-google"></i> Sign in with Google
        </button>
        <div class="auth-links">
            <p>Don't have an account? <a href="#" id="show-signup">Sign Up</a></p>
        </div>
    `;
    
    // Create signup form
    const signupForm = document.createElement('form');
    signupForm.className = 'auth-form signup-form';
    signupForm.style.display = 'none';
    signupForm.innerHTML = `
        <h2>Create an Account</h2>
        <div class="form-group">
            <label for="signup-firstname">First Name</label>
            <input type="text" id="signup-firstname" name="firstname" required>
        </div>
        <div class="form-group">
            <label for="signup-lastname">Last Name</label>
            <input type="text" id="signup-lastname" name="lastname" required>
        </div>
        <div class="form-group">
            <label for="signup-phone">Phone Number</label>
            <input type="tel" id="signup-phone" name="phone" required>
        </div>
        <div class="form-group">
            <label for="signup-email">Email Address</label>
            <input type="email" id="signup-email" name="email" required>
        </div>
        <div class="form-group">
            <label for="signup-password">Password</label>
            <input type="password" id="signup-password" name="password" required>
        </div>
        <div class="form-group">
            <label for="signup-confirm-password">Confirm Password</label>
            <input type="password" id="signup-confirm-password" name="confirm-password" required>
        </div>
        <div class="form-error" id="signup-error"></div>
        <button type="submit" class="btn btn-primary btn-block">Sign Up</button>
        <div class="auth-separator">
            <span>OR</span>
        </div>
        <button type="button" class="btn btn-google btn-block">
            <i class="fab fa-google"></i> Sign up with Google
        </button>
        <div class="auth-links">
            <p>Already have an account? <a href="#" id="show-login">Login</a></p>
        </div>
    `;
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'auth-modal-close';
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    
    // Assemble modal
    modalContainer.appendChild(loginForm);
    modalContainer.appendChild(signupForm);
    modalContainer.appendChild(closeButton);
    modalOverlay.appendChild(modalContainer);
    
    // Add to DOM
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Add event listeners
    closeButton.addEventListener('click', function() {
        document.body.removeChild(modalOverlay);
        document.body.style.overflow = '';
    });
    
    // Switch between login and signup forms
    document.getElementById('show-signup').addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    });
    
    document.getElementById('show-login').addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // Handle login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const loginResult = loginUser(email, password);
        if (loginResult.success) {
            // Close modal and refresh page
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = '';
            showNotification('Login successful!');
            updateUIForLoggedInUser(loginResult.user);
        } else {
            // Show error message
            const errorElement = document.getElementById('login-error');
            errorElement.textContent = loginResult.message;
            errorElement.style.display = 'block';
        }
    });
    
    // Handle signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const firstName = document.getElementById('signup-firstname').value;
        const lastName = document.getElementById('signup-lastname').value;
        const phone = document.getElementById('signup-phone').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            const errorElement = document.getElementById('signup-error');
            errorElement.textContent = 'Passwords do not match';
            errorElement.style.display = 'block';
            return;
        }
        
        const signupResult = registerUser(firstName, lastName, phone, email, password);
        if (signupResult.success) {
            // Close modal and refresh page
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = '';
            showNotification('Account created successfully!');
            updateUIForLoggedInUser(signupResult.user);
        } else {
            // Show error message
            const errorElement = document.getElementById('signup-error');
            errorElement.textContent = signupResult.message;
            errorElement.style.display = 'block';
        }
    });
    
    // Close modal when clicking outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = '';
        }
    });
    
    // Google sign-in buttons
    const googleButtons = document.querySelectorAll('.btn-google');
    googleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would integrate with Google OAuth
            alert('Google sign-in would be implemented here with OAuth');
        });
    });
}

// Show user menu when logged in
function showUserMenu(user) {
    // Create user menu elements
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'user-menu-overlay';
    
    const menuContainer = document.createElement('div');
    menuContainer.className = 'user-menu-container';
    
    // Create menu content
    menuContainer.innerHTML = `
        <div class="user-menu-header">
            <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
            </div>
            <div class="user-info">
                <h3>${user.firstName} ${user.lastName}</h3>
                <p>${user.email}</p>
            </div>
        </div>
        <ul class="user-menu-items">
            <li><a href="#"><i class="fas fa-user"></i> My Profile</a></li>
            <li><a href="#"><i class="fas fa-shopping-bag"></i> My Orders</a></li>
            <li><a href="#"><i class="fas fa-heart"></i> Wishlist</a></li>
            <li><a href="#"><i class="fas fa-cog"></i> Account Settings</a></li>
            <li class="menu-divider"></li>
            <li><a href="#" id="logout-button"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
    `;
    
    // Add to DOM
    menuOverlay.appendChild(menuContainer);
    document.body.appendChild(menuOverlay);
    
    // Add event listeners
    menuOverlay.addEventListener('click', function(e) {
        if (e.target === menuOverlay) {
            document.body.removeChild(menuOverlay);
        }
    });
    
    // Logout functionality
    document.getElementById('logout-button').addEventListener('click', function(e) {
        e.preventDefault();
        logoutUser();
        document.body.removeChild(menuOverlay);
        showNotification('You have been logged out');
        updateUIForLoggedOutUser();
    });
}

// User data storage and retrieval functions
function getCurrentUser() {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user in localStorage (in a real app, use secure cookies/JWT)
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user: user };
    } else {
        return { success: false, message: 'Invalid email or password' };
    }
}

function registerUser(firstName, lastName, phone, email, password) {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        return { success: false, message: 'Email already registered' };
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        phone,
        email,
        password // In a real app, this would be hashed
    };
    
    // Add to users array and save
    users.push(newUser);
    saveUsers(users);
    
    // Log in the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true, user: newUser };
}

function logoutUser() {
    localStorage.removeItem('currentUser');
}

// Update UI based on authentication state
function updateUIForLoggedInUser(user) {
    const accountIcon = document.querySelector('.account-icon i');
    if (accountIcon) {
        accountIcon.className = 'fas fa-user-check';
        accountIcon.style.color = '#007bff';
    }
}

function updateUIForLoggedOutUser() {
    const accountIcon = document.querySelector('.account-icon i');
    if (accountIcon) {
        accountIcon.className = 'fas fa-user';
        accountIcon.style.color = '';
    }
}

// Check authentication state on page load
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
});

// Helper function to show notifications
function showNotification(message) {
    // Check if the notification function exists in script.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message);
    } else {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add styles to the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            transition: 'all 0.3s ease',
            opacity: '0',
            transform: 'translateY(20px)'
        });
        
        // Add to the DOM
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}