cd pgsql\bin

pg_ctl.exe -D C:\Users\170628\pgsql_data -l logfile start


psql -U postgres



-- Users table (for authentication and tracking)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts table (whistleblower posts)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table (similar to posts but for inquiries)
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table (for both posts and questions)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE CASCADE,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (post_id IS NOT NULL OR question_id IS NOT NULL) -- Ensure comment links to post or question
);

-- Create new votes table
-- Create new votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    post_id INT REFERENCES posts(id) ON DELETE SET NULL,
    question_id INT REFERENCES questions(id) ON DELETE SET NULL,
    comment_id INT REFERENCES comments(id) ON DELETE SET NULL,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (post_id IS NOT NULL AND question_id IS NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND question_id IS NOT NULL AND comment_id IS NULL) OR
        (post_id IS NULL AND question_id IS NULL AND comment_id IS NOT NULL)
    )
);

.env

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/whistleblower_db
JWT_SECRET=your-secure-jwt-secret_secret
PORT=3000

APIs

Register

{{base_url}}/api/register

No Auth

{ 
    "username": "test", 
    "email": "test@example.com", 
    "password": "password123" 
}

Login

{{base_url}}/api/login

No Auth

{ 
    "identifier": "test", 
    "password": "password123" 
}

Create post

{{base_url}}/api/posts

Auth - Bearer Token

{
    "title": "Test Post",
    "content": "This is a whistleblower post."
}

Get all posts

Auth - Bearer Token

{{base_url}}/api/posts

Vote for a post

{{base_url}}/api/posts/2/vote

{
    "vote_type": "up"
}


Create a question

Auth - Bearer Token

{{base_url}}/api/questions

{
    "title": "Test Question",
    "content": "This is a whistleblower question."
}

Vote for a quesition

Auth - Bearer Token

{{base_url}}/api/questions/1/vote

{
    "vote_type": "up"
}




