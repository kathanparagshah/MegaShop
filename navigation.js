// Navigation Enhancement Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the enhanced navigation
    initEnhancedNavigation();
});

function initEnhancedNavigation() {
    // Create dropdown menus for main navigation items
    createDropdownMenus();
    
    // Handle mobile navigation
    handleMobileNavigation();
}

function createDropdownMenus() {
    // Shop Dropdown
    createDropdown('Shop', [
        { name: 'All Products', link: 'shop.html' },
        { name: 'New Arrivals', link: 'shop-new-arrivals.html' },
        { name: 'Best Sellers', link: 'shop-best-sellers.html' },
        { name: 'Featured Collections', link: 'shop-featured.html' },
        { name: 'Seasonal Items', link: 'shop-seasonal.html' },
        { name: 'Gift Ideas', link: 'shop-gifts.html' }
    ]);
    
    // Categories Dropdown with subcategories
    createNestedDropdown('Categories', [
        { 
            name: 'Electronics', 
            link: 'electronics.html',
            subcategories: [
                { name: 'Smartphones', link: 'electronics-smartphones.html' },
                { name: 'Laptops', link: 'electronics-laptops.html' },
                { name: 'Audio', link: 'electronics-audio.html' },
                { name: 'Cameras', link: 'electronics-cameras.html' },
                { name: 'Wearables', link: 'electronics-wearables.html' }
            ]
        },
        { 
            name: 'Fashion', 
            link: 'fashion.html',
            subcategories: [
                { name: 'Men\'s Clothing', link: 'fashion-mens.html' },
                { name: 'Women\'s Clothing', link: 'fashion-womens.html' },
                { name: 'Footwear', link: 'fashion-footwear.html' },
                { name: 'Accessories', link: 'fashion-accessories.html' },
                { name: 'Jewelry', link: 'fashion-jewelry.html' }
            ]
        },
        { 
            name: 'Home & Kitchen', 
            link: 'home-kitchen.html',
            subcategories: [
                { name: 'Furniture', link: 'home-furniture.html' },
                { name: 'Appliances', link: 'home-appliances.html' },
                { name: 'Cookware', link: 'home-cookware.html' },
                { name: 'Decor', link: 'home-decor.html' },
                { name: 'Bedding', link: 'home-bedding.html' }
            ]
        },
        { 
            name: 'Beauty', 
            link: 'beauty.html',
            subcategories: [
                { name: 'Skincare', link: 'beauty-skincare.html' },
                { name: 'Makeup', link: 'beauty-makeup.html' },
                { name: 'Haircare', link: 'beauty-haircare.html' },
                { name: 'Fragrances', link: 'beauty-fragrances.html' },
                { name: 'Personal Care', link: 'beauty-personal-care.html' }
            ]
        },
        { 
            name: 'Sports & Outdoors', 
            link: 'sports-outdoors.html',
            subcategories: [
                { name: 'Fitness', link: 'sports-fitness.html' },
                { name: 'Outdoor Recreation', link: 'sports-outdoor-recreation.html' },
                { name: 'Team Sports', link: 'sports-team.html' },
                { name: 'Camping', link: 'sports-camping.html' },
                { name: 'Water Sports', link: 'sports-water.html' }
            ]
        },
        { 
            name: 'Books & Media', 
            link: 'books-media.html',
            subcategories: [
                { name: 'Fiction', link: 'books-fiction.html' },
                { name: 'Non-Fiction', link: 'books-non-fiction.html' },
                { name: 'Movies', link: 'media-movies.html' },
                { name: 'Music', link: 'media-music.html' },
                { name: 'Video Games', link: 'media-games.html' }
            ]
        },
        { 
            name: 'Toys & Games', 
            link: 'toys-games.html',
            subcategories: [
                { name: 'Action Figures', link: 'toys-action-figures.html' },
                { name: 'Board Games', link: 'toys-board-games.html' },
                { name: 'Educational Toys', link: 'toys-educational.html' },
                { name: 'Outdoor Toys', link: 'toys-outdoor.html' },
                { name: 'Puzzles', link: 'toys-puzzles.html' }
            ]
        }
    ]);
    
    // Deals Dropdown
    createDropdown('Deals', [
        { name: 'Today\'s Deals', link: 'deals-today.html' },
        { name: 'Clearance', link: 'deals-clearance.html' },
        { name: 'Weekly Specials', link: 'deals-weekly.html' },
        { name: 'Bundle Offers', link: 'deals-bundles.html' },
        { name: 'Seasonal Sales', link: 'deals-seasonal.html' }
    ]);
    
    // Contact Dropdown
    createDropdown('Contact', [
        { name: 'Customer Support', link: 'contact-support.html' },
        { name: 'Store Locations', link: 'contact-locations.html' },
        { name: 'Contact Form', link: 'contact.html' },
        { name: 'FAQ', link: 'contact-faq.html' }
    ]);
}

