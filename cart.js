// cart.js

function getUserId() {
    return localStorage.getItem('userId');
  }
  
  async function addToCart(productId, quantity = 1) {
    try {
      const userId = getUserId();
      if (!userId) {
        alert('Please log in to add items to your cart.');
        window.location.href = 'login.html';
        return;
      }
  
      const response = await fetch('https://your-backend-url/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ productId, quantity }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Item added to cart');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }
  
  async function loadCart() {
    try {
      const userId = getUserId();
      if (!userId) {
        alert('Please log in to view your cart.');
        window.location.href = 'login.html';
        return;
      }
  
      const response = await fetch('https://your-backend-url/cart', {
        method: 'GET',
        headers: {
          'x-user-id': userId,
        },
      });
  
      const cartItems = await response.json();
      if (response.ok) {
        displayCartItems(cartItems);
      } else {
        alert(`Error: ${cartItems.error}`);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }
  
  function displayCartItems(cartItems) {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';
  
    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
  
    cartItems.forEach((item) => {
      const product = item.productId;
      const cartItemDiv = document.createElement('div');
      cartItemDiv.className = 'cart-item';
      cartItemDiv.innerHTML = `
        <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" />
        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <p>Price: $${product.price.toFixed(2)}</p>
          <p>Quantity: <input type="number" min="1" value="${item.quantity}" data-product-id="${product._id}" class="quantity-input" /></p>
          <p>Total: $${(product.price * item.quantity).toFixed(2)}</p>
          <button class="remove-item-btn" data-product-id="${product._id}">Remove</button>
        </div>
      `;
      cartContainer.appendChild(cartItemDiv);
    });
  
    // Add event listeners for quantity changes and remove buttons
    document.querySelectorAll('.quantity-input').forEach((input) => {
      input.addEventListener('change', updateCartItem);
    });
  
    document.querySelectorAll('.remove-item-btn').forEach((button) => {
      button.addEventListener('click', removeCartItem);
    });
  }
  
  async function updateCartItem(event) {
    const input = event.target;
    const productId = input.dataset.productId;
    const quantity = parseInt(input.value);
  
    if (quantity < 1) {
      alert('Quantity must be at least 1');
      input.value = 1;
      return;
    }
  
    try {
      const userId = getUserId();
      const response = await fetch('https://your-backend-url/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ productId, quantity }),
      });
  
      const data = await response.json();
      if (response.ok) {
        loadCart(); // Reload cart to update totals
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }
  
  async function removeCartItem(event) {
    const button = event.target;
    const productId = button.dataset.productId;
  
    try {
      const userId = getUserId();
      const response = await fetch('https://your-backend-url/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({ productId }),
      });
  
      const data = await response.json();
      if (response.ok) {
        loadCart(); // Reload cart to remove item
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  }
  