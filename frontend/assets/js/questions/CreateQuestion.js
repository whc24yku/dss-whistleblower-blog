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
    body: JSON.stringify({ title: question, content: question })
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success' || data.message === 'Question added') {
        alert('Question submitted successfully!');
        closeAskModal();  // Close the modal after submitting
        document.getElementById('questionText').value = ''; // Clear input field
        loadQuestions();  // Reload the questions
      } else {
        alert(data.error || 'Failed to submit question.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    });
}

// Load and display questions
function loadQuestions() {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost:3000/api/questions', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => res.json())
    .then(response => {
      const container = document.getElementById('questionsContainer');
      container.innerHTML = '';  // Clear existing questions

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

// Open Ask Question Modal
function openAskModal() {
  document.getElementById('askModal').style.display = 'block';
}

// Close Ask Question Modal
function closeAskModal() {
  const modal = document.getElementById('askModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Navigate back to home page
function goHome() {
  window.location.href = 'index.html';  // Redirects to home page
}
