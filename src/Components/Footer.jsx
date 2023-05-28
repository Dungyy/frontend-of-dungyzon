import React from "react";

import "../App.css";

export default function Footer() {
    const getCurrentYear = () => {
      return new Date().getFullYear();
    };
  
    return (
      <div className="d-flex align-items-center fixed-footer">
          <p className="mb-0 flex-grow-1">
          Copyright © {getCurrentYear()} Dungy
          </p>
      </div>
    );
  }