// StatusBadge.js
import React from 'react';

const StatusBadge = ({ status }) => {
  const statusColors = {
    Published: 'bg-green-100 text-green-700',
    Draft: 'bg-yellow-100 text-yellow-700',
    Pending: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;