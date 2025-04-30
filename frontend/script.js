// Open Ask Question Modal
function openAskModal() {
  document.getElementById('askModal').style.display = 'block';
}

// Close Ask Question Modal
function closeAskModal() {
  document.getElementById('askModal').style.display = 'none';
}

// Submit Question to API
function submitQuestion() {
  const question = document.getElementById('questionText').value.trim();

  if (question === '') {
    alert('Please type a question!');
    return;
  }

  // fetch method
  fetch('http://localhost:3000/api/ask-question', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      title: question, 
      content: question
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Question submitted successfully!');
      closeAskModal();
      document.getElementById('questionText').value = '';
    } else {
      alert('Failed to submit question.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Something went wrong. Please try again later.');
  });
}

// Login Form Validation + API
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (username === '' || password === '') {
      alert('Please fill in all fields!');
      return;
    }

    // Send Login Data to API
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({    , password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Login Successful!');
        window.location.href = "index.html";
      } else {
        alert(data.message || 'Login failed!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    });
  });
}

// Signup Form Validation + API
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', function(e) {
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

    // Send Signup Data to API
    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Signup Successful!');
        window.location.href = "login.html";
      } else {
        alert(data.message || 'Signup failed!');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    });
  });
}

// Validate Email Format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
