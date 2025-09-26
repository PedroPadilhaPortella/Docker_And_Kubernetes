import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div>
      <h1>Other Page</h1>
      <Link to="/">Go to Home</Link>
    </div>
  );
};