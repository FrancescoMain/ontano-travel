import React from "react";
import "./Spinner.css";

export const Spinner = (active) => {
  console.log(active.active);
  if (!active.active) {
    return null;
  }
  return (
    <div class="loader-cont">
      <div class="loader"></div>;
    </div>
  );
};
