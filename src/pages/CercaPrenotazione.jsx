import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useSearchReservation from "../_hooks/useSearchReservation"; // Import the custom hook

export const CercaPrenotazione = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { bookingCode, setBookingCode, email, setEmail, handleSearch } =
    useSearchReservation(); // Use the custom hook

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header" style={{ backgroundColor: "#F0F8FF" }}>
              <h3 className="text-primary">{t("Cerca prenotazione")}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="mb-3">
                  <label htmlFor="bookingCode" className="form-label">
                    {t("Codice Prenotazione")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bookingCode"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    {t("Email")}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {t("Cerca")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
