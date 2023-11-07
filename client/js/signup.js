async function handleFormSubmission(event) {
  event.preventDefault();
  const form = document.getElementById('register-form');
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  try {
    const response = await fetch('http://3.91.236.101:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    if (response.ok && responseData.status === true, responseData.message === 'User created successfully') {
      alert('User created successfully');
      setTimeout(() => {
        window.location.reload();
        window.location.href = 'index.html';
      }, 2000);
    } else if (responseData.status === false && responseData.message === 'User already exists, do log in') {
      alert('User already exists');
    } else {
      console.error('Error:', responseData.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Add event listener to the form submit button
const registerForm = document.getElementById('register-button');
registerForm.addEventListener('click', (event) => {
    event.preventDefault();
    handleFormSubmission(event);
});
