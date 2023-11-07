// Function to handle form submission
async function handleFormSubmission(event) {
  event.preventDefault();
  const form = document.getElementById('login-form');
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  // const BASE_URL = 'http://3.91.236.101:3001'| 'http://localhost:3001';
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json()
    console.log(responseData);
    if (response.ok) {
      const token = responseData.token;

      localStorage.setItem('zpt', token);
      window.location.href = 'books.html';
    } else if (responseData === false && responseData === 'User not found'){
        alert("User Not Found. Invalid Email");
    } else {
      console.error('Error:', response.statusText);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Add event listener to the form submit button
const loginForm = document.getElementById('login-button');
loginForm.addEventListener('click', (event) => {
    event.preventDefault();
    handleFormSubmission(event);
});

// Check if user is logged in and show books link
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('zpt');
  if (token) {
    document.getElementById('books-nav').style.display = 'block';
  }
});
