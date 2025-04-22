// Product Detail Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL parameter - check both 'product' (slug) and 'id' parameters
    const productSlug = getUrlParameter('product');
    const productId = getUrlParameter('id');
    
    if (productSlug) {
        loadProductDetailsBySlug(productSlug);
    } else if (productId) {
        loadProductDetailsById(productId);
    } else {
        console.error('No product or id parameter found in URL');
    }
});

// Get URL parameter function
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Load product details by slug from JSON file
async function loadProductDetailsBySlug(productSlug) {
    try {
        // Fetch products data
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products data');
        }
        
        const products = await response.json();
        
        // Find the product that matches the slug
        const product = products.find(p => {
            const slug = p.productName.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
            return slug === productSlug;
        });
        
        if (product) {
            // Ensure we have all the necessary product data for personalization
            if (!product.specifications) {
                product.specifications = {};
            }
            
            // Display the product details with personalized description
            displayProductDetails(product);
            setupAddToCartButton(product);
        } else {
            console.error('Product not found by slug:', productSlug);
        }
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

// Load product details by ID from JSON file
async function loadProductDetailsById(productId) {
    try {
        // Fetch products data
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products data');
        }
        
        const products = await response.json();
        
        // Find the product that matches the ID
        const product = products.find(p => p.productId === productId);
        
        if (product) {
            // Ensure we have all the necessary product data for personalization
            if (!product.specifications) {
                product.specifications = {};
            }
            
            // Display the product details with personalized description
            displayProductDetails(product);
            setupAddToCartButton(product);
        } else {
            console.error('Product not found by ID:', productId);
        }
    } catch (error) {
        console.error('Error loading product details:', error);
    }
}

