import React, { useEffect, useState } from "react";
import "./HomePage.css";
import axios from "axios";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import ReservationConfirm from "./ReservationConfirm";

const HomePage = ({ userId, setUserId, onLogout }) => {
  console.log("HomePage rendered"); // Dodaj to tutaj

  const [desks, setDesks] = useState([]);
  const [testDate, setTestDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [reservedDesks, setReservedDesks] = useState({ 1: null, 2: null }); // stan na zarezerwowane biurka
  const [isReady, setIsReady] = useState(false);

  const [selectedDesks, setSelectedDesks] = useState({
    1: null, // Dla biurek
    2: null, // Dla garaży
  });
  const [selectedDesk, setSelectedDesk] = useState(null);

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [pin, setPin] = useState("");

  const handleReserveClick = (deskId, deskType) => {
    const desk = desks.find((d) => d.did === deskId && d.rodzaj === deskType);
    setSelectedDesk(desk);
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    setSelectedDesk(null);
    document.body.style.overflow = "auto";
  };

  const handleConfirm = () => {
    // Tutaj sprawdź PIN, jeśli jest poprawny:
    setSelectedDesk(null);
    document.body.style.overflow = "auto";
  };

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("isLoggedIn");
  };
  const fetchDesks = async () => {
    try {
      const formData = new FormData();
      formData.append("date", testDate);

      console.log("DATE:", { date: testDate });
      const response = await axios.post("http://localhost/getDesks", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Test date ", testDate);
      console.log("RESPONS DATA:", response.data);
      if (response.data) {
        setDesks(response.data);
      }
    } catch (error) {
      console.error("Error during desks fetching:", error);
    }
  };
  const fetchReservedDesks = async (userId) => {
    try {
      console.log("ELUWINA");
      console.log(userId);
      const formData = new FormData();
      formData.append("userId", userId);

      const response = await axios.post(
        "http://localhost/getReservedDesks",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setReservedDesks(response.data); // Ustawiamy pobrane dane do stanu
      }
    } catch (error) {
      console.error("Error during reserved desks fetching:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      setUserId(document.getElementById("uid").value);
    }
    fetchDesks();
  }, [testDate, userId]);

  useEffect(() => {
    if (userId) {
      fetchReservedDesks(userId);
    }
  }, [userId, fetchReservedDesks]);

  // Funkcja obsługująca kliknięcie - teraz uwzględnia rodzaj miejsca
  const handleDeskClick = (deskId, deskType) => {
    setSelectedDesks((prevState) => ({
      ...prevState,
      [deskType]: prevState[deskType] === deskId ? null : deskId,
    }));
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

  console.log("desks", desks);
  console.log("selectedDesks", selectedDesks);

  return (
    <div className="HomePageContainer">
      <input type="hidden" id="uid" value={userId} />

      <div className="reserved-info">
        {reservedDesks[1] ? (
          <div className="info-item">
            <TableRestaurantIcon />
            <div>
              <div className="info-title">Zarezerwowane miejsce:</div>
              <div className="info-description">
                {reservedDesks[1].nazwa}, {getDeskName(reservedDesks[1])}
              </div>
            </div>
          </div>
        ) : (
          <div className="info-item">Brak rezerwacji dla miejsca.</div>
        )}

        {reservedDesks[2] ? (
          <div className="info-item">
            <DirectionsCarIcon />
            <div>
              <div className="info-title">Zarezerwowany garaż:</div>
              <div className="info-description">
                {reservedDesks[2].nazwa}, {getDeskName(reservedDesks[2])}
              </div>
            </div>
          </div>
        ) : (
          <div className="info-item">Brak rezerwacji dla garażu.</div>
        )}
      </div>

      <label>
        Wybierz datę:
        <input
          className="date-input"
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
        />
      </label>

      {desks.map((desk, index) => (
        <div className="desk-container">
          <div
            key={desk.did}
            className={`desk ${
              desk.did === selectedDesks[desk.rodzaj] ? "selected" : ""
            }`}
            onClick={() => handleDeskClick(desk.did, desk.rodzaj)}
          >
            <div className="desk-name">{getDeskName(desk)}</div>
            <div className="desk-number">{desk.nazwa}</div>
            <div className="desk-did">{desk.did}</div>
            <div className="desk-icon">
              {desk.rodzaj === 1 ? (
                <TableRestaurantIcon />
              ) : (
                <DirectionsCarIcon />
              )}
            </div>
          </div>
          <button
            className={`reservation-btn ${
              desk.did === selectedDesks[desk.rodzaj] ? "visible" : ""
            }`}
            onClick={() => handleReserveClick(desk.did, desk.rodzaj)}
          >
            Rezerwuj
          </button>
        </div>
      ))}
      {selectedDesk && (
        <div className="modal">
          <div className="modal-content">
            <ReservationConfirm
              desk={selectedDesk}
              onConfirm={handleConfirm}
              onCancel={handleClose}
              testDate={testDate}
              refreshDesks={fetchDesks}
              refreshReservations={fetchReservedDesks} // Przekazujemy funkcję jako atrybut
            />
          </div>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
