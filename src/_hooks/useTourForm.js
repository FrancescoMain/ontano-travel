import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPorts, fetchTours, postTourQuote } from "../_api/tourApi";
import {
  setPort,
  setDate,
  setTour,
  setTours,
  resetTour,
} from "../features/tour/tourSlice";
import moment from "moment";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const useTourForm = () => {
  const { t } = useTranslation();
  const [ports, setPorts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation
  const { port, date, tour, tours, dettagli } = useSelector(
    (state) => state.tour
  );

  useEffect(() => {
    const getPorts = async () => {
      try {
        const data = await fetchPorts();
        setPorts(data);
      } catch (error) {
        console.error("Error fetching ports:", error);
        toast.error("Errore nel recupero dei porti. Please try again.");
      }
    };
    getPorts();
  }, []);

  useEffect(() => {
    const getTours = async () => {
      try {
        const data = await fetchTours();
        if (data.length === 0) {
          toast.info("Nessun tour trovato. No tours found.");
        }
        dispatch(setTours(data));
      } catch (error) {
        console.error("Error fetching tours:", error);
        toast.error("Errore nel recupero dei tour. Please try again.");
      }
    };
    getTours();
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tourId = params.get("tour_id");
    const departureDate = params.get("departure_data");

    if (tourId || departureDate) {
      const selectedTour = tours.find((t) => t.id === parseInt(tourId));
      if (selectedTour) {
        dispatch(setTour(selectedTour.name));
        const date = dayjs(departureDate);
        if (date.isValid()) {
          dispatch(setDate(date));
        }
      }
    }
  }, [location.search, tours, dispatch]);

  const handlePortChange = (event, value) => {
    const selectedPort = ports.find((port) => port.name === value);
    dispatch(setPort(selectedPort || { code: "", name: "" }));
  };

  const handleDateChange = (value) => {
    console.log("value", value);
    dispatch(setDate(value));
  };

  const handleTourChange = (event, value) => {
    dispatch(setTour(value));
  };

  const resetHandle = () => {
    dispatch(resetTour());
  };

  const handleSubmit = async () => {
    dispatch(startLoading());
    const selectedTour = tours.find((t) => t.name === tour).id;
    const animali = dettagli[0]?.animali || 0;
    const bagagli = dettagli[0]?.bagagli || 0;
    const passengers = [
      ...Array(dettagli[0]?.adulti || 0).fill({ age: 18 }),
      ...(dettagli[0]?.etaBambini || []).map((eta) => ({ age: eta })),
    ];

    const logObject = {
      tour_id: selectedTour,
      data_departure: moment(date).format("YYYY-MM-DD"),
      animals: animali,
      luggages: bagagli,
      passengersAge: passengers,
      etaBambini: dettagli[0]?.etaBambini || [], // Add this line
    };

    try {
      const response = await postTourQuote(logObject);
      const tourQuote = {
        ...response,
        etaBambini: dettagli[0]?.etaBambini || [], // Add this line
      };
      localStorage.setItem("tourQuote", JSON.stringify(tourQuote));
      localStorage.removeItem("linkQuote");
      navigate("/checkout");
    } catch (error) {
      console.error("Error posting tour quote:", error);
      toast.error(
        t(
          "Errore nella ricerca del tour. Riprova con un'altra data o contatta l'assistenza."
        )
      );
    }
    dispatch(stopLoading());
  };

  return {
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
  };
};
