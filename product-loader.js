// Product Loader - Loads product data from CSV file
document.addEventListener('DOMContentLoaded', function() {
    // Only run on shop or category pages
    if (window.location.href.includes('shop.html') || 
        window.location.href.includes('electronics.html') ||
        window.location.href.includes('fashion.html') ||
        window.location.href.includes('home') ||
        window.location.href.includes('beauty.html') ||
        window.location.href.includes('categories.html')) {
        
        loadProducts();
    }
});

async function loadProducts() {
    try {
        // Fetch the CSV file
        const response = await fetch('product_data.csv');
        const data = await response.text();
        
        // Parse the CSV data
        const products = parseCSV(data);
        
        // Get filter parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const categoryParam = window.location.pathname.split('/').pop();
        
        // Filter products based on URL parameters
        let filteredProducts = products;
        
        // Filter by category if on a category page
        if (categoryParam && categoryParam.includes('.html')) {
            const category = categoryParam.replace('.html', '');
            if (category !== 'shop') {
                filteredProducts = products.filter(product => 
                    product.Category.toLowerCase() === category.toLowerCase());
            }
        }
        
        // Filter by search term if present
        if (searchParam) {
            const searchTerm = searchParam.toLowerCase();
            filteredProducts = filteredProducts.filter(product => 
                product['Product Name'].toLowerCase().includes(searchTerm) || 
                product.Description.toLowerCase().includes(searchTerm) ||
                product.Category.toLowerCase().includes(searchTerm) ||
                product.Subcategory.toLowerCase().includes(searchTerm)
            );
            
            // Update page title and heading for search results
            document.title = `Search: ${searchParam} - MegaShop`;
            const pageHeading = document.querySelector('.page-header h2');
            if (pageHeading) {
                pageHeading.textContent = `Search Results: "${searchParam}"`;
            }
        }
        
        // Apply any checkbox filters if they exist
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        if (categoryCheckboxes.length > 0) {
            const selectedCategories = Array.from(categoryCheckboxes).map(cb => cb.value.toLowerCase());
            filteredProducts = filteredProducts.filter(product => 
                selectedCategories.includes(product.Category.toLowerCase()));
        }
        
        // Update product count
        const productCountElement = document.querySelector('.shop-header h2 span');
        if (productCountElement) {
            productCountElement.textContent = `(${filteredProducts.length} items)`;
        }
        
        // Display the filtered products
        displayProducts(filteredProducts);
        
        // Initialize product actions after products are loaded
        initProductActions();
        
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const products = [];
    
    // Process each line starting from line 1 (after headers)
    for (let i = 1; i < lines.length; i++) {
        // Skip empty lines or comment lines
        if (lines[i].trim() === '' || lines[i].trim().startsWith('#')) continue;
        
        const values = lines[i].split(',');
        if (values.length !== headers.length) continue;
        
        const product = {};
        headers.forEach((header, index) => {
            product[header.trim()] = values[index].trim();
        });
        
        products.push(product);
    }
    
    return products;
}

function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;
    
    // Clear existing products
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
    
    // Create product image section
    const productImage = document.createElement('div');
    productImage.className = 'product-image';
    
    const img = document.createElement('img');
    img.src = product['Image URL'] || 'https://via.placeholder.com/500x500';
    img.alt = product['Product Name'];
    productImage.appendChild(img);
    
    // Add product tags if stock status is special
    if (product['Stock Status'] !== 'In Stock') {
        const productTags = document.createElement('div');
        productTags.className = 'product-tags';
        
        const tag = document.createElement('span');
        tag.className = 'tag tag-soldout';
        tag.textContent = product['Stock Status'];
        productTags.appendChild(tag);
        
        productImage.appendChild(productTags);
    }
    
    // Add product actions
    const productActions = document.createElement('div');
    productActions.className = 'product-actions';
    
    const wishlistBtn = document.createElement('button');
    wishlistBtn.className = 'action-btn';
    wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
    
    const cartBtn = document.createElement('button');
    cartBtn.className = 'action-btn';
    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'action-btn';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    
    productActions.appendChild(wishlistBtn);
    productActions.appendChild(cartBtn);
    productActions.appendChild(viewBtn);
    
    productImage.appendChild(productActions);
    productCard.appendChild(productImage);
    
    // Create product info section
    const productInfo = document.createElement('div');
    productInfo.className = 'product-info';
    
    const title = document.createElement('h3');
    title.textContent = product['Product Name'];
    productInfo.appendChild(title);
    
    const productPrice = document.createElement('div');
    productPrice.className = 'product-price';
    
    const currentPrice = document.createElement('span');
    currentPrice.className = 'current-price';
    currentPrice.textContent = `$${product.Price}`;
    productPrice.appendChild(currentPrice);
    
    productInfo.appendChild(productPrice);
    
    // Add rating
    const productRating = document.createElement('div');
    productRating.className = 'product-rating';
    
    const rating = parseFloat(product.Rating);
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
    
    const ratingCount = document.createElement('span');
    ratingCount.textContent = `(${Math.floor(Math.random() * 100) + 10})`; // Random review count for demo
    productRating.appendChild(ratingCount);
    
    productInfo.appendChild(productRating);
    productCard.appendChild(productInfo);
    
    // Add click event to view product details
    productCard.addEventListener('click', function() {
        window.location.href = `product-detail.html?id=${product['Product ID']}`;
    });
    
    return productCard;
}

// Initialize filter functionality
document.addEventListener('DOMContentLoaded', function() {
    const applyFilterBtn = document.querySelector('.apply-filter');
    const resetFilterBtn = document.querySelector('.reset-filter');
    
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            loadProducts();
        });
    }
    
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function() {
            // Uncheck all checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            
            // Reset price range inputs
            const minPriceInput = document.querySelector('input[name="min-price"]');
            const maxPriceInput = document.querySelector('input[name="max-price"]');
            
            if (minPriceInput) minPriceInput.value = '';
            if (maxPriceInput) maxPriceInput.value = '';
            
            // Reload products
            loadProducts();
        });
    }
});