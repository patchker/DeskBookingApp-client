import React, { useEffect } from "react";
import "./LoginPage.css";
const LoginPage = ({ onPinChange, onSubmit }) => {
  const inputsRef = React.useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value !== "" && (value < "0" || value > "9")) {
      e.target.value = "";
    } else {
      onPinChange(value, index);
      if (value !== "" && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputsRef.current[index - 1].focus();
      onPinChange("", index - 1);
    }
  };

  useEffect(() => {
    inputsRef.current[0].focus();
  }, []);

  return (
    <div className="container3">
      <div className="textcontainer">
        <h2>Wpisz pin</h2>
      </div>
      <div className="container">
        {[...Array(4)].map((_, i) => (
          <input
            key={i}
            className="input-field"
            type="text"
            maxLength={1}
            onChange={(e) => handleInputChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            ref={(ref) => (inputsRef.current[i] = ref)}
          />
        ))}
        <input
          className="submit-button"
          type="submit"
          value="ENTER"
          onClick={onSubmit}
        />
      </div>
    </div>
  );
  
};

export default LoginPage;
