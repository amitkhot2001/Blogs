import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hashids from 'hashids';
import Navbar from '../Components/Navbar';

const hashids = new Hashids("your-secret-salt", 8); // Use the same salt as in Public.jsx

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse page query param from URL, default to 1 if missing
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get('page') || '1';

  // Decode the hashed ID
  const decodedId = hashids.decode(id)[0]; // Get the first number from decoded array

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!decodedId) {
          throw new Error('Invalid blog ID');
        }

        const response = await fetch(`http://localhost:5000/api/blog/${decodedId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.blog) {
          setBlog(data.blog);
        } else {
          setBlog(data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load blog. Please try again later.');
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [decodedId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // go back if possible
    } else {
      navigate(`/?page=${page}`); // fallback to blogs list on same page
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-t-blue-600 dark:border-t-blue-400 border-gray-200 dark:border-gray-700 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 mb-6 text-xl font-medium"
        >
          {error}
        </motion.p>
        <button
          onClick={handleBack}
          className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-600 dark:text-gray-400 mb-6 text-xl font-medium"
        >
          Blog not found.
        </motion.p>
        <button
          onClick={handleBack}
          className="px-5 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-600 transition"
        >
          &larr; Back
        </button>
      </div>
    );
  }

  const title = blog.title || 'Untitled';
  const author = blog.author || blog.author_name || 'Unknown';
  const date = blog.date || blog.created_at || new Date().toISOString();
  const contentHtml = blog.content || blog.description || '';
  const coverImage = blog.cover_image || blog.image || null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <Navbar />
      {coverImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-80 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-white text-5xl font-bold text-center px-4">
              {title}
            </h1>
          </div>
        </motion.div>
      )}

      <main className="max-w-4xl mx-auto p-6 py-12 text-gray-800 dark:text-gray-200">
        {!coverImage && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-center"
          >
            {title}
          </motion.h1>
        )}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex items-center">
            <span className="font-medium">By {author}</span>
          </div>
          <span>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        <article className="prose dark:prose-invert max-w-none bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {contentHtml ? (
            <div
              dangerouslySetInnerHTML={{ __html: contentHtml }}
              className="leading-relaxed text-base md:text-lg"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No content available.</p>
          )}
        </article>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center px-5 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition transform hover:scale-105"
          >
            <span className="mr-2">&larr;</span> Back
          </button>
        </div>
      </main>
    </div>
  );
};

export default BlogDetail;