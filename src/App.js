import React, {useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import Top from "./components/Top";
import HomePage from "./components/HomePage";

import axios from "axios";

function App() {
  const [pin, setPin] = useState(Array(4).fill("")); // Inicjalizuj stan jako tablicę pustych stringów
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "-");

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );



  const handlePinChange = (value, index) => {
    setPin((prevPin) => {
      const newPin = [...prevPin];
      newPin[index] = value;
      return newPin;
    });
  };
  const verifyPin = async (pin) => {
    try {
      const formData = new FormData();
      formData.append("pin", pin);
  
      const response = await axios.post(
        "http://localhost/verifyPin",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      return {
        isPinValid: response.data.isPinValid,
        uid: response.data.uid
      };
    } catch (error) {
      console.error("Error during PIN verification:", error);
      return {
        isPinValid: false,
        uid: null
      };
    }
  };
  

  const handleSubmit = async () => {
    try {
      const pinString = pin.join("");
  
      // Sprawdź, czy wszystkie pola zostały wypełnione
      if (pinString.length < 4) {
        alert("Please fill in all PIN fields.");
        return;
      }
      const pinInt = parseInt(pinString, 10);
  
      const { isPinValid, uid } = await verifyPin(pinInt);
      if (isPinValid) {
        setIsLoggedIn(true);
        setUserId(uid);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", uid);
      } else {
        alert("PIN is incorrect!");
      }
    } catch (error) {
      console.error("Error during PIN verification:", error);
    }
  };
  

  
  return (
    <div>
      <Top />
      {isLoggedIn ? (
  <HomePage userId={userId} onLogout={() => setIsLoggedIn(false)} setUserId={setUserId} />
) : (
        <LoginPage onPinChange={handlePinChange} onSubmit={handleSubmit} />
      )}
      {/* Renderuj HomePage jeżeli użytkownik jest zalogowany, w przeciwnym wypadku renderuj LoginPage */}
    </div>
  );
}

export default App;
