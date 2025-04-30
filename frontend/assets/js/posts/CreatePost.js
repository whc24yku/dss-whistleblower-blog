// Select elements
const postButton = document.getElementById('submitPost');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');


async function createPost() {
    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {
        alert("Both title and content are required.");
        return;
    }

    const token = localStorage.getItem('jwt_token');
    if (!token) {
        alert("You need to be logged in to post.");
        return;
    }

    // Prepare post data
    const postData = {
        title: title,
        content: content
    };



    try {
        const response = await fetch('http://localhost:3000/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQ2MDE2MzgwLCJleHAiOjE3NDYwMTk5ODB9.cN8zlEuW8UcjYlfmWNqmneWBcTW8QomVRPQNqkpP3mA'}`
            },
            body: JSON.stringify(postData)
        });

        // Handle response
        if (response.ok) {
            const data = await response.json();
            if (data.status === "success") {
                alert("Post created successfully!");
               
                window.location.href = '/'; 
            } else {
                alert("Failed to create post.");
            }
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error || "Something went wrong."}`);
        }
    } catch (err) {
        console.error("Error creating post:", err);
        alert("An error occurred while creating the post.");
    }
}

postButton.addEventListener('click', createPost);
