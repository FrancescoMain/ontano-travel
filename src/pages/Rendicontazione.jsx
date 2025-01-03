import React, { useState } from "react";
import { FaDownload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { downloadRendicontazione } from "../features/rendicontazione/rendicontazioneSlice";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { itIT } from "@mui/x-date-pickers/locales"; // Import the Italian locale for MUI Date Pickers

const Rendicontazione = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const dispatch = useDispatch();
  const loadingIds = useSelector((state) => state.spinner.loadingIds);
  const isLoading = loadingIds.includes("downloadRendicontazione");

  const handleDownload = (event) => {
    event.preventDefault();
    if (!fromDate || !toDate) {
      alert(t("Both dates are required."));
      return;
    }
    const formattedFromDate = fromDate.format("YYYY-MM-DD");
    const formattedToDate = toDate.format("YYYY-MM-DD");
    dispatch(
      downloadRendicontazione({
        fromDate: formattedFromDate,
        toDate: formattedToDate,
      })
    );
  };

  return (
    <div className="container">
      <h1>{t("Rendicontazione")}</h1>
      <p>{t("Contenuto della pagina di rendicontazione.")}</p>
      <form onSubmit={handleDownload}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <div className="mb-3">
            <label htmlFor="fromDate" className="form-label">
              {t("From Date")}
            </label>
            <DatePicker
              className="form-control"
              label={t("From Date")}
              value={fromDate}
              onChange={(newValue) => setFromDate(newValue)}
              inputFormat="DD/MM/YYYY" // Set the input format to DD/MM/YYYY
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="toDate" className="form-label">
              {t("To Date")}
            </label>
            <DatePicker
              className="form-control"
              label={t("To Date")}
              value={toDate}
              onChange={(newValue) => setToDate(newValue)}
              inputFormat="DD/MM/YYYY" // Set the input format to DD/MM/YYYY
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </div>
        </LocalizationProvider>
        <button
          type="submit"
          className="btn btn-primary fs-6 mb-4"
          disabled={isLoading || !fromDate || !toDate}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <FaDownload />
          )}
          {isLoading ? ` ${t("Scaricando...")}` : ` ${t("Scarica")}`}
        </button>
      </form>
    </div>
  );
};

export default Rendicontazione;
