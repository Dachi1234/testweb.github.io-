// Category Page JavaScript

// Sample Product Data
const products = [
    {
      id: 1,
      name: 'Stylish Sunglasses',
      category: 'Accessories',
      size: null,
      color: 'Black',
      price: 49.99,
      brand: 'Brand A',
      image: 'hero1.jpg',
    },
    {
      id: 2,
      name: 'Leather Backpack',
      category: 'Accessories',
      size: null,
      color: 'Brown',
      price: 89.99,
      brand: 'Brand B',
      image: 'hero1.jpg',
    },
    {
      id: 3,
      name: 'Wireless Headphones',
      category: 'Electronics',
      size: null,
      color: 'White',
      price: 129.99,
      brand: 'Brand C',
      image: 'hero1.jpg',
    },
    {
      id: 4,
      name: 'Smart Watch',
      category: 'Electronics',
      size: null,
      color: 'Black',
      price: 199.99,
      brand: 'Brand A',
      image: 'hero1.jpg',
    },
    // Add more products if needed
  ];
  
  // Check if we are on the category page
  if (document.getElementById('productsGrid')) {
    // Get DOM elements
    const productsGrid = document.getElementById('productsGrid');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const brandFilters = document.querySelectorAll('input[name="brand"]');
    const colorFilters = document.querySelectorAll('input[name="color"]');
    const filterGroups = document.querySelectorAll('.filter-group');
    const filterToggleButtons = document.querySelectorAll('.filter-header');
    const clearFiltersButton = document.querySelector('.clear-filters');
    const filterSidebar = document.querySelector('.filters');
    const filterToggle = document.querySelector('.filter-toggle');
  
    // Toggle filter content
    filterToggleButtons.forEach(header => {
      header.addEventListener('click', () => {
        const parent = header.parentElement;
        parent.classList.toggle('active');
      });
    });
  
    // Toggle filter sidebar (mobile)
    if (filterToggle) {
      filterToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        filterSidebar.classList.toggle('active');
      });
    }
  
    // Close filter sidebar when clicking outside (mobile)
    document.addEventListener('click', (e) => {
      if (
        window.innerWidth <= 768 &&
        !filterSidebar.contains(e.target) &&
        !filterToggle.contains(e.target)
      ) {
        filterSidebar.classList.remove('active');
      }
    });
  
    // Prevent clicks inside the filter sidebar from closing it
    filterSidebar.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  
    // Display all products initially
    let filteredProducts = products.filter(
      product => product.category === 'Electronics'
    );
    displayProducts(filteredProducts);
  
    // Update price range display
    priceRange.addEventListener('input', () => {
      priceValue.textContent = `$0 - $${priceRange.value}`;
      applyFilters();
    });
  
    // Add event listeners to filters
    brandFilters.forEach(filter => {
      filter.addEventListener('change', applyFilters);
    });
  
    colorFilters.forEach(filter => {
      filter.addEventListener('change', applyFilters);
    });
  
    // Clear filters
    clearFiltersButton.addEventListener('click', () => {
      // Reset price range
      priceRange.value = 500;
      priceValue.textContent = `$0 - $500`;
  
      // Uncheck all brand filters
      brandFilters.forEach(filter => {
        filter.checked = false;
      });
  
      // Uncheck all color filters
      colorFilters.forEach(filter => {
        filter.checked = false;
      });
  
      applyFilters();
    });
  
    // Filter function
    function applyFilters() {
      const selectedBrands = Array.from(brandFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
  
      const selectedColors = Array.from(colorFilters)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
  
      const maxPrice = parseFloat(priceRange.value);
  
      filteredProducts = products.filter(product => {
        return (
          product.category === 'Electronics' &&
          (selectedBrands.length === 0 ||
            selectedBrands.includes(product.brand)) &&
          (selectedColors.length === 0 ||
            selectedColors.includes(product.color)) &&
          product.price <= maxPrice
        );
      });
  
      displayProducts(filteredProducts);
    }
  
    // Function to display products
    function displayProducts(productsToDisplay) {
      productsGrid.innerHTML = '';
  
      if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<p>No products found.</p>';
        return;
      }
  
      productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
  
        productCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price.toFixed(2)}</p>
          <a href="product.html?id=${product.id}" class="btn">View Details</a>
        `;
  
        productsGrid.appendChild(productCard);
      });
    }
  }
  