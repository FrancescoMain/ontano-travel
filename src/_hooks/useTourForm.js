import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPorts, fetchTours, postTourQuote } from "../_api/tourApi";
import {
  setPort,
  setDate,
  setTour,
  setTours,
  resetTour,
  filterToursByPort,
  setDettagli, // Add this line
} from "../features/tour/tourSlice";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import ReactGA from "react-ga4"; // Add this line

export const useTourForm = () => {
  const { t } = useTranslation();
  const [ports, setPorts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation
  const { port, date, tour, tours, filteredTours } = useSelector(
    (state) => state.tour
  );
  const dettagli = useSelector((state) => state.tour.dettagli);
  const [loading, setLoading] = useState();

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
        // if (data.length === 0) {
        //   toast.info("Nessun tour trovato. No tours found.");
        // }
        dispatch(setTours(data));
      } catch (error) {
        console.error("Error fetching tours:", error);
        toast.error("Errore nel recupero dei tour. Please try again.");
      }
    };
    getTours();
  }, [dispatch]);

  // http://localhost:3000/?tour_id=22201&departure_data=2025-01-30&adulti=2&bambini=2&etaBambini=[1,5]&animali=1&toCheckout=true

  const handleChange = (newDettagli) => {
    const id = 0;
    dispatch(setDettagli({ id, dettagli: newDettagli }));
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tourId = params.get("tour_id");
    const departureDate = params.get("departure_data");
    const adulti = params.get("adulti");
    const bambini = params.get("bambini");
    const etaBambini = JSON.parse(params.get("etaBambini"));
    const animali = params.get("animali");

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
    let newDettagli;
    if (adulti) {
      newDettagli = { ...dettagli[0], adulti: parseInt(adulti) };
    }
    if (bambini) {
      newDettagli = { ...newDettagli, bambini: parseInt(bambini) };
      if (etaBambini) {
        newDettagli = { ...newDettagli, etaBambini: etaBambini };
      }
    }
    if (animali) {
      newDettagli = { ...newDettagli, animali: parseInt(animali) };
    }

    handleChange(newDettagli);
  }, [location.search, tours, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const toCheckout = params.get("toCheckout");

    if (toCheckout === "true") {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const toCheckout = params.get("toCheckout");

    if (toCheckout === "true" && port && date) {
      setLoading(true);
      handleSubmit();
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [port, date, tour, location.search]);

  const handlePortChange = (event, value) => {
    const selectedPort = ports.find((port) => port.name === value);
    dispatch(setPort(selectedPort || { code: "", name: "" }));
    if (selectedPort) {
      dispatch(filterToursByPort());
    } else {
      dispatch(setTours(tours)); // Reset filteredTours to all tours
    }
  };

  const handleDateChange = (value) => {
    dispatch(setDate(value));
  };

  const handleTourChange = (event, value) => {
    dispatch(setTour(value));
    ReactGA.event({
      category: "search-tour",
      action: "search-tour",
      label: value,
    });
  };

  const resetHandle = () => {
    dispatch(resetTour());
  };

  const handleSubmit = async () => {
    dispatch(startLoading());
    const selectedTour = tours.find((t) => t.name === tour)?.id;
    const animali = dettagli[0]?.animali || 0;
    const passengers = [
      ...Array(dettagli[0]?.adulti || 0).fill({ age: 18 }),
      ...(dettagli[0]?.etaBambini || []).map((eta) => ({ age: eta })),
    ];
    console.log(passengers);
    const formattedDate = encodeURIComponent(dayjs(date).format("YYYY-MM-DD")); // Use encodeURIComponent
    const logObject = {
      tour_id: selectedTour,
      data_departure: formattedDate, // Use encoded date here
      animals: animali,
      passengersAge: passengers[0] ? passengers : [{ age: 18 }],
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
          "Nessun Tour trovato. Riprova con un'altra data o contatta l'assistenza."
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
    filteredTours, // Add this line
    dettagli,
    handlePortChange,
    handleDateChange,
    handleTourChange,
    resetHandle,
    handleSubmit,
    loading,
  };
};
