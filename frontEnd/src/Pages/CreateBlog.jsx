import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setMessage({ type: 'error', text: 'You must be logged in to create a blog.' });
    } else {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage({ type: 'error', text: 'Authentication token missing. Please login again.' });
      return;
    }

    if (!title.trim() || !content.trim()) {
      setMessage({ type: 'error', text: 'Both title and content are required.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await axios.post(
        'http://localhost:5000/api/blogs',
        { title, content, isDraft }, // Make sure backend handles isDraft
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage({ type: 'success', text: isDraft ? 'Draft saved successfully!' : 'Blog published successfully!' });
      setTitle('');
      setContent('');
      setIsDraft(false);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error creating blog. Please try again.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100
                 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl
                 sm:px-8 md:px-12 lg:px-16
                 overflow-visible"
    >
      <div className="mb-8 text-center px-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
          Create a New Blog
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">Share your thoughts with the world</p>
      </div>

      {message && (
        <div
          role="alert"
          className={`flex items-center mb-6 rounded-md px-5 py-4 text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.type === 'success' ? (
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div>
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm
                       text-gray-900 placeholder-gray-400
                       focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-600
                       transition"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            required
            className="w-full min-h-[150px] sm:min-h-[200px] px-5 py-4 border border-gray-300 rounded-lg shadow-sm
                       text-gray-900 placeholder-gray-400 resize-y
                       focus:outline-none focus:ring-3 focus:ring-blue-400 focus:border-blue-600
                       transition"
            aria-required="true"
          ></textarea>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="draft"
            checked={isDraft}
            onChange={(e) => setIsDraft(e.target.checked)}
          />
          <label htmlFor="draft" className="text-sm text-gray-700">
            Save as Draft
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={`w-full flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700
                      text-white font-bold py-3 rounded-lg shadow-md transition duration-300
                      ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          {loading && (
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          )}
          {loading
            ? (isDraft ? 'Saving Draft...' : 'Publishing...')
            : (isDraft ? 'Save as Draft' : 'Publish Blog')}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
