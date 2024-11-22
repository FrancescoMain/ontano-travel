import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { downloadRendicontazione } from "../features/rendicontazione/rendicontazioneSlice";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Rendicontazione = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const dispatch = useDispatch();
  const loadingIds = useSelector((state) => state.spinner.loadingIds);
  const isLoading = loadingIds.includes('downloadRendicontazione');

  const handleDownload = (event) => {
    event.preventDefault();
    if (!fromDate || !toDate) {
      alert(t("Both dates are required."));
      return;
    }
    dispatch(downloadRendicontazione({ fromDate, toDate }));
  };

  return (
    <div className="container">
      <h1>{t("Rendicontazione")}</h1>
      <p>{t("Contenuto della pagina di rendicontazione.")}</p>
      <form onSubmit={handleDownload}>
        <div className="mb-3">
          <label htmlFor="fromDate" className="form-label">{t("From Date")}</label>
          <input
            type="date"
            className="form-control"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="toDate" className="form-label">{t("To Date")}</label>
          <input
            type="date"
            className="form-control"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading || !fromDate || !toDate}>
          {isLoading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : (
            <FaDownload />
          )}
          {isLoading ? ` ${t('Scaricando...')}` : ` ${t('Scarica')}`}
        </button>
      </form>
    </div>
  );
};

export default Rendicontazione;
