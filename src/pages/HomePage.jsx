import React, { useEffect } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { HomePageComponent } from "../components/HomePageComponent/HomePageComponent";
import { resetTour } from "../features/tour/tourSlice"; // Import resetTour
import {
  resetResults,
  resetSelectedAll,
} from "../features/viaggio/resultTratta";
import { resetAll } from "../features/viaggio/findTratta";
import Cookies from "js-cookie"; // Import js-cookie

export const HomePage = () => {
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codice = urlParams.get('yafl');
    if (codice) {
      Cookies.set('codice', codice, { expires: 48 });
    }

    dispatch(resetTour()); // Dispatch resetTour action on mount
    dispatch(resetSelectedAll()); // Dispatch resetSelectedAll action on mount
    dispatch(resetResults()); // Dispatch resetResults action on mount
    dispatch(resetAll()); // Dispatch resetAll action on mount
    localStorage.removeItem("tourQuote");
    localStorage.removeItem("linkQuote");
    localStorage.removeItem("viaggioData");
  }, [dispatch]);

  return <HomePageComponent />;
};
