import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";

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

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="alert alert-success text-center" role="alert">
          <h1>{t('Link inviato con successo')}</h1>
          <p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t('Completa il pagamento')}
            </a>
          </p>
          <p>
            {t('Il link scade tra')}: <strong>{formatTime(countdown)}</strong>
          </p>
          <p>
            {t('ID della prenotazione')}: <strong>{reservationId}</strong>
          </p>
        </div>
      </div>
      <footer className="text-center mt-5">
        <p>© 2024 Ontano Travel. {t('Tutti i diritti riservati')}.</p>
      </footer>
    </>
  );
};
