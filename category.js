let products = []; // This will hold the fetched products
let filteredProducts = []; // This will hold the filtered products

// Set the backend base URL
const API_BASE_URL = 'https://testweb-github-io.onrender.com';

if (document.getElementById('productsGrid')) {
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
      const urlParams = new URLSearchParams(window.location.search);
      const category = urlParams.get('category') || 'All';

      // Use the absolute URL for fetching products
      const response = await fetch(`${API_BASE_URL}/products?category=${encodeURIComponent(category)}`);
      products = await response.json();

      filteredProducts = products; // Initially display all fetched products
      displayProducts(filteredProducts);
      generateFilterOptions();

      const categoryTitle = document.getElementById('categoryTitle');
      if (categoryTitle) {
        categoryTitle.textContent = category;
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      productsGrid.innerHTML = '<p>Error fetching products. Please try again later.</p>';
    }
  }

  function generateFilterOptions() {
    const brands = [...new Set(products.map(product => product.brand).filter(brand => brand))];
    const colors = [...new Set(products.map(product => product.color).filter(color => color))];

    console.log('Brands:', brands);
    console.log('Colors:', colors);

    const brandFilterContainer = document.getElementById('brandFilters');
    brandFilterContainer.innerHTML = '';
    brands.forEach(brand => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'brand';
      checkbox.value = brand;
      checkbox.addEventListener('change', applyFilters);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${brand}`));
      brandFilterContainer.appendChild(label);
    });

    const colorFilterContainer = document.getElementById('colorFilters');
    colorFilterContainer.innerHTML = '';
    colors.forEach(color => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'color';
      checkbox.value = color;
      checkbox.addEventListener('change', applyFilters);
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${color}`));
      colorFilterContainer.appendChild(label);
    });
  }

  priceRange.addEventListener('input', () => {
    priceValue.textContent = `$0 - $${priceRange.value}`;
    applyFilters();
  });

  clearFiltersButton.addEventListener('click', () => {
    priceRange.value = priceRange.max;
    priceValue.textContent = `$0 - $${priceRange.value}`;

    const brandCheckboxes = document.querySelectorAll('input[name="brand"]');
    brandCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    const colorCheckboxes = document.querySelectorAll('input[name="color"]');
    colorCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    applyFilters();
  });

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
        <a href="product.html?productId=${product._id}" class="btn">View Details</a>
      `;

      productsGrid.appendChild(productCard);
    });
  }
}
