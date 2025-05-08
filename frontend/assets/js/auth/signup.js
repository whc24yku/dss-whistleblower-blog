const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if (username === '' || email === '' || password === '') {
      alert('Please fill in all fields!');
      return;
    } else if (!validateEmail(email)) {
      alert('Please enter a valid email address!');
      return;
    }

    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('Signup Successful!');
          window.location.href = "login.html";
        } else {
          alert(data.error || 'Signup failed!');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
      });
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
