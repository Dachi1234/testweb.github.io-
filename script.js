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
  
  // Extract product names for autocomplete
  const productNames = products.map(product => product.name);
  
  // Hamburger Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const dropdownLink = document.querySelector('.nav-links .dropdown > a');
  const dropdownMenu = document.querySelector('.nav-links .dropdown-menu');
  
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
  
  // Auto-complete Search Bar
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      searchResults.innerHTML = '';
      if (query) {
        const matches = productNames.filter(product =>
          product.toLowerCase().includes(query)
        );
        if (matches.length > 0) {
          matches.forEach(match => {
            const div = document.createElement('div');
            div.textContent = match;
            div.addEventListener('click', () => {
              searchInput.value = match;
              searchResults.innerHTML = '';
              searchResults.style.display = 'none';
              // Optionally redirect to the product page
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
      if (
        !searchInput.contains(e.target) &&
        !searchResults.contains(e.target)
      ) {
        searchResults.style.display = 'none';
      }
    });
  }
  
  // Advanced Product Filtering
  
  // Check if we are on the category page
  if (document.getElementById('productsGrid')) {
    // Get DOM elements
    const productsGrid = document.getElementById('productsGrid');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const brandFilters = document.querySelectorAll('input[name="brand"]');
    const colorFilters = document.querySelectorAll('input[name="color"]');
  
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
  
  // User Reviews and Ratings
  
  // Check if we are on the product page
  if (document.getElementById('productName')) {
    // Get product ID from URL (simple parsing)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')) || 1; // Default to 1 if no ID
  
    // Find the product
    const product = products.find(p => p.id === productId);
  
    // Display product details
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productDescription').textContent = `Description for ${product.name}`;
    document.getElementById('productImage').src = product.image;
  
    // Mock reviews data
    let reviews = [
      {
        name: 'John Doe',
        rating: 5,
        text: 'Great product! Highly recommend.',
      },
      {
        name: 'Jane Smith',
        rating: 4,
        text: 'Good quality, but a bit expensive.',
      },
    ];
  
    // Function to display reviews
    function displayReviews() {
      const reviewsContainer = document.getElementById('reviewsContainer');
      reviewsContainer.innerHTML = '';
  
      if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
        return;
      }
  
      reviews.forEach(review => {
        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review');
  
        const stars =
          '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  
        reviewDiv.innerHTML = `
          <p class="reviewer-name">${review.name}</p>
          <p class="review-rating">${stars}</p>
          <p class="review-text">${review.text}</p>
        `;
  
        reviewsContainer.appendChild(reviewDiv);
      });
    }
  
    // Handle form submission
    const reviewForm = document.getElementById('reviewForm');
  
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const name = document.getElementById('reviewerName').value;
      const rating = parseInt(
        document.getElementById('reviewRating').value
      );
      const text = document.getElementById('reviewText').value;
  
      // Add new review to the array
      reviews.unshift({
        name: name,
        rating: rating,
        text: text,
      });
  
      // Reset the form
      reviewForm.reset();
  
      // Update the reviews display
      displayReviews();
    });
  
    // Initial display of reviews
    displayReviews();
  }
  
// ... Existing code ...

// Dashboard Page Functionality

// Sample User Data (Replace with actual user data as needed)
let currentUser = {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@example.com',
    loyaltyPoints: 120,
  };
  
  // Check if we are on the dashboard page
  if (document.querySelector('.dashboard-section')) {
    // Elements
    const userNameSpan = document.getElementById('userName');
    const loyaltyPointsSpan = document.getElementById('loyaltyPoints');
    const progressFill = document.getElementById('progressFill');
    const userLevelSpan = document.getElementById('userLevel');
    const redeemButton = document.getElementById('redeemButton');
  
    // Update User Info
    userNameSpan.textContent = currentUser.firstName;
    loyaltyPointsSpan.textContent = currentUser.loyaltyPoints;
  
    // Maximum points for next level (can adjust as needed)
    const maxPoints = 1000;
  
    // Update the dashboard display
    function updateDashboard() {
      loyaltyPointsSpan.textContent = currentUser.loyaltyPoints;
      const progressPercentage = (currentUser.loyaltyPoints % 250) / 250 * 100;
      progressFill.style.width = `${progressPercentage}%`;
      userLevelSpan.textContent = getUserLevel(currentUser.loyaltyPoints);
    }
  
    // Determine User Level based on loyalty points
    function getUserLevel(points) {
      if (points >= 1000) return 'Platinum';
      if (points >= 500) return 'Gold';
      if (points >= 250) return 'Silver';
      return 'Bronze';
    }
  
    // Initial dashboard update
    updateDashboard();
  
    // Function to simulate earning points after a purchase
    function earnPoints(purchaseAmount) {
      const pointsEarned = Math.floor(purchaseAmount);
      currentUser.loyaltyPoints += pointsEarned;
  
      updateDashboard();
  
      alert(`You earned ${pointsEarned} loyalty points!`);
    }
  
    // Redeem Points Functionality
    redeemButton.addEventListener('click', () => {
      const pointsToRedeem = 100; // Set the number of points required to redeem
      if (currentUser.loyaltyPoints >= pointsToRedeem) {
        currentUser.loyaltyPoints -= pointsToRedeem;
        alert(`You have redeemed ${pointsToRedeem} points for a discount!`);
        updateDashboard();
      } else {
        alert('You need at least 100 points to redeem.');
      }
    });
  
    // Expose functions to global scope if needed
    window.earnPoints = earnPoints;
  }
  
  // ... Existing code ...
  

// Check if we are on the register page
if (document.getElementById('registerForm')) {
    const registerForm = document.getElementById('registerForm');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
  
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      validateForm();
    });
  
    // Real-time validation
    firstName.addEventListener('input', validateFirstName);
    lastName.addEventListener('input', validateLastName);
    email.addEventListener('input', validateEmail);
    password.addEventListener('input', validatePassword);
    confirmPassword.addEventListener('input', validateConfirmPassword);
  
    function validateForm() {
      let isValid = true;
  
      if (!validateFirstName()) isValid = false;
      if (!validateLastName()) isValid = false;
      if (!validateEmail()) isValid = false;
      if (!validatePassword()) isValid = false;
      if (!validateConfirmPassword()) isValid = false;
  
      if (isValid) {
        // Submit the form or perform further actions
        alert('Registration successful!');
        registerForm.reset();
      }
    }
  
    function validateFirstName() {
      if (firstName.value.trim() === '') {
        showError(firstName, 'First name is required.');
        return false;
      } else {
        showSuccess(firstName);
        return true;
      }
    }
  
    function validateLastName() {
      if (lastName.value.trim() === '') {
        showError(lastName, 'Last name is required.');
        return false;
      } else {
        showSuccess(lastName);
        return true;
      }
    }
  
    function validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value.trim() === '') {
        showError(email, 'Email is required.');
        return false;
      } else if (!emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email.');
        return false;
      } else {
        showSuccess(email);
        return true;
      }
    }
  
    function validatePassword() {
      if (password.value.trim() === '') {
        showError(password, 'Password is required.');
        return false;
      } else if (password.value.trim().length < 6) {
        showError(password, 'Password must be at least 6 characters.');
        return false;
      } else {
        showSuccess(password);
        return true;
      }
    }
  
    function validateConfirmPassword() {
      if (confirmPassword.value.trim() === '') {
        showError(confirmPassword, 'Please confirm your password.');
        return false;
      } else if (confirmPassword.value.trim() !== password.value.trim()) {
        showError(confirmPassword, 'Passwords do not match.');
        return false;
      } else {
        showSuccess(confirmPassword);
        return true;
      }
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
  