// Generate personalized product description based on product attributes
function generatePersonalizedDescription(product) {
    // Extract key product information
    const { productName, brand, category, subcategory, price, rating, specifications, stockStatus } = product;
    
    // Initialize description parts
    let descriptionParts = [];
    
    // Product-specific introduction that includes the actual product name
    const productSpecificIntros = {
        "Electronics": [
            `Introducing the ${productName}, a premium ${subcategory.toLowerCase()} that redefines excellence.`,
            `Meet the ${productName}, a cutting-edge ${subcategory.toLowerCase()} designed for the modern user.`,
            `Discover the ${productName}, a state-of-the-art ${subcategory.toLowerCase()} that sets new industry standards.`
        ],
        "Fashion": [
            `Showcase your style with the ${productName}, a standout ${subcategory.toLowerCase()} for the fashion-forward.`,
            `The ${productName} brings elegance and comfort to your wardrobe as a must-have ${subcategory.toLowerCase()}.`,
            `Express yourself with the ${productName}, a trendsetting ${subcategory.toLowerCase()} designed for distinction.`
        ],
        "Home & Kitchen": [
            `Transform your living space with the ${productName}, an elegant ${subcategory.toLowerCase()} for the modern home.`,
            `The ${productName} combines functionality and style as a premium ${subcategory.toLowerCase()} for your home.`,
            `Elevate your home experience with the ${productName}, a thoughtfully designed ${subcategory.toLowerCase()}.`
        ],
        "Beauty": [
            `Enhance your natural beauty with the ${productName}, a luxurious ${subcategory.toLowerCase()} for your self-care routine.`,
            `The ${productName} delivers professional results as a high-quality ${subcategory.toLowerCase()} for beauty enthusiasts.`,
            `Pamper yourself with the ${productName}, a premium ${subcategory.toLowerCase()} that transforms your beauty regimen.`
        ],
        "Sports & Outdoors": [
            `Maximize your athletic potential with the ${productName}, a professional-grade ${subcategory.toLowerCase()} for serious enthusiasts.`,
            `The ${productName} enhances every adventure as a durable ${subcategory.toLowerCase()} built for performance.`,
            `Conquer new challenges with the ${productName}, a high-performance ${subcategory.toLowerCase()} designed for excellence.`
        ],
        "Books & Media": [
            `Immerse yourself in the ${productName}, a captivating ${subcategory.toLowerCase()} that expands your horizons.`,
            `The ${productName} stands out as a must-have ${subcategory.toLowerCase()} for discerning collectors.`,
            `Enrich your collection with the ${productName}, an exceptional ${subcategory.toLowerCase()} that delivers lasting value.`
        ],
        "Toys & Games": [
            `Spark imagination with the ${productName}, an engaging ${subcategory.toLowerCase()} that brings joy to playtime.`,
            `The ${productName} creates unforgettable moments as an entertaining ${subcategory.toLowerCase()} for all ages.`,
            `Bring excitement to every day with the ${productName}, a delightful ${subcategory.toLowerCase()} that inspires creativity.`
        ]
    };
    
    // Select a product-specific introduction based on category
    const categoryIntros = productSpecificIntros[category] || [`Discover the exceptional quality of the ${productName}, a standout ${subcategory.toLowerCase()} in today's market.`];
    const intro = categoryIntros[Math.floor(Math.random() * categoryIntros.length)];
    descriptionParts.push(intro);
    
    // Add brand heritage and reputation based on brand name
    const brandDescriptions = {
        "Sony": `Crafted by ${brand}, a global leader in electronics known for pioneering innovation and exceptional quality since 1946.`,
        "Apple": `Designed by ${brand}, renowned worldwide for revolutionary products that combine cutting-edge technology with intuitive user experiences.`,
        "Samsung": `Engineered by ${brand}, a technology powerhouse celebrated for pushing boundaries with innovative features and reliable performance.`,
        "Nike": `Created by ${brand}, an iconic athletic brand trusted by professional athletes and fitness enthusiasts for performance and style.`,
        "Adidas": `Developed by ${brand}, a legendary sportswear company committed to helping athletes perform better through passion and innovation.`,
        "Dyson": `Engineered by ${brand}, famous for revolutionary designs that combine powerful performance with elegant functionality.`,
        "Lenovo": `Built by ${brand}, a global technology leader dedicated to creating smarter technology for all.`,
        "Asus": `Crafted by ${brand}, known for creating innovative products for today's digital home and office.`,
        "OnePlus": `Designed by ${brand}, a company committed to sharing the best technology, built hand-in-hand with users.`
    };
    
    // Use brand-specific description or default to generic one
    const brandDescription = brandDescriptions[brand] || `Crafted by ${brand}, known for exceptional quality and innovation in the ${category.toLowerCase()} industry.`;
    descriptionParts.push(brandDescription);
    
    // Add feature highlights based on specifications with more detailed descriptions
    if (specifications) {
        const specHighlights = [];
        
        // Process different types of specifications based on subcategory with enhanced descriptions
        if (subcategory === "Smartphones" || subcategory === "Tablets") {
            if (specifications.processor) specHighlights.push(`Experience seamless multitasking and responsive performance with the ${specifications.processor} processor, designed to handle everything from everyday apps to demanding games.`);
            if (specifications.storage) {
                // Convert storage to array if it's not already
                const storageArray = Array.isArray(specifications.storage) ? specifications.storage : [specifications.storage];
                const storageValue = storageArray[0];
                if (storageValue.includes("GB")) {
                    if (parseInt(storageValue) >= 256) {
                        specHighlights.push(`Store your entire digital life with generous ${storageValue} storage capacity, providing ample space for apps, photos, videos, and more.`);
                    } else {
                        specHighlights.push(`Enjoy practical ${storageValue} storage for your essential apps and media collection.`);
                    }
                }
            }
            if (specifications.display) {
                const displayArray = Array.isArray(specifications.display) ? specifications.display : [specifications.display];
                const displayInfo = displayArray[0];
                if (displayInfo.includes("OLED") || displayInfo.includes("AMOLED")) {
                    specHighlights.push(`Immerse yourself in vibrant colors and deep blacks with the ${displayInfo}, offering stunning visual clarity and energy efficiency.`);
                } else {
                    specHighlights.push(`Enjoy crisp, clear visuals on the ${displayInfo}, perfect for browsing, streaming, and gaming.`);
                }
            }
            if (specifications.camera) {
                const cameraArray = Array.isArray(specifications.camera) ? specifications.camera : [specifications.camera];
                const cameraInfo = cameraArray[0];
                if (cameraInfo.includes("MP")) {
                    if (cameraInfo.includes("triple") || cameraInfo.includes("quad")) {
                        specHighlights.push(`Capture professional-quality photos in any situation with the versatile ${cameraInfo}, featuring multiple lenses for wide-angle, portrait, and zoom photography.`);
                    } else {
                        specHighlights.push(`Take stunning photos and videos with the high-resolution ${cameraInfo}, perfect for preserving your precious moments.`);
                    }
                }
            }
        } else if (subcategory === "Laptops") {
            if (specifications.processor) specHighlights.push(`Power through demanding tasks with the high-performance ${specifications.processor} processor, delivering the speed and efficiency you need for work and play.`);
            if (specifications.memory) specHighlights.push(`Experience smooth multitasking with ${specifications.memory} of RAM, allowing you to run multiple applications simultaneously without slowdowns.`);
            if (specifications.storage) {
                const storageArray = Array.isArray(specifications.storage) ? specifications.storage : [specifications.storage];
                const storageInfo = storageArray[0];
                if (storageInfo.includes("SSD")) {
                    specHighlights.push(`Enjoy lightning-fast boot times and file transfers with the ${storageInfo}, providing responsive performance and reliable data storage.`);
                } else {
                    specHighlights.push(`Store all your important files, documents, and media with the spacious ${storageInfo}.`);
                }
            }
            if (specifications.display) {
                const displayArray = Array.isArray(specifications.display) ? specifications.display : [specifications.display];
                const displayInfo = displayArray[0];
                if (displayInfo.includes("4K") || displayInfo.includes("UHD")) {
                    specHighlights.push(`Experience breathtaking visual clarity with the ${displayInfo}, perfect for content creation, gaming, and enjoying high-definition media.`);
                } else {
                    specHighlights.push(`Work and play comfortably with the ${displayInfo}, offering clear visuals and reduced eye strain for extended use.`);
                }
            }
        } else if (subcategory === "Headphones" || subcategory === "Audio") {
            if (specifications.driver) specHighlights.push(`Experience rich, detailed sound with the ${specifications.driver} drivers, engineered to deliver exceptional audio clarity across all frequencies.`);
            if (specifications.noiseCancellation) specHighlights.push(`Immerse yourself in your music with ${specifications.noiseCancellation} technology that effectively blocks out ambient noise for an undisturbed listening experience.`);
            if (specifications.batteryLife) specHighlights.push(`Enjoy extended listening sessions with up to ${specifications.batteryLife} of battery life, perfect for long commutes or travel.`);
            if (specifications.connectivity) specHighlights.push(`Connect seamlessly to your devices with ${specifications.connectivity} technology, providing stable, high-quality wireless audio transmission.`);
        } else {
            // Enhanced generic specifications for other categories
            Object.entries(specifications).forEach(([key, value]) => {
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
                if (Array.isArray(value)) {
                    specHighlights.push(`${formattedKey}: ${value.join(', ')}, providing optimal performance and versatility.`);
                } else {
                    specHighlights.push(`${formattedKey}: ${value}, designed to enhance your overall experience.`);
                }
            });
        }
        
        // Add specification highlights - using all relevant specs instead of random selection
        if (specHighlights.length > 0) {
            // Prioritize the most important specs for each category instead of random selection
            const prioritySpecs = specHighlights.slice(0, Math.min(4, specHighlights.length));
            descriptionParts.push(...prioritySpecs);
        }
    }
    
    // Add personalized value proposition based on price range
    if (price < 50) {
        descriptionParts.push(`At just $${price.toFixed(2)}, the ${productName} offers exceptional value without compromising on quality or performance.`);
    } else if (price < 200) {
        descriptionParts.push(`Priced at $${price.toFixed(2)}, the ${productName} strikes the perfect balance between premium features and affordability.`);
    } else if (price < 500) {
        descriptionParts.push(`With an investment of $${price.toFixed(2)}, the ${productName} delivers premium quality and performance that will serve you for years to come.`);
    } else {
        descriptionParts.push(`At $${price.toFixed(2)}, the ${productName} represents the pinnacle of luxury and performance for discerning customers who demand nothing but the best.`);
    }
    
    // Add enhanced social proof based on rating with specific benefits
    if (rating >= 4.8) {
        descriptionParts.push(`With an outstanding rating of ${rating}/5, customers consistently praise the ${productName} for its exceptional quality, innovative features, and reliability.`);
    } else if (rating >= 4.5) {
        descriptionParts.push(`Highly rated at ${rating}/5 by our customers who appreciate its superior performance, thoughtful design, and excellent value.`);
    } else if (rating >= 4.0) {
        descriptionParts.push(`Well-reviewed with a ${rating}/5 rating, customers frequently highlight the ${productName}'s reliable performance and user-friendly features.`);
    } else if (rating >= 3.5) {
        descriptionParts.push(`With a solid ${rating}/5 rating, the ${productName} has earned positive feedback from customers who value its practical functionality.`);
    }
    
    // Add personalized urgency based on stock status
    if (stockStatus === "Limited Stock") {
        descriptionParts.push(`Due to high demand, the ${productName} is currently in limited stock. Order yours today to avoid disappointment!`);
    } else if (stockStatus === "In Stock") {
        descriptionParts.push(`The ${productName} is in stock and ready to ship to you right away.`);
    } else if (stockStatus === "Pre-order") {
        descriptionParts.push(`Be among the first to experience the new ${productName} by securing your pre-order today.`);
    }
    
    // Add personalized conclusion with product name
    const conclusions = [
        `The ${productName} is the perfect choice for those who demand the best in ${subcategory.toLowerCase()} technology and are unwilling to compromise on quality or performance.`,
        `Upgrade your ${subcategory.toLowerCase()} experience today with the ${productName} and discover why it's becoming the preferred choice for discerning customers.`,
        `Don't miss your opportunity to own the exceptional ${productName} from ${brand}, a ${subcategory.toLowerCase()} that truly stands out from the competition.`
    ];
    const conclusion = conclusions[Math.floor(Math.random() * conclusions.length)];
    descriptionParts.push(conclusion);
    
    // Combine all parts into a cohesive description
    return descriptionParts.join(' ');
}

