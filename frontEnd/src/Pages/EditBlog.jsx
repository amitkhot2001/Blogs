import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams(); // encoded blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 403) {
          throw new Error('Access denied: You are not the owner of this blog.');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch blog details');
        }

        const data = await response.json();

        setBlog(data); // assuming data contains the blog object with numeric id
        setTitle(data.title || '');
        setContent(data.content || '');
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleSave = () => {
    alert('Save functionality not implemented yet.');
  };

  if (loading) return <p>Loading blog details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!blog) return <p>No blog found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Editing Blog #{blog.id} – {blog.title || 'Untitled Blog'}
      </h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold" htmlFor="content">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditBlog;
