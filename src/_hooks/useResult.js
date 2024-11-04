import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setLoadingId,
  startLoading,
  stopLoading,
} from "../features/spinner/spinnerSlice";
import dayjs from "dayjs";
import { upsertResult } from "../features/viaggio/resultTratta";
import { useLocation } from "react-router-dom";
import {
  upsertDate,
  upsertDettagli,
  upsertTratta,
} from "../features/viaggio/findTratta";
import i18n from "../i18n"; // Import i18n to access the current language

export const useResult = () => {
  const dispatch = useDispatch();
  const { tratte, date, dettagli, multitratta } = useSelector(
    (state) => state.tratte
  );
  const { routes } = useSelector((state) => state.routes);
  const { results, selected } = useSelector((state) => state.resultsTratta);
  const { loadingId } = useSelector((state) => state.spinner);

  const [totalPrice, setTotalPrice] = React.useState(0);
  const [nTratte, setNTratte] = React.useState(0);
  const location = useLocation();
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };
  useEffect(() => {
    // Esegui la chiamata API
    const fetchPriceData = async (id) => {
      dispatch(startLoading());
      const formattedDate = dayjs(date[id]?.dateFormatted).format("YYYY-MM-DD");

      // Get the current language or default to 'it'
      const language = i18n.language || "it";

      try {
        const response = await fetch(
          `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/route/search?language=${language}&departure_route_id=${
            tratte[id]?.tratta.route_id
          }&departure_data=${encodeURIComponent(formattedDate)}`
        );
        const data = await response.json();
        dispatch(upsertResult({ id, data: data.timetableGoing }));
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(stopLoading(null));
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
        setTotalPrice((prev) => prev + item.prezzo);
      });
  }, [selected, tratte, date, dettagli]);

  useEffect(() => {
    const queryParams = getQueryParams(location.search);
    const departure_route_id = queryParams.get("departure_route_id");
    const departure_data = queryParams.get("departure_data");
    const return_route_id = queryParams.get("return_route_id");
    const return_data = queryParams.get("return_data");
    const adulti = queryParams.get("adulti");
    const bambini = queryParams.get("bambini");
    const etaBambini = queryParams.get("etaBambini");
    // Parse 'etaBambini' as an array
    const etaBambiniArray = JSON.parse(etaBambini);
    const animali = queryParams.get("animali");
    const bagagli = queryParams.get("bagagli");

    if (departure_route_id && departure_data) {
      const tratta = routes.find(
        (route) => route.route_id == departure_route_id
      );

      if (tratta) {
        const trattaFormatted = [`${tratta.from} -> ${tratta.to}`];
        const date = dayjs(departure_data);

        const dateString = date.toISOString();

        dispatch(
          upsertTratta({
            id: 0,
            tratta,
            trattaFormatted,
          })
        );
        dispatch(
          upsertDate({
            id: 0,
            dateFormatted: dateString,
            date: date, /// 2024-10-17T22:00:00.000Z
          })
        );
      }
    }
    if (return_route_id && return_data) {
      const tratta = routes.find((route) => route.route_id == return_route_id);
      setNTratte(1);
      console.log("tratta", tratta);
      if (tratta) {
        const trattaFormatted = [`${tratta.from} -> ${tratta.to}`];
        const date = dayjs(return_data);

        const dateString = date.toISOString();
        dispatch(
          upsertTratta({
            id: 1,
            tratta,
            trattaFormatted,
          })
        );

        dispatch(
          upsertDate({
            id: 1,
            dateFormatted: dateString,
            date: date, /// 2024-10-17T22:00:00.000Z
          })
        );
      }
    }

    if (adulti && bambini && etaBambini && animali && bagagli) {
      // localhost:3000/results?departure_route_id=1038&departure_data=2024-10-18&return_route_id=1038&return_data=2024-10-25&adulti=2&bambini=2&etaBambini=[1,2]&animali=1&bagagli=1
      dispatch(
        upsertDettagli({
          id: 0,
          adulti,
          bambini,
          etaBambini: etaBambiniArray,
          animali,
          bagagli,
        })
      );
      dispatch(
        upsertDettagli({
          id: 1,
          adulti,
          bambini,
          etaBambini: etaBambiniArray,
          animali,
          bagagli,
        })
      );
    }
  }, [routes]);

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
