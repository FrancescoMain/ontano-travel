import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const Success = () => {
  const navigate = useNavigate();
  const [reservationCode, setReservationCode] = useState(null);

  useEffect(() => {
    // Get reservation code from sessionStorage
    const code = sessionStorage.getItem("reservationCode");
    if (code) {
      setReservationCode(code);
      // Clean up sessionStorage after retrieving
      sessionStorage.removeItem("reservationCode");
    }
  }, []);

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="alert alert-success text-center" role="alert">
          <h1>La prenotazione è avvenuta con successo!</h1>
          {reservationCode && (
            <div className="mt-4">
              <h3>Codice Prenotazione:</h3>
              <p className="fs-2 fw-bold text-primary">{reservationCode}</p>
            </div>
          )}
          <p className="mt-3">Riceverai una email a breve.</p>
        </div>
      </div>
    </>
  );
};
