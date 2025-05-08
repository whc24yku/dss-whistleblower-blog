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
  