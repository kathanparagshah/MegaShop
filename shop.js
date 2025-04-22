// Shop page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Call loadProducts directly to ensure products are loaded
    loadProducts();
    
    // Initialize view options
    initViewOptions();
    
    // Initialize filter functionality
    initFilters();
    
    // Initialize pagination
    initPagination();
    
    // Add CSS styles for quick view modal and JSON-specific elements
    addJsonStylesForQuickView();
    
    // Initialize enhanced UI/UX features
    if (typeof initEnhancedUI === 'function') {
        initEnhancedUI();
    } else {
        // Load enhanced UI script if not already loaded
        const enhancedUIScript = document.createElement('script');
        enhancedUIScript.src = 'enhanced-ui.js';
        document.body.appendChild(enhancedUIScript);
    }
});

// Global variables for pagination
let currentPage = 1;
let itemsPerPage = 30;
let allProducts = [];

// We'll use this function instead of relying on product-loader.js
async function loadProducts() {
    try {
        // Fetch the JSON file
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch product data: ${response.status}`);
        }
        // Parse the JSON data (automatically handled by response.json())
        const products = await response.json();
        
        // Store all products globally
        allProducts = products;
        
        // Get URL parameters for filtering
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        // Filter products if category parameter exists
        let filteredProducts = products;
        if (categoryParam) {
            filteredProducts = products.filter(product => 
                product.category.toLowerCase().includes(categoryParam.toLowerCase()) ||
                categoryParam.toLowerCase().includes(product.category.toLowerCase()));
                
            console.log('Filtering products for category:', categoryParam);
                
            // Update page title and heading for category results
            document.title = `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} - MegaShop`;
            const pageHeading = document.querySelector('.page-header h2');
            if (pageHeading) {
                pageHeading.textContent = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
            }
            
            // Check the corresponding category checkbox in the filter sidebar
            // Need to handle different formats of category values
            let categoryValue = categoryParam.toLowerCase();
            
            // Map URL parameter values to checkbox values if needed
            const categoryMappings = {
                'home': 'home-kitchen',
                'home & kitchen': 'home-kitchen',
                'sports & outdoors': 'sports',
                'sports': 'sports',
                'books & media': 'books',
                'books': 'books',
                'toys & games': 'toys',
                'toys': 'toys',
                'electronics': 'electronics',
                'fashion': 'fashion',
                'beauty': 'beauty'
            };
            
            // Apply mapping if it exists
            if (categoryMappings[categoryValue]) {
                categoryValue = categoryMappings[categoryValue];
            }
            
            // Try to find the checkbox with the mapped value
            let categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryValue}"]`);
            
            // Debug log to help troubleshoot
            console.log('Looking for category checkbox with value:', categoryValue);
            
            // If not found, try with the original parameter
            if (!categoryCheckbox) {
                categoryCheckbox = document.querySelector(`input[name="category"][value="${categoryParam}"]`);
                console.log('Trying with original parameter:', categoryParam);
            }
            
            // If still not found, try with additional variations
            if (!categoryCheckbox) {
                // Try without any special characters and spaces
                const simplifiedValue = categoryParam.toLowerCase().replace(/[^a-z0-9]/g, '');
                console.log('Trying with simplified value:', simplifiedValue);
                categoryCheckbox = document.querySelector(`input[name="category"][value*="${simplifiedValue}"]`);
            }
            
            // If found, check it
            if (categoryCheckbox) {
                categoryCheckbox.checked = true;
                // Trigger the filter application to ensure UI is updated
                applyFilters();
            } else {
                console.log(`Could not find checkbox for category: ${categoryParam}`);
            }
        }
        
        // Update product count with total number of products
        updateProductCount(filteredProducts.length);
        
        // Set up pagination
        setupPagination(filteredProducts);
        
        // Display the first page of products
        displayProductsPage(filteredProducts, currentPage);
        
        console.log('Products loaded successfully:', filteredProducts.length);
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.querySelector('.product-grid').innerHTML = 
            `<div class="error-message">Failed to load products. Please try again later.</div>`;
    }
}

// Function to set up pagination
function setupPagination(products) {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginationElements = document.querySelectorAll('.pagination');
    
    // Update all pagination elements on the page
    paginationElements.forEach(pagination => {
        pagination.innerHTML = '';
        
        // Add previous button
        const prevBtn = document.createElement('div');
        prevBtn.className = 'pagination-item';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayProductsPage(products, currentPage);
                updatePaginationUI();
            }
        });
        pagination.appendChild(prevBtn);
        
        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust if we're near the end
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('div');
            pageItem.className = 'pagination-item';
            if (i === currentPage) pageItem.classList.add('active');
            pageItem.textContent = i;
            pageItem.addEventListener('click', () => {
                currentPage = i;
                displayProductsPage(products, currentPage);
                updatePaginationUI();
            });
            pagination.appendChild(pageItem);
        }
        
        // Add next button
        const nextBtn = document.createElement('div');
        nextBtn.className = 'pagination-item';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                displayProductsPage(products, currentPage);
                updatePaginationUI();
            }
        });
        pagination.appendChild(nextBtn);
    });
}

