// StatCard.js
import React from 'react';

const StatCard = ({ icon, label, count, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <div className={`flex items-center gap-4 p-4 sm:p-6 rounded-2xl shadow-md ${colors[color]}`}>
      <div className="p-3 rounded-full bg-white">{icon}</div>
      <div>
        <p className="text-lg font-semibold">{count}</p>
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;