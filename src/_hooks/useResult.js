import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingId,
  startLoading,
  stopLoading,
} from "../features/spinner/spinnerSlice";
import dayjs from "dayjs";
import { upsertResult } from "../features/viaggio/resultTratta";

export const useResult = () => {
  const dispatch = useDispatch();
  const { tratte, date, dettagli, multitratta } = useSelector(
    (state) => state.tratte
  );
  const { results, selected } = useSelector((state) => state.resultsTratta);
  const { loadingId } = useSelector((state) => state.spinner);
  const [totalPrice, setTotalPrice] = React.useState(0);
  const [nTratte, setNTratte] = React.useState(0);

  useEffect(() => {
    // Esegui la chiamata API
    const fetchPriceData = async (id) => {
      console.log(id);
      dispatch(setLoadingId(id));
      const formattedDate = dayjs(date[id]?.dateFormatted).format("YYYY-MM-DD");

      try {
        const response = await fetch(
          `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/route/search?departure_route_id=${
            tratte[id]?.tratta.route_id
          }&departure_data=${encodeURIComponent(formattedDate)}`
        );
        const data = await response.json();
        dispatch(upsertResult({ id, data: data.timetableGoing }));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setLoadingId(null));
      }
    };
    if (tratte.length > 0 && date.length > 0) {
      tratte.forEach((_, index) => {
        if (tratte[index]?.tratta && date[index]?.dateFormatted) {
          fetchPriceData(index);
        }
      });
    }
  }, [tratte, date, dispatch]);

  useEffect(() => {
    setTotalPrice(0);
    selected
      .filter((item) => item.prezzo !== undefined && item.prezzo !== null)
      .forEach((item) => {
        console.log(item);
        setTotalPrice((prev) => prev + item.prezzo);
      });
  }, [selected, tratte, date, dettagli]);

  return {
    results,
    loadingId,
    selected,
    totalPrice,
    multitratta,
    nTratte,
    setNTratte,
  };
};
