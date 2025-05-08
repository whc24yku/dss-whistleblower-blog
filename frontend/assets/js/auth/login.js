const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const identifier = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (identifier === '' || password === '') {
      alert('Please fill in all fields!');
      return;
    }

    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success' && data.token) {
          localStorage.setItem('token', data.token);
          alert('Login Successful!');
          window.location.href = "index.html";
        } else {
          alert(data.error || 'Login failed!');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again later.');
      });
  });
}