// Display product details on the page
function displayProductDetails(product) {
    // Update page title
    document.title = `${product.productName} - MegaShop`;
    
    // Update product name
    const productTitle = document.querySelector('.product-info h1');
    if (productTitle) productTitle.textContent = product.productName;
    
    // Update prices
    const currentPrice = document.querySelector('.current-price');
    if (currentPrice) currentPrice.textContent = `$${product.price.toFixed(2)}`;
    
    // Calculate and display old price (for sale effect)
    const oldPrice = document.querySelector('.old-price');
    if (oldPrice) {
        const originalPrice = (product.price * 1.2).toFixed(2);
        oldPrice.textContent = `$${originalPrice}`;
    }
    
    // Generate personalized product description
    const personalizedDescription = generatePersonalizedDescription(product);
    
    // Add a brief summary to the product info section
    const productDescriptionDiv = document.querySelector('.product-description');
    if (productDescriptionDiv) {
        // Clear any existing content except the "See full description" text
        const seeFullDescriptionText = productDescriptionDiv.querySelector('p');
        productDescriptionDiv.innerHTML = '';
        
        // Create a brief summary (first sentence of the personalized description)
        const briefSummary = document.createElement('p');
        const firstSentence = personalizedDescription.split('.')[0] + '.';
        briefSummary.textContent = firstSentence;
        productDescriptionDiv.appendChild(briefSummary);
        
        // Add back the "See full description" text
        if (seeFullDescriptionText) {
            productDescriptionDiv.appendChild(seeFullDescriptionText);
        } else {
            const seeMoreText = document.createElement('p');
            seeMoreText.textContent = 'See the full detailed description in the Description tab below.';
            productDescriptionDiv.appendChild(seeMoreText);
        }
    }
    
    // Update the description tab content with the full personalized description
    const descriptionTabContent = document.querySelector('#description');
    if (descriptionTabContent) {
        // Clear existing content
        descriptionTabContent.innerHTML = '';
        
        // Add a heading
        const heading = document.createElement('h3');
        heading.textContent = 'Product Description';
        descriptionTabContent.appendChild(heading);
        
        // Add the personalized description
        const descriptionParagraph = document.createElement('p');
        descriptionParagraph.textContent = personalizedDescription;
        descriptionTabContent.appendChild(descriptionParagraph);
        
        // Store the product ID in a data attribute
        descriptionTabContent.dataset.productId = product.productId;
        
        // Log confirmation that a unique description was generated for this product
        console.log(`Generated personalized description for ${product.productName} (ID: ${product.productId})`);
    }
    
    // Update product image
    const mainImage = document.querySelector('.main-image');
    if (mainImage) mainImage.src = product.imageUrl;
    
    // Update thumbnails (using the same image for demo purposes)
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumbnail => {
        thumbnail.src = product.imageUrl;
    });
    
    // Update product specifications
    updateSpecifications(product);
    
    // Update SKU, availability, category
    const sku = document.querySelector('.product-meta .sku');
    if (sku) sku.textContent = product.productId;
    
    const availability = document.querySelector('.product-meta .availability');
    if (availability) availability.textContent = product.stockStatus;
    
    const category = document.querySelector('.product-meta .category');
    if (category) category.textContent = `${product.category}, ${product.subcategory}`;
    
    // Update ratings
    updateRatings(product.rating);
}

