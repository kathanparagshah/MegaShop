// Product Generator Script
// This script generates 10,000 products across different categories and saves them to products.json

// Define categories and subcategories
const categories = {
  "Electronics": [
    "Smartphones", "Laptops", "Tablets", "Smartwatches", "Headphones", "Speakers", 
    "Cameras", "TVs", "Gaming Consoles", "Computer Accessories"
  ],
  "Fashion": [
    "Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes", "Bags", 
    "Jewelry", "Watches", "Accessories", "Activewear", "Formal Wear"
  ],
  "Home & Kitchen": [
    "Furniture", "Kitchen Appliances", "Cookware", "Bedding", "Bath", 
    "Home Decor", "Lighting", "Storage & Organization", "Cleaning Supplies", "Garden & Outdoor"
  ],
  "Beauty": [
    "Skincare", "Makeup", "Haircare", "Fragrances", "Bath & Body", 
    "Tools & Accessories", "Men's Grooming", "Organic & Natural", "Sets & Kits", "Wellness"
  ],
  "Sports & Outdoors": [
    "Exercise & Fitness", "Outdoor Recreation", "Team Sports", "Water Sports", "Winter Sports", 
    "Cycling", "Camping & Hiking", "Athletic Clothing", "Sports Accessories", "Fan Shop"
  ],
  "Books & Media": [
    "Fiction", "Non-Fiction", "Children's Books", "Textbooks", "Magazines", 
    "E-books", "Audiobooks", "Music", "Movies & TV", "Video Games"
  ],
  "Toys & Games": [
    "Action Figures", "Dolls", "Building Toys", "Games & Puzzles", "Educational Toys", 
    "Outdoor Play", "Arts & Crafts", "Vehicles", "Stuffed Animals", "Electronic Toys"
  ]
};

// Brand names for each category
const brands = {
  "Electronics": [
    "Apple", "Samsung", "Sony", "LG", "Dell", "HP", "Lenovo", "Asus", "Bose", "JBL", 
    "Canon", "Nikon", "Microsoft", "Google", "Xiaomi", "OnePlus", "Huawei", "Acer", "Logitech", "Razer"
  ],
  "Fashion": [
    "Nike", "Adidas", "Zara", "H&M", "Levi's", "Calvin Klein", "Tommy Hilfiger", "Ralph Lauren", 
    "Gucci", "Prada", "Versace", "Coach", "Michael Kors", "Under Armour", "New Balance", "Puma", "Vans", "Converse"
  ],
  "Home & Kitchen": [
    "IKEA", "KitchenAid", "Cuisinart", "Dyson", "Ninja", "Crate & Barrel", "Pottery Barn", "Wayfair", 
    "OXO", "Breville", "Vitamix", "Instant Pot", "Shark", "Bosch", "West Elm", "Williams-Sonoma", "Rubbermaid", "Pyrex"
  ],
  "Beauty": [
    "L'Oreal", "Maybelline", "MAC", "Estee Lauder", "Clinique", "Neutrogena", "Dove", "Olay", 
    "Nivea", "Revlon", "CeraVe", "Fenty Beauty", "Kylie Cosmetics", "Urban Decay", "NYX", "Glossier", "The Ordinary"
  ],
  "Sports & Outdoors": [
    "Nike", "Adidas", "Under Armour", "The North Face", "Columbia", "Patagonia", "Yeti", "Coleman", 
    "Wilson", "Callaway", "Titleist", "Spalding", "Schwinn", "Trek", "Speedo", "Salomon", "REI", "Fitbit"
  ],
  "Books & Media": [
    "Penguin Random House", "HarperCollins", "Simon & Schuster", "Macmillan", "Hachette", 
    "Scholastic", "Disney", "Warner Bros", "Universal", "Sony Music", "EA", "Activision", "Nintendo", "Marvel", "DC"
  ],
  "Toys & Games": [
    "LEGO", "Hasbro", "Mattel", "Fisher-Price", "Melissa & Doug", "Playmobil", "Nerf", "Barbie", 
    "Hot Wheels", "Disney", "Nintendo", "Ravensburger", "Crayola", "Funko", "American Girl", "Vtech", "Little Tikes"
  ]
};

