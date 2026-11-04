import React from 'react';

const ErrorHandler = ({ error }) => {
  return (
    <div className="error-boundary">
      <p>{error}</p>
    </div>
  );
};

export default ErrorHandler;