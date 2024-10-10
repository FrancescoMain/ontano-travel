import React, { useEffect } from "react";
import "./ResultCard.css";
import dayjs from "dayjs";
import { Typography } from "@mui/joy";

export const ResultCard = ({ data, selected, onClick }) => {
  const departureDate = dayjs(data.departure);
  const dateDep = departureDate.format("DD/MM/YYYY");
  const timeDep = departureDate.format("HH:mm");
  const arrivalDate = dayjs(data.arrive);
  const dateArr = arrivalDate.format("DD/MM/YYYY");
  const timeArr = arrivalDate.format("HH:mm");
  const diffInMilliseconds = arrivalDate.diff(departureDate);

  // Converti la differenza in ore e minuti
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  useEffect(() => {
    console.log("ResultCard rendered");
    console.log("data", data);
  }, []);
  return (
    <div
      className={`card-container ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="card-container__left">
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {dateDep}
        </Typography>
        <Typography color="primary" level="h4" noWrap={false} variant="plain">
          {timeDep}
        </Typography>
        <Typography color="neutral" level="h4" noWrap={false} variant="plain">
          {data.fromPort}
        </Typography>
      </div>
      <div className="card-container__center">
        <Typography color="neutral" level="h4" noWrap={false} variant="plain">
          {data.company}
        </Typography>
        <Typography
          color="neutral"
          level="body-sm"
          noWrap={false}
          variant="plain"
        >
          ----------
        </Typography>
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {hours}h {minutes}m
        </Typography>
      </div>
      <div className="card-container__right">
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {dateArr}
        </Typography>
        <Typography color="primary" level="h4" noWrap={false} variant="plain">
          {timeArr}
        </Typography>
        <Typography color="neutral" level="h4" noWrap={false} variant="plain">
          {data.fromTo}
        </Typography>
      </div>
    </div>
  );
};