// Product name templates for each subcategory
const productTemplates = {
  // Electronics
  "Smartphones": [
    "[BRAND] [MODEL] Smartphone", "[BRAND] [MODEL] Pro", "[BRAND] [MODEL] Ultra", 
    "[BRAND] [MODEL] Lite", "[BRAND] [MODEL] Plus", "[BRAND] [MODEL] Max"
  ],
  "Laptops": [
    "[BRAND] [MODEL] Laptop", "[BRAND] [MODEL] Notebook", "[BRAND] [MODEL] Pro", 
    "[BRAND] [MODEL] Ultrabook", "[BRAND] [MODEL] Gaming Laptop", "[BRAND] [MODEL] 2-in-1"
  ],
  "Tablets": [
    "[BRAND] [MODEL] Tablet", "[BRAND] [MODEL] Pad", "[BRAND] [MODEL] Tab", 
    "[BRAND] [MODEL] Pro Tablet", "[BRAND] [MODEL] Mini Tablet", "[BRAND] [MODEL] Plus Tablet"
  ],
  "Smartwatches": [
    "[BRAND] [MODEL] Smartwatch", "[BRAND] [MODEL] Watch", "[BRAND] [MODEL] Fitness Watch", 
    "[BRAND] [MODEL] Sport Watch", "[BRAND] [MODEL] GPS Watch", "[BRAND] [MODEL] Health Monitor"
  ],
  "Headphones": [
    "[BRAND] [MODEL] Headphones", "[BRAND] [MODEL] Earbuds", "[BRAND] [MODEL] Wireless Headphones", 
    "[BRAND] [MODEL] Noise-Cancelling Headphones", "[BRAND] [MODEL] Gaming Headset", "[BRAND] [MODEL] True Wireless Earbuds"
  ],
  
  // Fashion templates
  "Men's Clothing": [
    "[BRAND] Men's [TYPE] Shirt", "[BRAND] Men's [TYPE] Pants", "[BRAND] Men's [TYPE] Jacket", 
    "[BRAND] Men's [TYPE] Sweater", "[BRAND] Men's [TYPE] Hoodie", "[BRAND] Men's [TYPE] Suit"
  ],
  "Women's Clothing": [
    "[BRAND] Women's [TYPE] Dress", "[BRAND] Women's [TYPE] Blouse", "[BRAND] Women's [TYPE] Pants", 
    "[BRAND] Women's [TYPE] Skirt", "[BRAND] Women's [TYPE] Jacket", "[BRAND] Women's [TYPE] Sweater"
  ],
  
  // Home & Kitchen templates
  "Furniture": [
    "[BRAND] [TYPE] Sofa", "[BRAND] [TYPE] Chair", "[BRAND] [TYPE] Table", 
    "[BRAND] [TYPE] Bed", "[BRAND] [TYPE] Desk", "[BRAND] [TYPE] Bookshelf"
  ],
  "Kitchen Appliances": [
    "[BRAND] [TYPE] Blender", "[BRAND] [TYPE] Coffee Maker", "[BRAND] [TYPE] Toaster", 
    "[BRAND] [TYPE] Microwave", "[BRAND] [TYPE] Food Processor", "[BRAND] [TYPE] Air Fryer"
  ],
  
  // Add more templates for other subcategories as needed
};

// Description templates
const descriptionTemplates = {
  "Smartphones": [
    "Premium smartphone with advanced camera system and powerful processor",
    "Feature-packed smartphone with stunning display and all-day battery life",
    "High-performance smartphone with cutting-edge technology and sleek design",
    "Flagship smartphone with professional-grade camera and lightning-fast processor",
    "Revolutionary smartphone with innovative features and exceptional build quality"
  ],
  "Laptops": [
    "Powerful laptop for productivity and entertainment with stunning display",
    "Ultra-thin and lightweight laptop with all-day battery life",
    "High-performance laptop for demanding tasks and creative professionals",
    "Versatile laptop with touchscreen display and convertible design",
    "Premium laptop with exceptional build quality and immersive audio"
  ],
  // Add more for other subcategories
};

