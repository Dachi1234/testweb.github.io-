// product.js
document.addEventListener('DOMContentLoaded', function() {
    // Extract the product ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        // No product ID in URL
        alert('No product selected.');
        return;
    }

    // Use your backend URL
    const backendUrl = 'https://testweb-github-io.onrender.com';

    // Fetch product details from the backend
    fetch(`${backendUrl}/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            if (product.error) {
                alert('Product not found.');
                return;
            }

            // Update the page with product details
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-image').src = product.image;
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            alert('Error fetching product details.');
        });
});

