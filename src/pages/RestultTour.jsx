import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postTourQuote } from "../_api/tourApi";
import { toast } from "react-toastify";

export const RestultTour = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const params = new URLSearchParams(location.search);
      const tour_id = params.get("tour_id");
      const departure_data = params.get("departure_data");
      const adulti = params.get("adulti");
      const bambini = params.get("bambini");
      const etaBambini = JSON.parse(params.get("etaBambini"));
      const animali = params.get("animali");
      const bagagli = params.get("bagagli");

      const data = {
        tour_id: parseInt(tour_id),
        data_departure: departure_data,
        animals: parseInt(animali),
        luggages: parseInt(bagagli),
        passengersAge: Array(parseInt(adulti)).fill({ age: 18 }),
        etaBambini: etaBambini.map((age) => ({ age: parseInt(age) })),
      };
      try {
        const response = await postTourQuote(data);
        const tourQuote = {
          ...response,
          etaBambini: etaBambini || [], // Add this line
        };
        localStorage.setItem("tourQuote", JSON.stringify(tourQuote));
        localStorage.removeItem("linkQuote");
        navigate("/checkout");
      } catch (error) {
        if (error.response && error.response.status === 500) {
          toast.error("Server error, please try again later.");
        } else {
          toast.error("Abbiamo riscontrato un errore, riprova più tardi.");
        }
      }
    };

    fetchData();
  }, [location.search]);

  return <div>{"Loading..."}</div>;
};
