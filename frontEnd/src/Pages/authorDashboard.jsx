import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, FileText, Clock, Eye, Search } from 'lucide-react';
import Navbar from '../Components/Navbar2';
import StatCard from '../Components/StatCard';
import StatusBadge from '../Components/StatusBadge';

const sampleBlogs = [
  { id: 1, title: 'React Best Practices', status: 'Published', date: '2023-10-15', views: 120 },
  { id: 2, title: 'CSS Grid Tutorial', status: 'Draft', date: '2023-10-10', views: 0 },
  { id: 3, title: 'JavaScript ES6 Features', status: 'Pending', date: '2023-10-05', views: 0 },
  { id: 4, title: 'Node.js Basics', status: 'Published', date: '2023-09-28', views: 85 },
];

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // Simulate loading blogs data
    setTimeout(() => {
      setBlogs(sampleBlogs);
      setLoading(false);
    }, 1000);

    // Fetch logged-in author's name
    fetchUser();
  }, []);

  async function fetchUser() {
    const token = localStorage.getItem('token');
    if (!token) return; // no token, no fetch

    try {
      const res = await fetch('http://localhost:5000/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await res.json();
      setAuthorName(data.fullName);
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  }

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

  const handleEditBlog = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'Published').length,
    drafts: blogs.filter((b) => b.status === 'Draft').length,
    pending: blogs.filter((b) => b.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} handleLogout={handleLogout} />

      {/* Main content */}
      <div className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-4 sm:p-8 my-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Welcome, {authorName ? authorName : 'Author'}!
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Manage your blog posts, create new content, and track your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatCard icon={<FileText className="w-6 h-6 text-blue-600" />} label="Total Blogs" count={stats.total} color="blue" />
            <StatCard icon={<Eye className="w-6 h-6 text-green-600" />} label="Published" count={stats.published} color="green" />
            <StatCard icon={<Clock className="w-6 h-6 text-yellow-600" />} label="Drafts" count={stats.drafts} color="yellow" />
            <StatCard icon={<Pencil className="w-6 h-6 text-red-600" />} label="Pending" count={stats.pending} color="red" />
          </div>

          <div className="text-center mb-8">
            <button
              onClick={handleCreateBlog}
              className="bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-white font-bold py-2.5 px-6 rounded-full text-base sm:text-lg transition duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              + Create New Blog
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Your Blogs</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-6">
                <p className="text-gray-600">Loading blogs...</p>
              </div>
            ) : filteredBlogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-6 border-b border-gray-200">Title</th>
                      <th className="py-3 px-6 border-b border-gray-200">Status</th>
                      <th className="py-3 px-6 border-b border-gray-200">Date</th>
                      <th className="py-3 px-6 border-b border-gray-200">Views</th>
                      <th className="py-3 px-6 border-b border-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBlogs.map(({ id, title, status, date, views }) => (
                      <tr
                        key={id}
                        className="hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => handleEditBlog(id)}
                      >
                        <td className="py-4 px-6 border-b border-gray-200">{title}</td>
                        <td className="py-4 px-6 border-b border-gray-200">
                          <StatusBadge status={status} />
                        </td>
                        <td className="py-4 px-6 border-b border-gray-200">{date}</td>
                        <td className="py-4 px-6 border-b border-gray-200">{views}</td>
                        <td className="py-4 px-6 border-b border-gray-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBlog(id);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-600">No blogs found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDashboard;
