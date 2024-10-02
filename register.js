// register.js

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
  