import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPorts, fetchTours } from "../_api/tourApi";
import {
  setPort,
  setDate,
  setTour,
  setTours,
  resetTour,
} from "../features/tour/tourSlice";

export const useTourForm = () => {
  const [ports, setPorts] = useState([]);
  const dispatch = useDispatch();
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
  };
};
