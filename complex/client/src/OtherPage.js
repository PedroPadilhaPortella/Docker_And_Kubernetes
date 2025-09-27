import React from 'react';

export default () => {
  return (
    <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
      <h1>About</h1>
      <p style={{ fontSize: '1.2rem' }} >This project was created to practice core Docker concepts using a multi-container architecture.
        It includes a frontend, backend, service worker, and an Nginx reverse proxy, all orchestrated 
        with Docker Compose. The purpose is to gain hands-on experience with containerization, networking,
        and service integration in a realistic development environment.</p>
    </div>
  );
};