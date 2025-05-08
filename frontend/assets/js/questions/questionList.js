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
        container.innerHTML = '';
  
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
  