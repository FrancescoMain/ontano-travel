import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCopy } from "react-icons/fa";

export const PayByLinkSuccess = () => {
  const { t } = useTranslation();
  const { link, expiration, reservationId } = useSelector(
    (state) => state.payByLink
  );
  const [countdown, setCountdown] = useState(
    Math.floor((new Date(expiration) - new Date()) / 1000)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
  };

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="alert alert-success text-center" role="alert">
          <h1>{t("Link inviato con successo")}</h1>

          <p>
            {t("Il link scade tra")}: <strong>{formatTime(countdown)}</strong>
          </p>
          <p>
            {t("ID della prenotazione")}: <strong>{reservationId}</strong>
          </p>
          <p className="d-flex align-items-center justify-content-center">
            {t("Copia il link per intero")}:
            <button onClick={copyToClipboard} className="btn btn-link ml-2">
              <FaCopy className="mr-1" />
            </button>
          </p>
        </div>
      </div>
      <footer className="text-center mt-5">
        <p>© 2024 Ontano Travel. {t("Tutti i diritti riservati")}.</p>
      </footer>
    </>
  );
};
