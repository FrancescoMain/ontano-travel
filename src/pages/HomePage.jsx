import React, { useEffect } from "react";
import { HomePageComponent } from "../components/HomePageComponent/HomePageComponent";
import { fetchAccountData } from "../utils/auth"; // Import fetchAccountData

export const HomePage = () => {
  return <HomePageComponent />;
};
