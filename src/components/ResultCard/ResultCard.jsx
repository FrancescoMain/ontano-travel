import React, { useEffect, useState } from "react";
import "./ResultCard.css";
import dayjs from "dayjs";
import { Typography } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../features/spinner/spinnerSlice";

export const ResultCard = ({ data, selected, onClick }) => {
  const [priceData, setPriceData] = useState(null);
  const { animali, bagagli, adulti, etaBambini } = useSelector(
    (state) => state.viaggioForm
  );

  const dispatch = useDispatch();

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

    // Esegui la chiamata API
    const fetchPriceData = async () => {
      dispatch(startLoading());
      const passengersAgeParams = [
        ...Array(adulti).fill(18), // Aggiungi 18 per ogni adulto
        ...etaBambini, // Aggiungi l'età di ogni bambino
      ]
        .map((age) => `passengers_age=${age}`)
        .join("&");
      try {
        const response = await fetch(
          `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/price/searchresult?search_result_id=${data.result_id}&animals=${animali}&luggages=${bagagli}&${passengersAgeParams}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setPriceData(result);
        dispatch(stopLoading());
      } catch (error) {
        console.error("Fetch error:", error);
        dispatch(stopLoading());
      }
    };
    console.log(priceData);
    fetchPriceData();
  }, [data]);

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
      <div className="card-container__right">
        <Typography color="primary" level="h2" noWrap={false} variant="plain">
          {priceData?.price} €
        </Typography>
      </div>
    </div>
  );
};
