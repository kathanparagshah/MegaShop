// Link Handler Script - Makes all website links functional
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all link handlers
    initProductCardLinks();
    initCategoryCardLinks();
    initShopNowButtons();
    initViewAllLinks();
    initUserActionLinks();
    initFooterLinks();
}); 

// Make product cards clickable to go to product detail page
function initProductCardLinks() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on action buttons
            if (e.target.closest('.action-btn') || e.target.closest('.product-actions')) {
                return;
            }
            
            // Get product name for the URL
            const productName = this.querySelector('h3').textContent;
            const productSlug = productName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
            
            // Navigate to product detail page
            window.location.href = `product-detail.html?product=${productSlug}`;
        });
        
        // Make the card appear clickable
        card.style.cursor = 'pointer';
    });
}

// Make category cards clickable
function initCategoryCardLinks() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get category name
            const categoryName = this.querySelector('h3').textContent;
            const categorySlug = categoryName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
            
            // Navigate to appropriate category page
            window.location.href = `categories.html?category=${categorySlug}`;
        });
        
        // Make the card appear clickable
        card.style.cursor = 'pointer';
    });
}

// Make "Shop Now" buttons functional
function initShopNowButtons() {
    const shopNowButtons = document.querySelectorAll('.btn-primary');
    
    shopNowButtons.forEach(button => {
        if (button.textContent.includes('Shop Now')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Redirect to shop page with all products (at least 100)
                window.location.href = 'shop.html?all=true';
            });
        }
    });
}

// Make "View All" links functional
function initViewAllLinks() {
    const viewAllLinks = document.querySelectorAll('.view-more .btn, .category-footer .btn');
    
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the category from the button text
            const linkText = this.textContent;
            let category = '';
            
            if (linkText.includes('Electronics')) {
                category = 'electronics';
            } else if (linkText.includes('Fashion')) {
                category = 'fashion';
            } else if (linkText.includes('Home')) {
                category = 'home-kitchen';
            } else if (linkText.includes('Beauty')) {
                category = 'beauty';
            } else {
                category = '';
            }
            
            // Navigate to the shop page with the category filter
            if (category) {
                window.location.href = `shop.html?category=${category}`;
            } else {
                window.location.href = 'shop.html';
            }
        });
    });
}

// Make user action icons functional
function initUserActionLinks() {
    // Search and account icons are now handled by search.js and auth.js
    
    // Cart icon in header - redirect to cart page
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }
    
    // Cart icons in product cards - add to cart
    const productCartButtons = document.querySelectorAll('.product-actions .action-btn.add-to-cart-btn');
    productCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent triggering the product card click
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            // Add the product to cart using the function from script.js
            if (typeof addToCart === 'function') {
                addToCart({
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                    image: productImage
                });
                
                // Show a confirmation message
                if (typeof showNotification === 'function') {
                    showNotification(`${productName} added to cart!`);
                }
            }
        });
    });
}

// Make footer links functional
function initFooterLinks() {
    const footerLinks = document.querySelectorAll('footer a');
    
    footerLinks.forEach(link => {
        // Skip links that already have proper hrefs
        if (link.getAttribute('href') !== '#') {
            return;
        }
        
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const linkText = this.textContent.toLowerCase();
            
            // Handle different footer links
            if (linkText.includes('account')) {
                alert('My Account page would open here!');
            } else if (linkText.includes('track')) {
                alert('Order Tracking page would open here!');
            } else if (linkText.includes('shipping')) {
                alert('Shipping Policy page would open here!');
            } else if (linkText.includes('returns')) {
                alert('Returns & Exchanges page would open here!');
            } else if (linkText.includes('faq')) {
                alert('FAQ page would open here!');
            } else {
                alert(`${linkText} page would open here!`);
            }
        });
    });
}

// Handle URL parameters for dynamic content loading
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Update page content based on URL parameters
function updatePageFromUrl() {
    // For category pages
    const category = getUrlParameter('category');
    if (category && document.querySelector('.category-banner')) {
        // Update category page title and content based on the category parameter
        const categoryTitle = document.querySelector('.category-banner h2');
        if (categoryTitle) {
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
        }
    }
    
    // For product detail pages
    const product = getUrlParameter('product');
    if (product && document.querySelector('.product-detail-section')) {
        // This would typically load product details from a database
        // For demo purposes, we're just updating the title
        document.title = `${product.replace(/-/g, ' ')} - MegaShop`;
    }
}

// Call this function when page loads
document.addEventListener('DOMContentLoaded', function() {
    updatePageFromUrl();
});