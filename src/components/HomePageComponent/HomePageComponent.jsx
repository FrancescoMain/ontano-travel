import React from "react";
import "./HomePageComponent.css";
import { FormViaggioComponent } from "../FormViaggioComponent";
import hero from "../../assets/hero.jpg";

export const HomePageComponent = () => {
  return (
    <div className="home-page overflow-auto">
      <div className="home-page-viaggio d-flex h-100 align-items-lg-center mt-2">
        <FormViaggioComponent />
      </div>
    </div>
  );
};
