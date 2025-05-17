import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, FileText, Clock, Eye, Search } from 'lucide-react';
import Navbar from '../Components/Navbar2';
import StatCard from '../Components/StatCard';
import StatusBadge from '../Components/StatusBadge';
import Hashids from 'hashids';

const hashids = new Hashids('qA0z4AGE9R', 10); // Replace 'your-secret-salt' with your own secret

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [error, setError] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;

  useEffect(() => {
    fetchUser();
    fetchBlogs();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return setAuthorName('Author');

    try {
      const res = await fetch('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setAuthorName(data.fullName || 'Author');
    } catch (err) {
      console.error('Error fetching user info:', err);
      setAuthorName('Author');
    }
  };

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/fetch-blogs', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch blogs:', errorText);
        setError('Failed to load blogs');
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.blogs && data.blogs.length > 0) {
        const mappedBlogs = data.blogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          status: blog.is_draft === 1 ? 'Pending' : 'Published',
          date: blog.created_at,
          views: blog.views || 0,
        }));
        setBlogs(mappedBlogs);
        setError('');
      } else {
        setBlogs([]);
        setError('No blogs found.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Error fetching blogs');
      setLoading(false);
    }
  };

  const handleCreateBlog = () => navigate('/create-blog');

  // Encode blog ID with hashids before navigation
  const handleEditBlog = (id) => {
    const encodedId = hashids.encode(id);
    navigate(`/edit-blog/${encodedId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // Filter blogs by search and status
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || blog.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'Published').length,
    drafts: 0, // drafts removed in favor of pending
    pending: blogs.filter((b) => b.status === 'Pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} handleLogout={handleLogout} />

      <div className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-4 sm:p-8 my-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Welcome, {authorName}!
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Manage your blog posts, create new content, and track your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <StatCard icon={<FileText className="w-6 h-6 text-blue-600" />} label="Total Blogs" count={stats.total} color="blue" />
            <StatCard icon={<Eye className="w-6 h-6 text-green-600" />} label="Published" count={stats.published} color="green" />
            <StatCard icon={<Clock className="w-6 h-6 text-yellow-600" />} label="Pending" count={stats.pending} color="yellow" />
            <StatCard icon={<Pencil className="w-6 h-6 text-red-600" />} label="Drafts" count={stats.drafts} color="red" />
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // reset to page 1 on search
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1); // reset to page 1 on filter change
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Published">Published</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            {loading ? (
              <div className="text-center py-6 text-gray-600">Loading blogs...</div>
            ) : error ? (
              <div className="text-center py-6 text-red-600">{error}</div>
            ) : currentBlogs.length > 0 ? (
              <>
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
                      {currentBlogs.map(({ id, title, status, date, views }) => (
                        <tr
                          key={id}
                          className="hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => handleEditBlog(id)}
                        >
                          <td className="py-3 px-6 border-b border-gray-200 font-semibold text-gray-900">
                            {title}
                          </td>
                          <td className="py-3 px-6 border-b border-gray-200">
                            <StatusBadge status={status} />
                          </td>
                          <td className="py-3 px-6 border-b border-gray-200 text-gray-600">
                            {new Date(date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-6 border-b border-gray-200 text-gray-600">{views}</td>
                          <td className="py-3 px-6 border-b border-gray-200 text-blue-600 font-semibold flex items-center space-x-2">
                            <Pencil className="w-5 h-5" />
                            <span>Edit</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-center space-x-3 mt-6">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 hover:bg-blue-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
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
