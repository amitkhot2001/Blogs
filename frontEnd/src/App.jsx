// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Public from './Pages/Public';
import LoginForm from './Components/Login';
import SignUpForm from './Components/SignUp';
import AuthorDashboard from './Pages/authorDashboard';
import CreateBlog from './Pages/CreateBlog';
import BlogDetail from './Pages/BlogDetail';
import EditBlog from './Pages/EditBlog';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        
        {/* Protected Routes */}
        <Route
          path="/author-dashboard"
          element={
            <PrivateRoute>
              <AuthorDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-blog"
          element={
            <PrivateRoute>
              <CreateBlog />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-blog/:id"
          element={
            <PrivateRoute>
              <EditBlog />
            </PrivateRoute>
          }
        />

        {/* Public Blog View */}
        <Route path="/blog/:id" element={<BlogDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
