// Function to fetch posts from the API
function fetchPosts() {
  console.log('fetchPosts function is being called!');

  // Get the JWT token from localStorage
  const token = localStorage.getItem('token');

  // If no token, alert the user and stop further execution
  if (!token) {
    alert('You need to be logged in to view posts');
    return;
  }

  // Make the API request to fetch posts
  fetch('http://localhost:3000/api/posts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  .then(response => response.json())  // Convert the response to JSON
  .then(data => {
    // Check if the response contains posts
    if (data.status === 'success' && data.posts) {
      displayPosts(data.posts);  // Call displayPosts function to show posts
    } else {
      console.error('Failed to load posts:', data.error || 'No posts found.');
      alert('Failed to load posts. Please try again later.');
    }
  })
  .catch(error => {
    console.error('Error fetching posts:', error);
    alert('Something went wrong. Please try again later.');
  });
}

// Function to display posts in the DOM
function displayPosts(posts) {
  const postsContainer = document.getElementById('postsContainer');  // Get the container element for posts

  // Clear previous posts, if any
  postsContainer.innerHTML = '';

  // Loop through each post and create an HTML element for it
  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');  // Add a class for styling

    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>Posted on ${new Date(post.created_at).toLocaleString()}</small>
    `;

    // Append the post element to the container
    postsContainer.appendChild(postElement);
  });
}

// Call fetchPosts when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  fetchPosts();  // Trigger fetching posts when the page loads
});
