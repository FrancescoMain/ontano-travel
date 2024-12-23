import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Autocomplete, Button, Input, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useTourForm } from "../_hooks/useTourForm";
import { DettagliViaggioTour } from "./DettagliViaggioTour";
import { postTourQuote } from "../_api/tourApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const TourComponent = () => {
  const { t } = useTranslation();
  const {
    ports,
    port,
    date,
    tour,
    tours,
    dettagli,
    handlePortChange,
    handleDateChange,
    handleTourChange,
    resetHandle,
    handleSubmit,
    filteredTours,
  } = useTourForm();

  const isButtonDisabled =
    !date ||
    !tour ||
    dettagli[0]?.bambini !== dettagli[0]?.etaBambini?.length ||
    dettagli[0]?.etaBambini?.some((eta) => eta === "");

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />{" "}
      <h4 className="text-primary">{t("Partenza")}</h4>
      <div className="row-cont">
        <Autocomplete
          value={port.name}
          className="select-viaggio"
          placeholder={t("Seleziona porto di partenza")}
          options={ports.map((port) => port.name)}
          sx={{ height: 56 }}
          onChange={handlePortChange}
        />

        <Autocomplete
          value={tour}
          className="select-viaggio mb-2"
          placeholder={t("Tour")}
          options={filteredTours.map((tour) => tour.name)}
          sx={{ height: 56 }}
          onChange={handleTourChange}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <DatePicker
            label={t("Data di partenza")}
            inputFormat="DD/MM/YYYY"
            value={date}
            minDate={dayjs()}
            onChange={handleDateChange}
            sx={{ height: 70 }}
            className="date-picker "
          />
        </LocalizationProvider>
      </div>
      <DettagliViaggioTour id={0} />
      <div className="row">
        <div className="col">
          <Button
            disabled={isButtonDisabled}
            variant="solid"
            color="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
          >
            {t("Cerca")}
          </Button>
        </div>
      </div>
    </div>
  );
};
