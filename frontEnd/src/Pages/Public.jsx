import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';

const blogsPerPage = 6;

const Public = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  // Calculate total pages dynamically based on totalBlogs
  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/public-blogs?page=${currentPage}&limit=${blogsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBlogs(data.blogs || []);
        setTotalBlogs(data.totalBlogs || 0);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
        setTotalBlogs(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  // Skeleton Loader Component for Loading State
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="p-6 flex flex-col h-full">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mt-4 w-1/4"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto p-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center tracking-tight">
          Featured Posts
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: blogsPerPage }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="p-6 flex flex-col h-full">
                    <a
                      href="#"
                      className="text-xl font-semibold text-gray-800 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2"
                    >
                      {post.title}
                    </a>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed flex-grow mb-4 line-clamp-4">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>By {post.author || 'Unknown'}</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                    >
                      Read the post
                      <span className="text-blue-600 dark:text-blue-400">›</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center mt-12 space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white'
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                    currentPage === index + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                  currentPage === totalPages || totalPages === 0
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white'
                }`}
              >
                Next
              </button>
            </div>

            {/* Display total blogs for debugging */}
            <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
              Total Blogs: {totalBlogs}
            </p>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No blogs found. Check back later!
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Public;