import React from 'react';


const handleLogout = () => {
  // Remove JWT from local storage
  localStorage.removeItem('jwtToken');
  
  // Optionally, redirect the user
  window.location.href = '/login';
};

const LogoutButton = () => (
  <button onClick={handleLogout}>Logout</button>
);

export default LogoutButton;
