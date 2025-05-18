import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Hashids from 'hashids';

const HASHIDS_SALT = import.meta.env.VITE_HASHIDS_SALT || 'your-secret-salt';
const SEARCH_DEBOUNCE_DELAY = 500;

const hashids = new Hashids(HASHIDS_SALT, 10);

const LoadingSpinner = React.memo(() => (
  <div className="absolute right-3 top-1/2 -translate-y-1/2">
    <svg
      className="animate-spin h-4 w-4 text-gray-500 dark:text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </div>
));

const SearchResults = React.memo(({ results, onResultClick }) => (
  <div 
    role="listbox"
    aria-label="Search results"
    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5"
  >
    {results.map((blog) => (
      <Link
        key={blog.id}
        to={`/blog/${hashids.encode(blog.id)}`}
        className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-600"
        onClick={onResultClick}
        role="option"
      >
        <div className="font-medium">{blog.title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {blog.excerpt}
        </div>
      </Link>
    ))}
  </div>
));

const MOCK_RESULTS = [
  { id: 1, title: 'Getting Started with React', excerpt: 'Learn the basics of React development...' },
  { id: 2, title: 'Modern JavaScript Features', excerpt: 'Explore the latest JavaScript features...' },
  { id: 3, title: 'CSS Tips and Tricks', excerpt: 'Advanced CSS techniques for modern web development...' },
  { id: 4, title: 'React Hooks In Depth', excerpt: 'Understanding React Hooks and their use cases...' },
  { id: 5, title: 'State Management in React', excerpt: 'Different approaches to state management...' },
  { id: 6, title: 'Building Responsive Layouts', excerpt: 'Creating responsive web designs using modern CSS...' }
];

const Navbar = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);

  // Debounce helper function
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const sanitizeInput = (input) => input.replace(/[<>]/g, '');

  // Using mock search results for UX
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setResults([]);
      setSearchParams({});
      setShowResults(false);
      setError(null);
      onSearch(''); // notify parent clear
      return;
    }

    setIsSearching(true);
    setError(null);

    // Simulate API delay
    setTimeout(() => {
      const filteredResults = MOCK_RESULTS.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setSearchParams({ search: query.trim() });
      setShowResults(true);
      setIsSearching(false);
      onSearch(query.trim()); // notify parent with search query
    }, 300);
  };

  const debouncedFetch = useCallback(
    debounce(fetchSearchResults, SEARCH_DEBOUNCE_DELAY),
    []
  );

  useEffect(() => {
    debouncedFetch(searchQuery);
  }, [searchQuery, debouncedFetch]);

  const handleSearchChange = (e) => {
    const sanitizedValue = sanitizeInput(e.target.value);
    setSearchQuery(sanitizedValue);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setSearchParams({});
    setShowResults(false);
    setError(null);
    onSearch('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 transition-colors duration-300">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <Link
          to="/"
          className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          MyBlog
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-4 sm:space-x-6 w-full sm:w-auto">
          <div 
            className="relative w-full sm:w-auto search-container"
            role="search"
            aria-label="Blog search"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search blogs..."
              className="px-4 py-2 w-full sm:w-56 md:w-64 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-600 transition-colors duration-200 text-sm"
              onFocus={() => {
                if (results.length > 0) setShowResults(true);
              }}
              aria-label="Search blogs"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {isSearching && <LoadingSpinner />}

            {error && (
              <div className="absolute top-full left-0 mt-1 text-sm text-red-500 bg-white dark:bg-gray-800 p-2 rounded shadow-md">
                {error}
              </div>
            )}

            {showResults && results.length > 0 && (
              <SearchResults 
                results={results} 
                onResultClick={() => setShowResults(false)} 
              />
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 bg-transparent border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-blue-700 dark:text-blue-300 bg-transparent border border-blue-700 dark:border-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 px-4 py-2 rounded-lg font-medium text-sm md:text-base transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
