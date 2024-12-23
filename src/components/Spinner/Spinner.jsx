import React from "react";
import "./Spinner.css";

export const Spinner = ({ active }) => {
  // Destructure active from props
  if (!active) {
    return null;
  }
  return (
    <div className="loader-cont">
      <div className="loader"></div>
    </div>
  );
};
