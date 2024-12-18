import React from "react";
import "./HomePageComponent.css";
import { FormViaggioComponent } from "../FormViaggioComponent";
import hero from "../../assets/hero.jpg";

export const HomePageComponent = () => {
  return (
    <div className="home-page overflow-auto">
      <div className="home-page-viaggio d-flex  ps-lg-4 pt-lg-2 ">
        <FormViaggioComponent />
      </div>
    </div>
  );
};
