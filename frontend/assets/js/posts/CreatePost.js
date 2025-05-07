// Add this to the top of your script to confirm if it's loaded
console.log("CreatePost.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    // Get the DOM elements
    const postButton = document.getElementById('submitPost');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');

    // Function to create a new post
    async function createPost() {
        // Get input values and trim extra spaces
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        // Check if title and content are provided
        if (!title || !content) {
            alert("Both title and content are required.");
            return;
        }

        // Get JWT token from localStorage
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            alert("You need to be logged in to post.");
            return;
        }

        // Prepare data to send in the request
        const postData = {
            title: title,
            content: content
        };

        try {
            // Make the POST request to create a post
            const response = await fetch('http://localhost:3000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            // Parse the response
            const data = await response.json();

            // Check if the response was successful
            if (response.ok && data.status === "success") {
                alert("Post created successfully!");
                window.location.href = '/'; // Redirect to the home page (or wherever you want)
            } else {
                alert(data.error || "Failed to create post.");
            }
        } catch (err) {
            // Catch any errors
            console.error("Error creating post:", err);
            alert("An error occurred while creating the post.");
        }
    }

    // Event listener for the post button click
    postButton.addEventListener('click', createPost);
});
