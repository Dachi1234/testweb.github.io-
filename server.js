// Global variables
let products = [];
let productNames = [];

// Set your backend base URL (hosted on Render.com)
const API_BASE_URL = 'https://testweb-github-io.onrender.com';

// UI Elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const dropdownLink = document.querySelector('.nav-links .dropdown > a');
const dropdownMenu = document.querySelector('.nav-links .dropdown-menu');
const backToTop = document.querySelector('.back-to-top');

// Hamburger Menu Toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}

// Toggle Dropdown on Click (Mobile Devices)
if (dropdownLink) {
  dropdownLink.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdownMenu.classList.toggle('active');
    }
  });
}

// Back to Top Button
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.style.display = window.pageYOffset > 300 ? 'block' : 'none';
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Initialize Swiper for featured products
function initializeSwiper() {
  if (window.productSwiper) {
    window.productSwiper.destroy();
  }
  window.productSwiper = new Swiper('.product-carousel', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      640: { slidesPerView: 2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 4 },
    },
  });
}

// Fetch products from the backend API using the absolute URL
async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    products = data;
    productNames = products.map(product => product.name);

    displayProducts(products);
    displayFeaturedProducts(products);
    initializeSearchBar();
    initializeCategoryPage();
    initializeProductPage();
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

// Function to display all products
function displayProducts(productsToDisplay) {
  const container = document.getElementById('products-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  productsToDisplay.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';
    productDiv.innerHTML = `
      <img src="${product.image || 'placeholder-image.jpg'}" alt="${product.name}" />
      <div class="product-item-content">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <p>${product.description ? product.description.slice(0, 100) + '...' : 'No description available'}</p>
        <a href="product.html?productId=${product._id}" class="btn">View Details</a>
      </div>
    `;
    container.appendChild(productDiv);
  });
}

// Function to display featured products
function displayFeaturedProducts(products) {
  const container = document.getElementById('featured-products-container');
  if (!container) return;

  container.innerHTML = '';
  const featuredProducts = products.slice(0, 8);

  featuredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'swiper-slide product-card';
    productCard.innerHTML = `
      <img src="${product.image || 'placeholder-image.jpg'}" alt="${product.name}">
      <div class="product-card-content">
        <h3>${product.name}</h3>
        <p>${product.description ? product.description.slice(0, 50) + '...' : 'No description available'}</p>
        <div class="price">$${product.price.toFixed(2)}</div>
        <a href="product.html?productId=${product._id}" class="btn">View Details</a>
      </div>
    `;
    container.appendChild(productCard);
  });

  initializeSwiper();
}

// Initialize Search Bar Functionality
function initializeSearchBar() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      searchResults.innerHTML = '';
      if (query) {
        const matches = productNames.filter(name => 
          name.toLowerCase().includes(query)
        );
        if (matches.length > 0) {
          matches.forEach(match => {
            const div = document.createElement('div');
            div.textContent = match;
            div.addEventListener('click', () => {
              searchInput.value = match;
              searchResults.style.display = 'none';
              const matchedProduct = products.find(product => product.name === match);
              if (matchedProduct) {
                window.location.href = `product.html?productId=${matchedProduct._id}`;
              }
            });
            searchResults.appendChild(div);
          });
          searchResults.style.display = 'block';
        } else {
          searchResults.style.display = 'none';
        }
      } else {
        searchResults.style.display = 'none';
      }
    });

    // Hide search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }
}

// Initialize Category Page Functionality (if applicable)
function initializeCategoryPage() {
  if (document.getElementById('productsGrid')) {
    // The category.js file handles its own functionality.
  }
}

// Initialize Product Page Functionality (if applicable)
function initializeProductPage() {
  if (document.getElementById('productName')) {
    // The product details page will load its own details.
  }
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  initializeBackToTopButton();
});

// Back to Top Button Functionality
function initializeBackToTopButton() {
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.style.display = 'block';
      } else {
        backToTop.style.display = 'none';
      }
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Utility Functions
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function handleApiError(error) {
  console.error('API Error:', error);
  alert('An error occurred. Please try again later.');
}
