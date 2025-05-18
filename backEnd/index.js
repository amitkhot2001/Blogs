const express = require('express');
const cors = require('cors');
const signUpRoute = require('./Routes/Signup');
const loginRoute = require('./Routes/login');
const requestOtpRoute = require('./Routes/requestOtp');
const verifyOtpRoute = require('./Routes/verifyOtp');
const Profile = require('./Routes/getAuthorProfile');
const Blogs = require('./Routes/Blogs');
const fetchBlogs = require('./Routes/fetchBlogs');
const EditBlog = require('./Routes/editBlogs');
const publicBlogs = require('./Routes/publicBlogs');
const getPublicblog = require('./Routes/blogDetails');


const pool = require('./DB/db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', signUpRoute);
app.use('/api', loginRoute);
app.use('/api', requestOtpRoute);
app.use('/api', verifyOtpRoute);
app.use('/api', Profile);
app.use('/api', Blogs);
app.use('/api', fetchBlogs); 
app.use('/api', EditBlog);
app.use('/api', publicBlogs);
app.use('/api', getPublicblog);

pool.getConnection()
  .then(() => {
    console.log('Connected to MySQL');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch(err => {
    console.error('Failed to connect to MySQL:', err);
  });
