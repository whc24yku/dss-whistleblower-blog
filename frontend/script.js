// Open Ask Question Modal
function openAskModal() {
  document.getElementById('askModal').style.display = 'block';
}

// Close Ask Question Modal
function closeAskModal() {
  document.getElementById('askModal').style.display = 'none';
}

// Submit Question to API with token
function submitQuestion() {
  const question = document.getElementById('questionText').value.trim();
  const token = localStorage.getItem('token');

  if (question === '') {
    alert('Please type a question!');
    return;
  }

  if (!token) {
    alert('You must be logged in to ask a question.');
    return;
  }

  fetch('http://localhost:3000/api/questions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: question,
      content: question
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success' || data.message === 'Question added') {
        alert('Question submitted successfully!');
        closeAskModal();
        document.getElementById('questionText').value = '';
        loadQuestions();
      } else {
        alert(data.error || 'Failed to submit question.');
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

// Signup Form Validation + API
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

// Validate Email Format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Logout helper
function logout() {
  localStorage.removeItem('token');
  alert('You have been logged out.');
  window.location.href = "login.html";
}

// Check if user is logged in and update the UI accordingly
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const logoutButton = document.getElementById('logoutButton');
  const signupLink = document.getElementById('signupLink');
  const loginLink = document.getElementById('loginLink');
  const commentButtonContainer = document.getElementById('commentButtonContainer');

  if (token) {
    logoutButton.style.display = 'block';
    signupLink.style.display = 'none';
    loginLink.style.display = 'none';
    if (commentButtonContainer) commentButtonContainer.style.display = 'block';
    loadQuestions();
  } else {
    logoutButton.style.display = 'none';
    signupLink.style.display = 'inline';
    loginLink.style.display = 'inline';
    if (commentButtonContainer) commentButtonContainer.style.display = 'none';
  }
});

// Load and display questions
function loadQuestions() {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost:3000/api/questions', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(response => {
      const container = document.getElementById('questionsContainer');
      container.innerHTML = ''; // Clear existing

      const questions = Array.isArray(response)
        ? response
        : Array.isArray(response.data)
        ? response.data
        : [];

      if (questions.length > 0) {
        questions.forEach(q => {
          const div = document.createElement('div');
          div.className = 'question-item';
          div.innerHTML = `<strong>${q.title}</strong><p>${q.content}</p>`;
          container.appendChild(div);
        });
      } else {
        container.innerHTML = '<p>No questions found.</p>';
      }
    })
    .catch(err => {
      console.error('Error loading questions:', err);
      document.getElementById('questionsContainer').innerHTML = '<p>Failed to load questions.</p>';
    });
}
