/* Enhanced UI/UX JavaScript for MegaShop */

document.addEventListener('DOMContentLoaded', function() {
    // Apply enhanced UI styles by adding the stylesheet
    applyEnhancedStyles();
    
    // Initialize enhanced UI features
    initScrollEffects();
    initProductCardAnimations();
    initMicroInteractions();
    enhanceQuickViewModal();
    initScrollToTop();
});

function applyEnhancedStyles() {
    // Check if the enhanced styles are already applied
    if (!document.querySelector('link[href="enhanced-ui.css"]')) {
        const enhancedStyles = document.createElement('link');
        enhancedStyles.rel = 'stylesheet';
        enhancedStyles.href = 'enhanced-ui.css';
        document.head.appendChild(enhancedStyles);
        console.log('Enhanced UI styles applied');
    }
}

function initScrollEffects() {
    // Add scrolled class to header when scrolling
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Add staggered animation to product cards on scroll
    const productCards = document.querySelectorAll('.product-card');
    if (productCards.length > 0) {
        // Set initial delay for each card
        productCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.05}s`;
        });
    }
}

function initProductCardAnimations() {
    // Add hover animations to product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add transition class for smoother animations
        card.classList.add('enhanced');
        
        // Add subtle hover effect to action buttons
        const actionBtns = card.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    });
}

function initMicroInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .action-btn, .apply-filter, .reset-filter');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add feedback to checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                this.parentElement.style.color = 'var(--primary-color)';
            } else {
                this.parentElement.style.color = '';
            }
        });
    });
    
    // Add feedback to filter application
    const applyFilterBtn = document.querySelector('.apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            // Add loading state
            this.classList.add('loading');
            this.innerHTML = '<span class="btn-text">Applying...</span>';
            
            // Remove loading state after filters are applied
            setTimeout(() => {
                this.classList.remove('loading');
                this.innerHTML = 'Apply Filters';
            }, 500);
        });
    }
}

function enhanceQuickViewModal() {
    // Enhance the quick view modal with animations
    const originalShowProductQuickView = window.showProductQuickView;
    
    if (typeof originalShowProductQuickView === 'function') {
        // Override the original function with enhanced version
        window.showProductQuickView = function(product) {
            // Call the original function
            originalShowProductQuickView(product);
            
            // Get the modal
            const quickViewModal = document.getElementById('quick-view-modal');
            if (quickViewModal) {
                // Add animation classes
                quickViewModal.classList.add('show');
                
                // Add variant selection functionality
                const variantItems = quickViewModal.querySelectorAll('.variant-item');
                variantItems.forEach(item => {
                    item.addEventListener('click', function() {
                        // Remove selected class from all variants
                        variantItems.forEach(v => v.classList.remove('selected'));
                        // Add selected class to clicked variant
                        this.classList.add('selected');
                    });
                });
                
                // Enhance close button
                const closeBtn = quickViewModal.querySelector('.close-modal');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        // Add fade out animation
                        quickViewModal.classList.remove('show');
                        setTimeout(() => {
                            quickViewModal.style.display = 'none';
                        }, 300);
                    });
                }
                
                // Close modal when clicking outside content with animation
                quickViewModal.addEventListener('click', function(event) {
                    if (event.target === quickViewModal) {
                        quickViewModal.classList.remove('show');
                        setTimeout(() => {
                            quickViewModal.style.display = 'none';
                        }, 300);
                    }
                });
            }
        };
    }
}

function initScrollToTop() {
    // Create scroll to top button if it doesn't exist
    if (!document.querySelector('.scroll-to-top')) {
        const scrollBtn = document.createElement('div');
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Add CSS for ripple effect
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
        
        .btn, .action-btn, .apply-filter, .reset-filter {
            position: relative;
            overflow: hidden;
        }
        
        .loading {
            position: relative;
        }
        
        .loading::after {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 0.8s linear infinite;
            right: 15px;
            top: calc(50% - 10px);
        }
        
        .loading .btn-text {
            margin-right: 25px;
        }
    `;
    document.head.appendChild(style);
}

// Call this function to add ripple styles
addRippleStyles();