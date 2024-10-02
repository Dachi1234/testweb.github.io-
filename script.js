// Global variables
let products = [];
let productNames = [];

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

// Fetch products from the backend API
async function fetchProducts() {
  try {
    const response = await fetch('https://testweb-github-io.onrender.com/products');
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
        <a href="product.html?id=${product._id}" class="btn">View Details</a>
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
        <a href="product.html?id=${product._id}" class="btn">View Details</a>
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
                window.location.href = `product.html?id=${matchedProduct._id}`;
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

// Initialize Category Page Functionality
function initializeCategoryPage() {
  if (document.getElementById('productsGrid')) {
    const productsGrid = document.getElementById('productsGrid');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const brandFilters = document.querySelectorAll('input[name="brand"]');
    const colorFilters = document.querySelectorAll('input[name="color"]');

    let filteredProducts = products;
    displayProducts(filteredProducts);

    priceRange.addEventListener('input', () => {
      priceValue.textContent = `$0 - $${priceRange.value}`;
      applyFilters();
    });

    brandFilters.forEach(filter => filter.addEventListener('change', applyFilters));
    colorFilters.forEach(filter => filter.addEventListener('change', applyFilters));

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
          (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
          (selectedColors.length === 0 || selectedColors.includes(product.color)) &&
          product.price <= maxPrice
        );
      });

      displayProducts(filteredProducts);
    }
  }
}


// Initialize Product Page Functionality
function initializeProductPage() {
  if (document.getElementById('productName')) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products.find(p => p._id === productId);

    if (product) {
      document.getElementById('productName').textContent = product.name;
      document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
      document.getElementById('productDescription').textContent = product.description || 'No description available.';
      document.getElementById('productImage').src = product.image || 'placeholder.jpg';
    }

    let reviews = [
      { name: 'John Doe', rating: 5, text: 'Great product! Highly recommend.' },
      { name: 'Jane Smith', rating: 4, text: 'Good quality, but a bit expensive.' },
    ];

    function displayReviews() {
      const reviewsContainer = document.getElementById('reviewsContainer');
      reviewsContainer.innerHTML = reviews.length === 0 ? '<p>No reviews yet.</p>' : '';

      reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        reviewDiv.innerHTML = `
          <p class="reviewer-name">${review.name}</p>
          <p class="review-rating">${stars}</p>
          <p class="review-text">${review.text}</p>
        `;
        reviewsContainer.appendChild(reviewDiv);
      });
    }

    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('reviewerName').value;
      const rating = parseInt(document.getElementById('reviewRating').value);
      const text = document.getElementById('reviewText').value;
      reviews.unshift({ name, rating, text });
      reviewForm.reset();
      displayReviews();
    });

    displayReviews();
  }
}

// Dashboard Page Functionality
let currentUser = {
  firstName: 'Alice',
  lastName: 'Johnson',
  email: 'alice@example.com',
  loyaltyPoints: 120,
};

if (document.querySelector('.dashboard-section')) {
  const userNameSpan = document.getElementById('userName');
  const loyaltyPointsSpan = document.getElementById('loyaltyPoints');
  const progressFill = document.getElementById('progressFill');
  const userLevelSpan = document.getElementById('userLevel');
  const redeemButton = document.getElementById('redeemButton');

  userNameSpan.textContent = currentUser.firstName;
  loyaltyPointsSpan.textContent = currentUser.loyaltyPoints;

  function updateDashboard() {
    loyaltyPointsSpan.textContent = currentUser.loyaltyPoints;
    const progressPercentage = (currentUser.loyaltyPoints % 250) / 250 * 100;
    progressFill.style.width = `${progressPercentage}%`;
    userLevelSpan.textContent = getUserLevel(currentUser.loyaltyPoints);
  }

  function getUserLevel(points) {
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 250) return 'Silver';
    return 'Bronze';
  }

  updateDashboard();

  redeemButton.addEventListener('click', () => {
    const pointsToRedeem = 100;
    if (currentUser.loyaltyPoints >= pointsToRedeem) {
      currentUser.loyaltyPoints -= pointsToRedeem;
      alert(`You have redeemed ${pointsToRedeem} points for a discount!`);
      updateDashboard();
    } else {
      alert('You need at least 100 points to redeem.');
    }
  });
}

// Registration Form Validation
if (document.getElementById('registerForm')) {
  const registerForm = document.getElementById('registerForm');
  const formInputs = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword')
  };

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Registration successful!');
      registerForm.reset();
    }
  });

  Object.values(formInputs).forEach(input => {
    input.addEventListener('input', () => validateInput(input));
  });

  function validateForm() {
    return Object.values(formInputs).every(validateInput);
  }


// ... (continued from previous part)

  function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';

    switch (input.id) {
      case 'firstName':
      case 'lastName':
        isValid = value !== '';
        errorMessage = `${input.id === 'firstName' ? 'First' : 'Last'} name is required.`;
        break;
      case 'email':
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        errorMessage = 'Please enter a valid email address.';
        break;
      case 'password':
        isValid = value.length >= 6;
        errorMessage = 'Password must be at least 6 characters long.';
        break;
      case 'confirmPassword':
        isValid = value === formInputs.password.value;
        errorMessage = 'Passwords do not match.';
        break;
    }

    if (isValid) {
      showSuccess(input);
    } else {
      showError(input, errorMessage);
    }

    return isValid;
  }

  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    input.classList.add('error');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
  }

  function showSuccess(input) {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    input.classList.remove('error');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }
}

// Initialize the page
window.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  
  // Additional initializations can be added here
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

// You can add any additional global functions or initializations here

// Example of a utility function that could be useful across the site
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Example of a function to handle API errors
function handleApiError(error) {
  console.error('API Error:', error);
  // You could add more sophisticated error handling here, such as displaying a message to the user
  alert('An error occurred. Please try again later.');
}


// script.js

// ... existing code ...

// Registration Form Handling
if (document.getElementById('registrationForm')) {
  document.getElementById('registrationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!name || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Send registration data to the backend
      const response = await fetch('/register', { // Relative path since frontend and backend are served together
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration. Please try again later.');
    }
  });
}

// script.js

// ... existing code ...

// Login Form Handling
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Send login data to the backend
      const response = await fetch('/login', { // Relative path since frontend and backend are served together
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        // Store user data in localStorage
        localStorage.setItem('userId', data.userId);
        // Redirect to dashboard or home page
        window.location.href = 'dashboard.html';
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during login. Please try again later.');
    }
  });
}

