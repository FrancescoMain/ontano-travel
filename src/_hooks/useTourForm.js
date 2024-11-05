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
import dayjs from "dayjs";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { useNavigate } from "react-router-dom";

export const useTourForm = () => {
  const [ports, setPorts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      }
    };
    getPorts();
  }, []);

  useEffect(() => {
    const getTours = async () => {
      try {
        const data = await fetchTours();
        dispatch(setTours(data));
      } catch (error) {
        console.error("Error fetching tours:", error);
      }
    };
    getTours();
  }, [dispatch]);

  const handlePortChange = (event, value) => {
    const selectedPort = ports.find((port) => port.name === value);
    dispatch(setPort(selectedPort || { code: "", name: "" }));
  };

  const handleDateChange = (value) => {
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
      data_departure: dayjs(date).format("YYYY-MM-DD"),
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
      localStorage.removeItem("viaggioData");
      navigate("/checkout");
    } catch (error) {
      console.error("Error posting tour quote:", error);
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
