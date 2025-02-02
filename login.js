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
      // Send login data to the backend using a relative URL
      const response = await fetch('/login', {
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