// Function to update pagination UI
function updatePaginationUI() {
    const paginationElements = document.querySelectorAll('.pagination');
    
    paginationElements.forEach(pagination => {
        const pageItems = pagination.querySelectorAll('.pagination-item');
        
        pageItems.forEach(item => {
            if (item.textContent === currentPage.toString()) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}

// Function to display a specific page of products
function displayProductsPage(products, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    const pageProducts = products.slice(startIndex, endIndex);
    
    // Display the products for this page
    displayProducts(pageProducts);
    
    // Scroll to top of product grid
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
        productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function updateProductCount(count) {
    const countElement = document.querySelector('.shop-header h2 span');
    if (countElement) {
        countElement.textContent = `(${count} items)`;
    }
}

function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // Clear existing content
    productGrid.innerHTML = '';
    
    // Add products to the grid
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.productId = product.productId;
    
    // Make the entire product card clickable
    productCard.style.cursor = 'pointer';
    productCard.addEventListener('click', function(e) {
        // Don't navigate if clicking on a button or link inside the card
        if (e.target.tagName === 'BUTTON' || 
            e.target.tagName === 'A' || 
            e.target.closest('button') || 
            e.target.closest('a')) {
            return;
        }
        
        // Navigate to product detail page
        window.location.href = `product-detail.html?id=${product.productId}`;
    });
    
    // Create product image section
    const productImage = document.createElement('div');
    productImage.className = 'product-image';
    
    const img = document.createElement('img');
    img.src = product.imageUrl || 'https://via.placeholder.com/300x300';
    img.alt = product.productName;
    img.onerror = function() {
        // If the image fails to load, replace with a reliable fallback
        this.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.productName)}`;
    };
    img.style.width = '100%';
    img.style.height = '300px';
    img.style.objectFit = 'cover';
    productImage.appendChild(img);
    
    // Add product tags if stock status is special
    if (product.stockStatus && product.stockStatus !== 'In Stock') {
        const productTags = document.createElement('div');
        productTags.className = 'product-tags';
        
        const tag = document.createElement('span');
        tag.className = 'tag tag-soldout';
        tag.textContent = product.stockStatus;
        productTags.appendChild(tag);
        
        productImage.appendChild(productTags);
    }
    
    // Add subcategory tag if available
    if (product.subcategory) {
        const subcategoryTag = document.createElement('div');
        subcategoryTag.className = 'product-tags product-subcategory';
        
        const tag = document.createElement('span');
        tag.className = 'tag tag-subcategory';
        tag.textContent = product.subcategory;
        subcategoryTag.appendChild(tag);
        
        productImage.appendChild(subcategoryTag);
    }
    
    // Add product actions
    const productActions = document.createElement('div');
    productActions.className = 'product-actions';
    
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'action-btn';
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    wishlistBtn.title = 'Add to Wishlist';
    
    const cartBtn = document.createElement('button');
    cartBtn.className = 'action-btn';
    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    cartBtn.title = 'Add to Cart';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'action-btn';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.title = 'Quick View';
    viewBtn.addEventListener('click', function() {
        showProductQuickView(product);
    });
    
    productActions.appendChild(wishlistBtn);
    productActions.appendChild(cartBtn);
    productActions.appendChild(viewBtn);
    
    productImage.appendChild(productActions);
    productCard.appendChild(productImage);
    
    // Create product info section
    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';
    
    const category = document.createElement('div');
    category.className = 'product-category';
    category.textContent = product.category;
    productInfo.appendChild(category);
    
    const title = document.createElement('h3');
    const productLink = document.createElement('a');
    productLink.href = `product-detail.html?id=${product.productId}`;
    productLink.textContent = product.productName;
    title.appendChild(productLink);
    productInfo.appendChild(title);
    
    // Add short description
    const description = document.createElement('div');
    description.className = 'product-description';
    description.textContent = product.description;
    productInfo.appendChild(description);
    
    // Add rating
    const productRating = document.createElement('div');
    productRating.className = 'product-rating';
    
    const rating = parseFloat(product.rating) || 0;
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= rating) {
            star.className = 'fas fa-star';
        } else if (i - 0.5 <= rating) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
        productRating.appendChild(star);
    }
    productInfo.appendChild(productRating);
    
    // Add price
    const productPrice = document.createElement('div');
    productPrice.className = 'product-price';
    
    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = `$${product.price}`;
    productPrice.appendChild(currentPrice);
    
    productInfo.appendChild(productPrice);
    
    // Add variants indicator if available
    if (product.variants && product.variants.length > 0) {
        const variantsIndicator = document.createElement('div');
        variantsIndicator.className = 'variants-indicator';
        variantsIndicator.innerHTML = `<span>${product.variants.length} variants available</span>`;
        productInfo.appendChild(variantsIndicator);
    }
    
    productCard.appendChild(productInfo);
    
    return productCard;
}

function initViewOptions() {
    const viewOptions = document.querySelectorAll('.view-option');
    const productGrid = document.querySelector('.product-grid');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update grid view
            const viewType = this.getAttribute('data-view');
            if (viewType === 'list') {
                productGrid.classList.add('list-view');
            } else {
                productGrid.classList.remove('list-view');
            }
        });
    });
}

function initFilters() {
    // Apply filters button
    const applyFilterBtn = document.querySelector('.apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
    
    // Reset filters button
    const resetFilterBtn = document.querySelector('.reset-filter');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilters);
    }
    
    // Sort by dropdown
    const sortSelect = document.querySelector('.sort-by select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Add event listeners to all filter checkboxes for immediate filtering
    const filterCheckboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Add event listeners to price range inputs
    const priceInputs = document.querySelectorAll('.price-range input');
    priceInputs.forEach(input => {
        input.addEventListener('input', debounce(applyFilters, 500));
    });
}

async function applyFilters() {
    try {
        // Use the global allProducts variable instead of fetching again
        let products = [...allProducts];
        
        // Get selected categories
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        if (categoryCheckboxes.length > 0) {
            const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value.toLowerCase());
            products = products.filter(product => {
                return selectedCategories.some(category => {
                    // Handle special mappings
                    if (category === 'home-kitchen' && product.category.toLowerCase() === 'home & kitchen') {
                        return true;
                    }
                    if (category === 'sports' && product.category.toLowerCase() === 'sports & outdoors') {
                        return true;
                    }
                    if (category === 'books' && product.category.toLowerCase() === 'books & media') {
                        return true;
                    }
                    if (category === 'toys' && product.category.toLowerCase() === 'toys & games') {
                        return true;
                    }
                    return product.category.toLowerCase() === category;
                });
            });
        }
        
        // Get selected brands
        const brandCheckboxes = document.querySelectorAll('input[name="brand"]:checked');
        if (brandCheckboxes.length > 0) {
            const selectedBrands = Array.from(brandCheckboxes).map(cb => cb.value);
            products = products.filter(product => {
                // Check if the product has a brand that matches any selected brand
                return selectedBrands.some(brand => 
                    product.productName.toLowerCase().includes(brand.toLowerCase()));
            });
        }
        
        // Get price range
        const minPrice = parseFloat(document.querySelector('.price-range input[placeholder="Min"]').value) || 0;
        const maxPrice = parseFloat(document.querySelector('.price-range input[placeholder="Max"]').value) || Infinity;
        
        products = products.filter(product => {
            const price = parseFloat(product.price);
            return price >= minPrice && price <= maxPrice;
        });
        
        // Get selected ratings
        const ratingCheckboxes = document.querySelectorAll('input[name="rating"]:checked');
        if (ratingCheckboxes.length > 0) {
            const selectedRatings = Array.from(ratingCheckboxes).map(cb => parseInt(cb.value));
            products = products.filter(product => {
                const rating = Math.floor(parseFloat(product.rating));
                return selectedRatings.includes(rating);
            });
        }
        
        // Apply sorting
        const sortBy = document.querySelector('.sort-by select').value;
        sortProducts(products, sortBy);
        
        // Update product count with total number of filtered products
        updateProductCount(products.length);
        
        // Set up pagination with filtered products
        setupPagination(products);
        
        // Display the current page of filtered products
        displayProductsPage(products, currentPage);
        
    } catch (error) {
        console.error('Error applying filters:', error);
    }
}

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'newest':
            // Assuming Product ID has some correlation with newness
            products.sort((a, b) => b.productId.localeCompare(a.productId));
            break;
        case 'rating':
            products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            break;
        case 'featured':
        default:
            // No sorting needed for featured
            break;
    }
    return products;
}

function resetFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset price inputs
    document.querySelectorAll('.price-range input').forEach(input => {
        input.value = '';
    });
    
    // Reset sort dropdown
    document.querySelector('.sort-by select').value = 'featured';
    
    // Reload all products
    loadProducts();
}

// Helper function to debounce frequent events like input typing
function debounce(func, delay) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}

// Function to show product quick view modal
function showProductQuickView(product) {
    // Create modal container if it doesn't exist
    let quickViewModal = document.getElementById('quick-view-modal');
    if (!quickViewModal) {
        quickViewModal = document.createElement('div');
        quickViewModal.id = 'quick-view-modal';
        quickViewModal.className = 'modal';
        document.body.appendChild(quickViewModal);
    }
    
    // Create modal content
    quickViewModal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="quick-view-container">
                <div class="quick-view-image">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/500x500'}" alt="${product.productName}" 
                         onerror="this.src='https://via.placeholder.com/500x500?text=${encodeURIComponent(product.productName)}'" 
                         style="width: 100%; height: auto; object-fit: contain;">
                </div>
                <div class="quick-view-details">
                    <h2>${product.productName}</h2>
                    <div class="product-category">${product.category} > ${product.subcategory}</div>
                    <div class="product-rating">
                        ${generateRatingStars(product.rating)}
                        <span class="rating-value">${product.rating}</span>
                    </div>
                    <div class="product-price">$${product.price}</div>
                    <div class="product-description">${product.description}</div>
                    
                    ${generateSpecificationsHTML(product)}
                    ${generateVariantsHTML(product)}
                    
                    <div class="product-actions">
                        <button class="add-to-cart-btn">Add to Cart</button>
                        <button class="add-to-wishlist-btn">Add to Wishlist</button>
                        <a href="product-detail.html?id=${product.productId}" class="view-details-btn">View Full Details</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show the modal with animation
    quickViewModal.style.display = 'block';
    // Add a small delay before adding the show class for the animation to work
    setTimeout(() => {
        quickViewModal.classList.add('show');
    }, 10);
    
    // Add event listener to close button
    const closeBtn = quickViewModal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        quickViewModal.classList.remove('show');
        setTimeout(() => {
            quickViewModal.style.display = 'none';
        }, 300);
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', function(event) {
        if (event.target === quickViewModal) {
            quickViewModal.classList.remove('show');
            setTimeout(() => {
                quickViewModal.style.display = 'none';
            }, 300);
        }
    });
    
    // Add animation to variant items if they exist
    const variantItems = quickViewModal.querySelectorAll('.variant-item');
    if (variantItems.length > 0) {
        variantItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove selected class from all variants
                variantItems.forEach(v => v.classList.remove('selected'));
                // Add selected class to clicked variant
                this.classList.add('selected');
            });
        });
    }
}

// Helper function to generate rating stars HTML
function generateRatingStars(rating) {
    let starsHTML = '';
    const ratingValue = parseFloat(rating) || 0;
    
    for (let i = 1; i <= 5; i++) {
        if (i <= ratingValue) {
            starsHTML += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= ratingValue) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        } else {
            starsHTML += '<i class="far fa-star"></i>';
        }
    }
    
    return starsHTML;
}

// Helper function to generate specifications HTML
function generateSpecificationsHTML(product) {
    if (!product.specifications) return '';
    
    let specsHTML = '<div class="product-specifications"><h3>Specifications</h3><ul>';
    
    for (const [key, value] of Object.entries(product.specifications)) {
        specsHTML += `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`;
    }
    
    specsHTML += '</ul></div>';
    return specsHTML;
}

// Helper function to generate variants HTML
function generateVariantsHTML(product) {
    if (!product.variants || product.variants.length === 0) return '';
    
    let variantsHTML = '<div class="product-variants"><h3>Available Variants</h3><div class="variant-options">';
    
    // Group variants by property (color, size, etc.)
    const variantProperties = {};
    
    product.variants.forEach(variant => {
        for (const [key, value] of Object.entries(variant)) {
            if (key !== 'inStock') {
                if (!variantProperties[key]) {
                    variantProperties[key] = new Set();
                }
                variantProperties[key].add(value);
            }
        }
    });
    
    // Create option buttons for each property
    for (const [property, values] of Object.entries(variantProperties)) {
        variantsHTML += `<div class="variant-group"><span>${property.charAt(0).toUpperCase() + property.slice(1)}:</span>`;
        
        values.forEach(value => {
            // Check if this variant is in stock
            const inStock = product.variants.some(v => v[property] === value && v.inStock);
            const stockClass = inStock ? 'in-stock' : 'out-of-stock';
            
            variantsHTML += `<button class="variant-option ${stockClass}" data-property="${property}" data-value="${value}">${value}</button>`;
        });
        
        variantsHTML += '</div>';
    }
    
    variantsHTML += '</div></div>';
    return variantsHTML;
}