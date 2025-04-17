// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
    initSearchFunctionality();
});

function initSearchFunctionality() {
    const searchIcon = document.querySelector('.search-icon');
    
    if (searchIcon) {
        // Create search overlay elements
        const searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.style.display = 'none';
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        
        const searchForm = document.createElement('form');
        searchForm.className = 'search-form';
        searchForm.setAttribute('action', 'shop.html');
        searchForm.setAttribute('method', 'get');
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.name = 'search';
        searchInput.placeholder = 'Search for products...';
        searchInput.className = 'search-input';
        
        const searchButton = document.createElement('button');
        searchButton.type = 'submit';
        searchButton.className = 'search-button';
        searchButton.innerHTML = '<i class="fas fa-search"></i>';
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'close-search';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        
        // Assemble the search form
        searchForm.appendChild(searchInput);
        searchForm.appendChild(searchButton);
        searchContainer.appendChild(searchForm);
        searchContainer.appendChild(closeButton);
        searchOverlay.appendChild(searchContainer);
        
        // Add to the DOM
        document.body.appendChild(searchOverlay);
        
        // Add event listeners
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.style.display = 'flex';
            searchInput.focus();
            document.body.style.overflow = 'hidden'; // Prevent scrolling when search is open
        });
        
        closeButton.addEventListener('click', function() {
            searchOverlay.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        });
        
        // Close search when clicking outside the search container
        searchOverlay.addEventListener('click', function(e) {
            if (e.target === searchOverlay) {
                searchOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Handle search form submission
        searchForm.addEventListener('submit', function(e) {
            const searchTerm = searchInput.value.trim();
            if (!searchTerm) {
                e.preventDefault();
                return;
            }
            // Form will naturally submit to shop.html with search parameter
        });
    }
}

// Add search results handling to shop page
function handleSearchResults() {
    // Only run on shop page
    if (!window.location.href.includes('shop.html')) {
        return;
    }
    
    const searchParam = getUrlParameter('search');
    if (searchParam) {
        // Update page title and heading
        document.title = `Search: ${searchParam} - MegaShop`;
        
        const pageHeading = document.querySelector('.shop-section h2');
        if (pageHeading) {
            pageHeading.textContent = `Search Results: "${searchParam}"`;
        }
        
        // Update search input if it exists
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = searchParam;
        }
        
        // Filter products based on search term
        filterProductsBySearch(searchParam);
    }
}

function filterProductsBySearch(searchTerm) {
    if (!searchTerm) return;
    
    searchTerm = searchTerm.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    let matchCount = 0;
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description') ? 
            card.querySelector('.product-description').textContent.toLowerCase() : '';
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = '';
            matchCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show message if no results found
    const resultsContainer = document.querySelector('.product-grid');
    const noResultsMessage = document.getElementById('no-results-message');
    
    if (matchCount === 0) {
        if (!noResultsMessage) {
            const message = document.createElement('div');
            message.id = 'no-results-message';
            message.className = 'no-results';
            message.innerHTML = `<p>No products found matching "${searchTerm}". Try a different search term.</p>`;
            resultsContainer.parentNode.insertBefore(message, resultsContainer.nextSibling);
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
    
    // Update result count
    const resultCount = document.querySelector('.result-count');
    if (resultCount) {
        resultCount.textContent = `${matchCount} product${matchCount !== 1 ? 's' : ''} found`;
    }
}

// Helper function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Initialize search results handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    handleSearchResults();
});