import React from 'react';

const FormStep = ({ title, children }) => {
  return (
    <div className="p-6 border rounded-2xl shadow-md bg-white mb-6">
      {title && <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
};

export default FormStep;