// Update product specifications
function updateSpecifications(product) {
    if (!product.specifications) return;
    
    const specsList = document.querySelector('.specs-list');
    if (!specsList) return;
    
    // Clear existing specs
    specsList.innerHTML = '';
    
    // Add new specs
    for (const [key, value] of Object.entries(product.specifications)) {
        const specItem = document.createElement('li');
        let specText = '';
        
        if (Array.isArray(value)) {
            specText = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value.join(', ')}`;
        } else {
            specText = `<strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}`;
        }
        
        specItem.innerHTML = specText;
        specsList.appendChild(specItem);
    }
}

// Update star ratings
function updateRatings(rating) {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Calculate full and half stars
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        const star = document.createElement('i');
        star.className = 'fas fa-star';
        starsContainer.appendChild(star);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
        const halfStar = document.createElement('i');
        halfStar.className = 'fas fa-star-half-alt';
        starsContainer.appendChild(halfStar);
    }
    
    // Add empty stars to make 5 total
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        const emptyStar = document.createElement('i');
        emptyStar.className = 'far fa-star';
        starsContainer.appendChild(emptyStar);
    }
    
    // Update review count
    const reviewCount = document.querySelector('.review-count');
    if (reviewCount) {
        // Generate a random number of reviews between 10 and 500
        const randomReviews = Math.floor(Math.random() * 490) + 10;
        reviewCount.textContent = `${randomReviews} Reviews`;
    }
}

// Setup Add to Cart button
function setupAddToCartButton(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (!addToCartBtn) return;
    
    // Remove any existing event listeners
    const newAddToCartBtn = addToCartBtn.cloneNode(true);
    addToCartBtn.parentNode.replaceChild(newAddToCartBtn, addToCartBtn);
    
    // Add event listener for the add to cart button
    newAddToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(document.querySelector('.quantity-input')?.value) || 1;
        addToCart(product, quantity);
        
        // Show notification
        showNotification(`${product.productName} added to cart!`);
    });
    
    // Update button text/state based on availability
    if (product.stockStatus && product.stockStatus.toLowerCase() === 'out of stock') {
        newAddToCartBtn.textContent = 'Out of Stock';
        newAddToCartBtn.disabled = true;
        newAddToCartBtn.classList.add('disabled');
    } else {
        newAddToCartBtn.textContent = 'Add to Cart';
        newAddToCartBtn.disabled = false;
        newAddToCartBtn.classList.remove('disabled');
    }
}

// Add to cart function
function addToCart(product, quantity) {
    // Get current cart or initialize empty array
    let cart = JSON.parse(localStorage.getItem('megashop-cart')) || [];
    
    // Check if product already in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.productId);
    
    if (existingProductIndex > -1) {
        // Update quantity if product already in cart
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Add new product to cart
        cart.push({
            id: product.productId,
            name: product.productName,
            price: product.price,
            image: product.imageUrl,
            quantity: quantity
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('megashop-cart', JSON.stringify(cart));
    
    // Update cart count in the header
    updateCartCount(cart.length);
}

// Update cart count in the header
function updateCartCount(count) {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = count;
        
        // Show/hide based on count
        if (count > 0) {
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

// Show notification
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles if not already in CSS
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            }
            .notification {
                background-color: #4CAF50;
                color: white;
                padding: 15px 20px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                animation: slideIn 0.3s ease-out forwards;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}