import React from "react";
import "./Confirmation.css";  // importuj plik css dla komponentu Confirmation

const Confirmation = ({ message, onClose }) => {
    console.log("GIGA GUPA");
  return (
    <div className="confirmation-container">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default Confirmation;
