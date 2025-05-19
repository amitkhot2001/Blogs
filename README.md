----Blog Application-------
A full-stack blog application that allows users to register, log in, and manage their blog posts. It features secure authentication, blog CRUD operations, pagination, and a responsive UI. Built with React, Node.js, Express.js, and MySQL.

Table of Contents
Features
Tech Stack
Getting Started
Environment Variables
Email Support
Deployment
Acknowledgements
Features



The application has the following features:

User Authentication (Register, Login, Logout)
Create, Read, Update, Delete (CRUD) blog posts
Paginated public blog listing
Obfuscated blog URLs using Hashids
Responsive UI (Mobile + Desktop)
JWT-based secure API authentication
Email support via SendGrid (e.g., welcome emails)



Tech Stack
###Frontend
React
Axios
React Router DOM
Tailwind CSS

###Backend
Node.js
Express.js
MySQL
JWT for authentication
Hashids for obfuscated blog URLs
SendGrid for email service




#Getting Started
Clone the Repository --->
git clone https://github.com/amitkhot2001/blogs.git
cd blogs

#Setup Backend
cd backend
npm install
# Create a .env file and add the required environment variables (see below)
Create DB usign MYSQL
npm start


#Setup Frontend
cd ../frontend
npm install
npm run dev
Access the App
Frontend: http://localhost:5173
Backend API: http://localhost:5000

##Environment Variables
#Create a .env file inside the backend directory and add the following:
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_db
DB_USER=your_user
DB_PASS=your_pass
JWT_SECRET=your_jwt_secret

# SendGrid Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_verified_sender_email@example.com
Email Support
This app uses SendGrid to send emails like welcome messages and password resets. It's configured using the @sendgrid/mail package.

Example Usage:
JAVASCRIPT

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: user.email,
  from: process.env.EMAIL_FROM,
  subject: "Welcome to Blog App!",
  text: "Thank you for registering.",
};

await sgMail.send(msg);




#####Deployment
#Frontend: Hosted on AWS using Nginx
#Backend: Deployed on AWS EC2
#Database: MySQL 
Acknowledgements
SendGrid
Sequelize
React
Tailwind CSS
Hashids
