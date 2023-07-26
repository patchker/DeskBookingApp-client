import React, { useState } from "react";
import "./ReservationConfirm.css";
import axios from "axios";
import Confirmation from "./Confirmation";

const ReservationConfirm = ({ desk, onConfirm, onCancel,testDate, refreshData, refreshReservations }) => {
  const [pin, setPin] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const verifyPin = async (pin,did,uid) => {
    try {
      const formData = new FormData();
      formData.append("pin", pin);
      formData.append("did", did);
      formData.append("uid", uid);
      console.log("PINNN", pin);
      console.log("DITTT", did);
      console.log("UIDDD", uid);

      const response = await axios.post(
        "http://localhost/reservation",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.isPinValid;
    } catch (error) {
      console.error("Error during PIN verification:", error);
      return false;
    }
  };
  const handleConfirm = async () => {
    console.log("ELO", desk.did); // to wydrukuje wartość inputa w konsoli
    console.log("Wpisany pin: ", pin);

    try {
      const pinString = pin.join("");

      // Sprawdź, czy wszystkie pola zostały wypełnione
      if (pinString.length < 4) {
        alert("Please fill in all PIN fields.");
        return;
      }
      const pinInt = parseInt(pinString, 10);
      const uid = document.getElementById("uid").value;
      console.log("UID: ",uid);
      const isPinValid = await verifyPin(pinInt,desk.did,uid);
      console.log(isPinValid);
      if (isPinValid) {
        console.log("Setting showConfirmation to true");  // log, jeśli ustawiamy showConfirmation na true
        setShowConfirmation(true);  // ustaw na true, aby wyświetlić komunikat
        refreshData();  // Odśwież dane po potwierdzeniu
        refreshReservations();

      } else  {
        alert("PIN is incorrect!");
      }
    } catch (error) {
      console.error("Error during PIN verification:", error);
    }
  };

  const handleClose = () => {
    onCancel();
  };

  const getDeskName = (desk) => {
    if (desk.lokalizacja === 1) {
      return "Kraków";
    } else if (desk.lokalizacja === 2) {
      return "Warszawa";
    } else if (desk.lokalizacja === 3) {
      return "Poznań";
    } else if (desk.lokalizacja === 4) {
      return "Inny";
    } else {
      return desk.lokalizacja;
    }
  };

  const inputsRef = React.useRef([]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value !== "" && (value < "0" || value > "9")) {
      e.target.value = "";
    } else {
      onPinChange(value, index); // Przekazuj zmiany do rodzica
      if (value !== "" && index < 3) {
        inputsRef.current[index + 1].focus();
      }
    }
  };
  const onPinChange = (value, index) => {
    setPin((prevPin) => {
      const newPin = [...prevPin];
      newPin[index] = value;
      return newPin;
    });
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputsRef.current[index - 1].focus();
      onPinChange("", index - 1); // usuwa wartość z poprzedniego pola
    }
  };

  return (
    <div className="pin-confirm-overlay">
        {showConfirmation && 
        <Confirmation 
            message="Zarezerwowano pomyślnie." 
            onClose={() => {
                setShowConfirmation(false);
                onCancel();
            }} 
        />}
      <button className="close-button" onClick={handleClose}>
        X
      </button>
      <h2>
        Rezerwacja miejsca: {desk.nazwa},{getDeskName(desk)} 
      </h2>
      {testDate}
      <br/>
      <br/>

<p>Potwierdź pin</p>
      <div className="input-container">
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
          onClick={handleConfirm}
        />
      </div>
    </div>
  );
};
export default ReservationConfirm;
