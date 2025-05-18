import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Hashids from 'hashids';

const blogsPerPage = 6;
const hashids = new Hashids("your-secret-salt", 8);

// SkeletonCard Component
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

const Public = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  const hashBlogId = (id) => {
    return hashids.encode(id);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: blogsPerPage,
          ...(searchQuery && { search: searchQuery })
        });

        const response = await fetch(
          `http://localhost:5000/api/public-blogs?${queryParams}`
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
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setSearchParams(query ? { search: query } : {});
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Navbar onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto p-6 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-10 text-center tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Posts'}
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
                    <Link
                      to={`/blog/${hashBlogId(post.id)}`}
                      className="text-xl font-semibold text-gray-800 dark:text-white mb-4 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    <div 
                      className="text-gray-600 dark:text-gray-300 text-base leading-relaxed flex-grow mb-4 line-clamp-4"
                      dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>Author: <span dangerouslySetInnerHTML={{ __html: post.author || 'Unknown' }} /></span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/blog/${hashBlogId(post.id)}`}
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                    >
                      Read the post
                      <span className="text-blue-600 dark:text-blue-400">›</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
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
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 ${
                    currentPage === totalPages
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            )}

            <div className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
              {searchQuery ? (
                <p>
                  Found {totalBlogs} {totalBlogs === 1 ? 'result' : 'results'} for "{searchQuery}"
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear search
                  </button>
                </p>
              ) : (
                <p>Total Blogs: {totalBlogs}</p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {searchQuery ? `No results found for "${searchQuery}"` : 'No blogs found. Check back later!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Public;