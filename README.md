Blog Application
A full-stack blog application that allows users to register, log in, and manage their blog posts. It features secure authentication, blog CRUD operations, pagination, and a responsive UI. Built with React, Node.js, Express, and PostgreSQL.

 
Features
User Authentication (Register, Login, Logout)

Create, Read, Update, Delete (CRUD) blog posts

Paginated public blog listing

View blog details with obfuscated URLs using Hashids

Responsive UI (mobile + desktop friendly)

Secure API with JWT-based authentication

Deployment-ready

Tech Stack
Frontend --> React, Axios, React Router DOM, Tailwind CSS

Backend --> Node.js , Express.js, MySQL

JWT for authentication

Hashids for blog URL encoding

Getting Started
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/amitkhot2001/blogs/master
cd blogs

3. Setup Backend
bash
Copy
Edit
cd backend
npm install
.env  # Add your DB credentials, JWT secret, etc.
npx sequelize db:create
npx sequelize db:migrate
npm start
5. Setup Frontend
bash
Copy
Edit
cd ../frontend
npm install
npm run dev
6. Access the App
Frontend: http://localhost:5173

Backend API: http://localhost:5000

Deployment -  AWS
Frontend: nginx
Backend: AWS

Database: Mysql

🔐 Environment Variables
Here are the essential environment variables you need to set in your .env file:

env
Copy
Edit
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME= your_db
DB_USER= your_user
DB_PASS= your_pass
JWT_SECRET= your_jwt_secret
