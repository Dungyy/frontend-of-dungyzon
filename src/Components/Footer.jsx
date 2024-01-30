import React from 'react';
import '../App.css';

const Footer = () => {
  return (
    <footer className="fixed-footer">
      <p>Copyright &copy; {new Date().getFullYear()} Dungyzon</p>
    </footer>
  );
};

export default Footer;
