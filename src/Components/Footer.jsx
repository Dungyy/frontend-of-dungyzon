import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="d-flex flex-column align-items-center">
      <p>Copyright &copy; {new Date().getFullYear()} Dungyzon</p>
    </footer>
  );
};

export default Footer;
