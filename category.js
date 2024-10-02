// category.js

let products = []; // This will hold the fetched products
let filteredProducts = []; // This will hold the filtered products

// Check if we are on the category page
if (document.getElementById('productsGrid')) {
  // Get DOM elements
  const productsGrid = document.getElementById('productsGrid');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
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

  // Fetch products when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
  });

  async function fetchProducts() {
    try {
      // Get the category from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category') || 'All';

      // Fetch products from the backend API
      const response = await fetch(`https://testweb-github-io.onrender.com/products?category=${encodeURIComponent(category)}`);
      products = await response.json();

      // Display the products
      filteredProducts = products; // Initially, all fetched products are displayed
      displayProducts(filteredProducts);

      // Initialize filters after products are fetched
      generateFilterOptions();

      // Update the category title on the page
      const categoryTitle = document.getElementById('categoryTitle');
      if (categoryTitle) {
        categoryTitle.textContent = category;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      productsGrid.innerHTML = '<p>Error fetching products. Please try again later.</p>';
    }
  }

  // Function to generate filter options based on fetched products
  function generateFilterOptions() {
    // Extract unique brands and colors from products
    const brands = [...new Set(products.map(product => product.brand).filter(brand => brand))];
    const colors = [...new Set(products.map(product => product.color).filter(color => color))];

    // Populate brand filters
    const brandFilterContainer = document.getElementById('brandFilters');
    brandFilterContainer.innerHTML = '';
    brands.forEach(brand => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'brand';
      checkbox.value = brand;
      checkbox.addEventListener('change', applyFilters); // Attach event listener
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${brand}`));
      brandFilterContainer.appendChild(label);
    });

    // Populate color filters
    const colorFilterContainer = document.getElementById('colorFilters');
    colorFilterContainer.innerHTML = '';
    colors.forEach(color => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'color';
      checkbox.value = color;
      checkbox.addEventListener('change', applyFilters); // Attach event listener
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${color}`));
      colorFilterContainer.appendChild(label);
    });
  }

  // Update price range display and apply filters
  priceRange.addEventListener('input', () => {
    priceValue.textContent = `$0 - $${priceRange.value}`;
    applyFilters();
  });

  // Clear filters
  clearFiltersButton.addEventListener('click', () => {
    // Reset price range
    priceRange.value = priceRange.max;
    priceValue.textContent = `$0 - $${priceRange.value}`;

    // Uncheck all brand filters
    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    brandCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    // Uncheck all color filters
    const colorCheckboxes = document.querySelectorAll('input[name="color"]');
    colorCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    applyFilters();
  });

  // Filter function
  function applyFilters() {
    const brandFilters = document.querySelectorAll('input[name="brand"]:checked');
    const colorFilters = document.querySelectorAll('input[name="color"]:checked');

    const selectedBrands = Array.from(brandFilters).map(checkbox => checkbox.value);
    const selectedColors = Array.from(colorFilters).map(checkbox => checkbox.value);

    const maxPrice = parseFloat(priceRange.value);

    filteredProducts = products.filter(product => {
      const productBrand = product.brand || '';
      const productColor = product.color || '';

      return (
        (selectedBrands.length === 0 || selectedBrands.includes(productBrand)) &&
        (selectedColors.length === 0 || selectedColors.includes(productColor)) &&
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
        <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <a href="product.html?id=${product._id}" class="btn">View Details</a>
      `;

      productsGrid.appendChild(productCard);
    });
  }
}