function createDropdown(navItemText, dropdownItems) {
    // Find the navigation item
    const navItems = document.querySelectorAll('nav ul li');
    let navItem = null;
    
    for (let item of navItems) {
        if (item.querySelector('a').textContent === navItemText) {
            navItem = item;
            break;
        }
    }
    
    if (!navItem) return;
    
    // Add dropdown class to the nav item
    navItem.classList.add('dropdown');
    
    // Create dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    
    // Add dropdown items
    dropdownItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.link;
        link.textContent = item.name;
        dropdownContent.appendChild(link);
    });
    
    // Append dropdown content to nav item
    navItem.appendChild(dropdownContent);
    
    // Add event listeners for hover effect
    navItem.addEventListener('mouseenter', function() {
        dropdownContent.style.display = 'block';
        setTimeout(() => {
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
        }, 10);
    });
    
    navItem.addEventListener('mouseleave', function() {
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(10px)';
        setTimeout(() => {
            dropdownContent.style.display = 'none';
        }, 300);
    });
}

function createNestedDropdown(navItemText, categoryItems) {
    // Find the navigation item
    const navItems = document.querySelectorAll('nav ul li');
    let navItem = null;
    
    for (let item of navItems) {
        if (item.querySelector('a').textContent === navItemText) {
            navItem = item;
            break;
        }
    }
    
    if (!navItem) return;
    
    // Add dropdown class to the nav item
    navItem.classList.add('dropdown');
    
    // Create dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.className = 'dropdown-content';
    
    // Add category items with subcategories
    categoryItems.forEach(category => {
        // Create category container
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'category-container';
        
        // Create main category link
        const categoryLink = document.createElement('a');
        categoryLink.href = category.link;
        categoryLink.className = 'category-main';
        categoryLink.textContent = category.name;
        categoryContainer.appendChild(categoryLink);
        
        // If category has subcategories, create nested dropdown
        if (category.subcategories && category.subcategories.length > 0) {
            // Create subcategory container
            const subContainer = document.createElement('div');
            subContainer.className = 'subcategory-container';
            
            // Add subcategory items
            category.subcategories.forEach(subItem => {
                const subLink = document.createElement('a');
                subLink.href = subItem.link;
                subLink.className = 'subcategory-item';
                subLink.textContent = subItem.name;
                subContainer.appendChild(subLink);
            });
            
            // Add subcategory container to category container
            categoryContainer.appendChild(subContainer);
            
            // Add hover effect for desktop
            categoryContainer.addEventListener('mouseenter', function() {
                subContainer.style.display = 'block';
                setTimeout(() => {
                    subContainer.style.opacity = '1';
                }, 10);
            });
            
            categoryContainer.addEventListener('mouseleave', function() {
                subContainer.style.opacity = '0';
                setTimeout(() => {
                    subContainer.style.display = 'none';
                }, 300);
            });
        }
        
        // Add category container to dropdown content
        dropdownContent.appendChild(categoryContainer);
    });
    
    // Append dropdown content to nav item
    navItem.appendChild(dropdownContent);
    
    // Add event listeners for hover effect on main dropdown
    navItem.addEventListener('mouseenter', function() {
        dropdownContent.style.display = 'block';
        setTimeout(() => {
            dropdownContent.style.opacity = '1';
            dropdownContent.style.transform = 'translateY(0)';
        }, 10);
    });
    
    navItem.addEventListener('mouseleave', function() {
        dropdownContent.style.opacity = '0';
        dropdownContent.style.transform = 'translateY(10px)';
        setTimeout(() => {
            dropdownContent.style.display = 'none';
        }, 300);
    });
}
}

function handleMobileNavigation() {
    // This would be implemented with a hamburger menu in a real application
    
    // Handle mobile category clicks to show subcategories
    const categoryContainers = document.querySelectorAll('.category-container');
    
    categoryContainers.forEach(container => {
        const categoryMain = container.querySelector('.category-main');
        const subContainer = container.querySelector('.subcategory-container');
        
        if (categoryMain && subContainer) {
            categoryMain.addEventListener('click', function(e) {
                // Only prevent default if we're on mobile
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    container.classList.toggle('active');
                    
                    // Close other open subcategories
                    categoryContainers.forEach(otherContainer => {
                        if (otherContainer !== container && otherContainer.classList.contains('active')) {
                            otherContainer.classList.remove('active');
                        }
                    });
                }
            });
        }
    });
    
    // Add responsive menu toggle
    const menuToggle = document.createElement('div');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const header = document.querySelector('header .container');
    const nav = document.querySelector('nav');
    
    if (header && nav) {
        header.insertBefore(menuToggle, nav);
        
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    console.log('Mobile dropdown navigation initialized');
    
    // In a real implementation, we would add code to handle mobile navigation
    // For example, showing/hiding dropdowns on tap instead of hover
}

// Create dedicated pages for each section
function createShopPage() {
    // This would create a full shop page with filtering options
    console.log('Shop page would be created here');
}

function createCategoriesPage() {
    // This would create a categories page with filtering and sorting
    console.log('Categories page would be created here');
}

function createDealsPage() {
    // This would create a deals page with current offers
    console.log('Deals page would be created here');
}

function createContactPage() {
    // This would create a contact page with form and information
    console.log('Contact page would be created here');
}