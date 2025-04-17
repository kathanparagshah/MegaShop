// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the mobile menu toggle
    initMobileMenu();
    
    // Initialize product actions
    initProductActions();
    
    // Initialize the newsletter form
    initNewsletterForm();
    
    // Initialize the cart functionality
    initCart();
});

// Mobile Menu Toggle
function initMobileMenu() {
    // This would be implemented with a hamburger menu in a real application
    console.log('Mobile menu initialized');
}

// Product Actions (Add to cart, Add to wishlist)
function initProductActions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const wishlistButtons = document.querySelectorAll('.action-btn:nth-child(1)');
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Add the product to cart
            addToCart({
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
            
            // Show a confirmation message
            showNotification(`${productName} added to cart!`);
        });
    });
    
    
    // Wishlist functionality
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Toggle wishlist status (in a real app, this would update a wishlist in the database)
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.style.color = '#dc3545';
                showNotification(`${productName} added to wishlist!`);
            } else {
                this.style.color = '';
                showNotification(`${productName} removed from wishlist!`);
            }
        });
    });
}

// Newsletter Form Submission
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email) {
                // In a real app, this would send the email to a server
                console.log(`Newsletter subscription for: ${email}`);
                showNotification('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            }
        });
    }
}

// Cart Functionality
function initCart() {
    // Initialize cart from localStorage or create empty cart
    let cart = JSON.parse(localStorage.getItem('megashop-cart')) || [];
    
    // Update cart count on page load
    updateCartCount(cart.length);
    
    // Add click event to cart icon to redirect to cart page
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
    
    // If we're on the cart page, load the cart items
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems(cart);
    }
}

// Helper function to add a product to cart
function addToCart(product) {
    // Get current cart from localStorage or initialize empty array
    let cart = JSON.parse(localStorage.getItem('megashop-cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingProductIndex > -1) {
        // If product exists, increase quantity
        cart[existingProductIndex].quantity += product.quantity;
    } else {
        // If product doesn't exist, add it to cart
        cart.push(product);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('megashop-cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.length);
}

// Helper function to show notifications
function showNotification(message) {
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

// Helper function to update cart count in the header
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Function to display cart items on the cart page
function displayCartItems(cart) {
    const emptyCartElement = document.getElementById('empty-cart');
    const cartWithItemsElement = document.getElementById('cart-with-items');
    const cartItemsContainer = document.getElementById('cart-items');
    
    // If cart is empty, show empty cart message
    if (cart.length === 0) {
        emptyCartElement.style.display = 'block';
        cartWithItemsElement.style.display = 'none';
        return;
    }
    
    // Otherwise, show cart items
    emptyCartElement.style.display = 'none';
    cartWithItemsElement.style.display = 'block';
    
    // Clear existing cart items
    cartItemsContainer.innerHTML = '';
    
    // Calculate totals
    let subtotal = 0;
    
    // Add each cart item to the table
    cart.forEach((item, index) => {
        // Calculate item subtotal
        const price = parseFloat(item.price.replace('$', ''));
        const itemSubtotal = price * item.quantity;
        subtotal += itemSubtotal;
        
        // Create table row for item
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="Product">
                <div class="cart-product">
                    <img src="${item.image || 'https://via.placeholder.com/80x80'}" alt="${item.name}">
                    <div class="cart-product-info">
                        <h3>${item.name}</h3>
                    </div>
                </div>
            </td>
            <td data-label="Price">${item.price}</td>
            <td data-label="Quantity">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-index="${index}">-</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                    <button class="quantity-btn increase" data-index="${index}">+</button>
                </div>
            </td>
            <td data-label="Subtotal">$${itemSubtotal.toFixed(2)}</td>
            <td data-label="Action">
                <button class="remove-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        cartItemsContainer.appendChild(tr);
    });
    
    // Update summary values
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for quantity buttons and remove buttons
    addCartEventListeners();
}

// Function to add event listeners to cart buttons
function addCartEventListeners() {
    // Quantity increase buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            let cart = JSON.parse(localStorage.getItem('megashop-cart')) || [];
            
            cart[index].quantity += 1;
            localStorage.setItem('megashop-cart', JSON.stringify(cart));
            displayCartItems(cart);
        });
    });
    
    // Quantity decrease buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            let cart = JSON.parse(localStorage.getItem('megashop-cart')) || [];
            
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                localStorage.setItem('megashop-cart', JSON.stringify(cart));
                displayCartItems(cart);
            }
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            let cart = JSON.parse(localStorage.getItem('megashop-cart')) || [];
            
            cart.splice(index, 1);
            localStorage.setItem('megashop-cart', JSON.stringify(cart));
            updateCartCount(cart.length);
            displayCartItems(cart);
        });
    });
    
    // Checkout button
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            alert('Checkout functionality would be implemented in a real e-commerce site.');
        });
    }
}

// Add some basic animations for product cards
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
    });
});