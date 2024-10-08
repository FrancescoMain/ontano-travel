import React from "react";
import "./HomePageComponent.css";
import { FormViaggioComponent } from "../FormViaggioComponent";

export const HomePageComponent = () => {
  return (
    <div className="home-page">
      <div className="home-page-viaggio">
        <FormViaggioComponent />
      </div>
    </div>
  );
};
