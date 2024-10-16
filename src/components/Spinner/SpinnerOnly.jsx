import React from "react";
import "./Spinner.css";

export const SpinnerOnly = (active) => {
  if (!active.active) {
    return null;
  }
  return <div className="loader"></div>;
};
