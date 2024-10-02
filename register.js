document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form values
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  try {
    // Send registration data to the backend
    const response = await fetch('/register', {
      method: 'POST', // Ensure this is 'POST'
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    // Handle the response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please log in.');
        window.location.href = 'login.html';
      } else {
        alert(`Error: ${data.error}`);
      }
    } else {
      // Handle non-JSON response (e.g., HTML error page)
      const text = await response.text();
      console.error('Unexpected response:', text);
      alert('An unexpected error occurred. Please try again later.');
    }
  } catch (error) {
    console.error('Registration Error:', error);
    alert('An error occurred during registration. Please try again later.');
  }
});