// Generate a random product ID
function generateProductId(category, index) {
  const categoryPrefix = category.charAt(0).toUpperCase();
  return `${categoryPrefix}${String(index).padStart(4, '0')}`;
}

// Generate a random price within a range
function generatePrice(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Generate a random rating between 3.0 and 5.0
function generateRating() {
  return parseFloat((Math.random() * 2 + 3).toFixed(1));
}

// Generate stock status (mostly in stock, some limited or out of stock)
function generateStockStatus() {
  const rand = Math.random();
  if (rand > 0.9) return "Out of Stock";
  if (rand > 0.8) return "Limited Stock";
  return "In Stock";
}

// Generate specifications based on subcategory
function generateSpecifications(subcategory) {
  const specs = {};
  
  switch (subcategory) {
    case "Smartphones":
      specs.processor = ["Snapdragon 8", "A15 Bionic", "Exynos 2200", "Dimensity 9000", "Google Tensor"][Math.floor(Math.random() * 5)];
      specs.storage = [`${[64, 128, 256, 512][Math.floor(Math.random() * 4)]}GB`];
      specs.display = [`${(Math.random() * 1.5 + 5.5).toFixed(1)}-inch ${["AMOLED", "Super Retina XDR", "Dynamic AMOLED", "OLED", "LCD"][Math.floor(Math.random() * 5)]}`];
      specs.camera = [`${[12, 16, 48, 50, 64, 108][Math.floor(Math.random() * 6)]}MP ${["triple", "quad", "dual", "main"][Math.floor(Math.random() * 4)]} camera`];
      break;
    case "Laptops":
      specs.processor = [`${["Intel Core i5", "Intel Core i7", "Intel Core i9", "AMD Ryzen 5", "AMD Ryzen 7", "Apple M1", "Apple M2"][Math.floor(Math.random() * 7)]}`];
      specs.memory = [`${[8, 16, 32][Math.floor(Math.random() * 3)]}GB RAM`];
      specs.storage = [`${[256, 512, 1024, 2048][Math.floor(Math.random() * 4)]}GB SSD`];
      specs.display = [`${[13.3, 14, 15.6, 16][Math.floor(Math.random() * 4)]}-inch ${["IPS", "OLED", "Retina", "4K"][Math.floor(Math.random() * 4)]}`];
      break;
    // Add more cases for other subcategories
    default:
      // Generic specifications for other subcategories
      specs.material = ["Premium", "Standard", "Deluxe", "Basic", "Professional"][Math.floor(Math.random() * 5)];
      specs.dimensions = `${Math.floor(Math.random() * 30 + 10)}" x ${Math.floor(Math.random() * 20 + 5)}" x ${Math.floor(Math.random() * 10 + 1)}"`;
      specs.weight = `${(Math.random() * 5 + 0.5).toFixed(1)} lbs`;
  }
  
  return specs;
}

// Generate variants based on subcategory
function generateVariants(subcategory) {
  const variants = [];
  let variantType = "color";
  let variantOptions = ["Black", "White", "Silver", "Gold", "Blue", "Red"];
  
  // Customize variant type and options based on subcategory
  switch (subcategory) {
    case "Smartphones":
    case "Tablets":
      variantType = "color";
      variantOptions = ["Black", "White", "Silver", "Gold", "Blue", "Red", "Green", "Purple"];
      break;
    case "Men's Clothing":
    case "Women's Clothing":
      variantType = "size";
      variantOptions = ["XS", "S", "M", "L", "XL", "XXL"];
      break;
    case "Shoes":
      variantType = "size";
      variantOptions = ["6", "7", "8", "9", "10", "11", "12"];
      break;
    // Add more cases as needed
  }
  
  // Generate 2-5 variants
  const numVariants = Math.floor(Math.random() * 4) + 2;
  const selectedOptions = [];
  
  for (let i = 0; i < numVariants; i++) {
    const option = variantOptions[Math.floor(Math.random() * variantOptions.length)];
    if (!selectedOptions.includes(option)) {
      selectedOptions.push(option);
      const variant = {};
      variant[variantType] = option;
      variant.inStock = Math.random() > 0.2; // 80% chance of being in stock
      variants.push(variant);
    }
  }
  
  return variants;
}

// Generate a product
function generateProduct(category, subcategory, index) {
  const categoryBrands = brands[category] || brands["Electronics"];
  const brand = categoryBrands[Math.floor(Math.random() * categoryBrands.length)];
  
  // Get templates for this subcategory or use generic ones
  const templates = productTemplates[subcategory] || [
    "[BRAND] [MODEL] [TYPE]", 
    "[BRAND] Premium [TYPE]", 
    "[BRAND] Professional [TYPE]", 
    "[BRAND] Classic [TYPE]"
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  const model = ["X", "Pro", "Elite", "Max", "Ultra", "Plus", "Premium", "Classic"][Math.floor(Math.random() * 8)] + 
               Math.floor(Math.random() * 100);
  const type = subcategory.includes(" ") ? subcategory.split(" ")[1] : subcategory;
  
  let productName = template
    .replace("[BRAND]", brand)
    .replace("[MODEL]", model)
    .replace("[TYPE]", type);
  
  // Get description templates for this subcategory or use generic ones
  const descTemplates = descriptionTemplates[subcategory] || [
    `High-quality ${subcategory.toLowerCase()} with premium features`,
    `Professional-grade ${subcategory.toLowerCase()} for everyday use`,
    `Reliable and durable ${subcategory.toLowerCase()} with excellent performance`,
    `Feature-rich ${subcategory.toLowerCase()} with modern design`,
    `Affordable ${subcategory.toLowerCase()} with great value for money`
  ];
  
  const description = descTemplates[Math.floor(Math.random() * descTemplates.length)];
  
  // Price ranges by category
  const priceRanges = {
    "Electronics": [199.99, 1999.99],
    "Fashion": [19.99, 299.99],
    "Home & Kitchen": [29.99, 899.99],
    "Beauty": [9.99, 199.99],
    "Sports & Outdoors": [19.99, 499.99],
    "Books & Media": [7.99, 99.99],
    "Toys & Games": [9.99, 199.99]
  };
  
  const [minPrice, maxPrice] = priceRanges[category] || [19.99, 499.99];
  
  return {
    category,
    subcategory,
    productId: generateProductId(category, index),
    productName,
    description,
    price: generatePrice(minPrice, maxPrice),
    rating: generateRating(),
    stockStatus: generateStockStatus(),
    imageUrl: `https://placehold.co/300x300/e9ecef/00000?text=${encodeURIComponent(productName.replace(/ /g, '+'))}`,
    specifications: generateSpecifications(subcategory),
    variants: generateVariants(subcategory)
  };
}

// Generate 10,000 products
function generateProducts(count) {
  const products = [];
  let index = 1;
  
  // Calculate how many products per category
  const categoryCount = Object.keys(categories).length;
  const productsPerCategory = Math.floor(count / categoryCount);
  
  for (const [category, subcategories] of Object.entries(categories)) {
    const productsPerSubcategory = Math.floor(productsPerCategory / subcategories.length);
    
    for (const subcategory of subcategories) {
      for (let i = 0; i < productsPerSubcategory; i++) {
        if (products.length < count) {
          products.push(generateProduct(category, subcategory, index++));
        }
      }
    }
    
    // Add any remaining products to fill up to the count
    while (products.length < count && 
           products.filter(p => p.category === category).length < productsPerCategory) {
      const randomSubcategory = subcategories[Math.floor(Math.random() * subcategories.length)];
      products.push(generateProduct(category, randomSubcategory, index++));
    }
  }
  
  // If we still haven't reached the count, add random products
  while (products.length < count) {
    const randomCategory = Object.keys(categories)[Math.floor(Math.random() * categoryCount)];
    const randomSubcategories = categories[randomCategory];
    const randomSubcategory = randomSubcategories[Math.floor(Math.random() * randomSubcategories.length)];
    products.push(generateProduct(randomCategory, randomSubcategory, index++));
  }
  
  return products;
}

// Generate 10,000 products
const products = generateProducts(10000);

// Save to file
const fs = require('fs');
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

console.log(`Successfully generated ${products.length} products and saved to products.json`);