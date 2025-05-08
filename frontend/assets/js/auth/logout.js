function logout() {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    window.location.href = "login.html";
  }
  