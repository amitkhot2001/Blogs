import React from 'react';
import Navbar from '../Components/Navbar';

const Public = () => {
  return (
    <div>
      <Navbar />

      <main className="min-h-screen bg-gray-100 p-6">
        {/* Blog list or auth forms go here */}
      </main>
    </div>
  );
};

export default Public;
