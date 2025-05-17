import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditBlog = () => {
  const { id } = useParams(); // encoded blog ID
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        setBlog(data);
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

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.status === 403) {
        throw new Error('Access denied: You are not the owner of this blog.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save blog');
      }

      setShowSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // When user confirms deletion inside custom modal
  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setDeleting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 403) {
        throw new Error('Access denied: You are not the owner of this blog.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      setShowDeleteSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  // When user clicks delete button, show confirmation modal
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    navigate('/author-dashboard');
  };

  const handleDeleteSuccessOk = () => {
    setShowDeleteSuccess(false);
    navigate('/author-dashboard');
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
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
          disabled={saving || deleting}
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
          disabled={saving || deleting}
        />
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={saving || deleting}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        <button
          onClick={handleDeleteClick}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          disabled={saving || deleting}
        >
          {deleting ? 'Deleting...' : 'Delete Blog'}
        </button>
      </div>

      {/* Save success modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <p className="mb-4 font-semibold text-green-600">Blog saved and published successfully!</p>
            <button
              onClick={handleSuccessOk}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <p className="mb-4 font-semibold text-gray-800">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={deleting}
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                disabled={deleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete success modal */}
      {showDeleteSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
            <p className="mb-4 font-semibold text-green-600">Blog deleted successfully!</p>
            <button
              onClick={handleDeleteSuccessOk}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBlog;
