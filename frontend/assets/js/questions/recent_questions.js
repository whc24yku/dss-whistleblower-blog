console.log("RecentQuestions.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    const questionsContainer = document.getElementById("questionsContainer");

    const token = localStorage.getItem("token"); // or 'jwt_token' depending on your setup

    if (!token) {
        alert("You need to be logged in to view questions.");
        return;
    }

    // Fetch questions from the API
    async function fetchQuestions() {
        try {
            const response = await fetch("http://localhost:3000/api/questions", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            // Check response status
            if (!response.ok || data.status !== "success") {
                throw new Error(data.error || "Failed to fetch questions.");
            }

            const questions = data.questions; // Now accessing the 'questions' array from the response

            if (!questions || questions.length === 0) {
                questionsContainer.innerHTML = "<p>No questions available.</p>";
                return;
            }

            // Render each question
            questions.forEach(question => {
                const questionElement = document.createElement("div");
                questionElement.classList.add("question");

                questionElement.innerHTML = `
                    <h3>${question.title || "Untitled"}</h3>
                    <p>${question.content || "No content provided."}</p>
                    <span class="author">Asked by: ${question.user_id || "Unknown"}</span>
                    <span class="created-at">Created at: ${new Date(question.created_at).toLocaleString()}</span>
                `;

                questionsContainer.appendChild(questionElement);
            });

        } catch (error) {
            console.error("Error fetching questions:", error);
            questionsContainer.innerHTML = `<p class="error">Error loading questions. Please try again later.</p>`;
        }
    }

    fetchQuestions();
});
