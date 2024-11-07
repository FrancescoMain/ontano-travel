import React, { useEffect } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { HomePageComponent } from "../components/HomePageComponent/HomePageComponent";
import { fetchAccountData } from "../utils/auth";
import { resetTour } from "../features/tour/tourSlice"; // Import resetTour
import {
  resetResults,
  resetSelectedAll,
} from "../features/viaggio/resultTratta";
import { resetAll } from "../features/viaggio/findTratta";

export const HomePage = () => {
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    dispatch(resetTour()); // Dispatch resetTour action on mount
    dispatch(resetSelectedAll()); // Dispatch resetSelectedAll action on mount
    dispatch(resetResults()); // Dispatch resetResults action on mount
    dispatch(resetAll()); // Dispatch resetAll action on mount
  }, [dispatch]);

  return <HomePageComponent />;
};
