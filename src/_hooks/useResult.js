import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import dayjs from "dayjs";
import { upsertResult } from "../features/viaggio/resultTratta";
import { useLocation, useNavigate } from "react-router-dom";
import {
  setNTratte,
  upsertDate,
  upsertDettagli,
  upsertTratta,
} from "../features/viaggio/findTratta";
import i18n from "../i18n"; // Import i18n to access the current language
import { setRoutes } from "../features/routes/routesSlice";
import { getRoute } from "../_api/colllegamenti/getRoute";
import { config } from "../config/config";
import { toast } from "react-toastify";

export const useResult = () => {
  const dispatch = useDispatch();
  const { tratte, date, dettagli, multitratta } = useSelector(
    (state) => state.tratte
  );

  const navigation = useNavigate();
  const { routes } = useSelector((state) => state.routes);
  const { results, selected } = useSelector((state) => state.resultsTratta);
  const { loadingId, loadingIds } = useSelector((state) => state.spinner);

  const [totalPrice, setTotalPrice] = React.useState(0);
  // const [nTratte, setNTratte] = React.useState(multitratta === false ? 1 : 0);
  const { nTratte } = useSelector((state) => state.tratte);
  const location = useLocation();
  const getQueryParams = (query) => {
    return new URLSearchParams(query);
  };

  // Aggiungi uno stato per il caching dei risultati
  const cacheRef = React.useRef({});

  // useEffect(() => {
  //   // Reset selected state when the component mounts
  //   dispatch(resetSelectedAll());
  // }, [dispatch]);

  useEffect(() => {
    // Esegui la chiamata API
    const fetchPriceData = async (id) => {
      dispatch(startLoading(id));
      const formattedDate = dayjs(date[id]?.dateFormatted).format("YYYY-MM-DD");

      // Get the current language or default to 'it'
      const language = i18n.language || "it";

      try {
        const response = await fetch(
          `${config.basePath}${
            config.fetchPriceData.route
          }?language=${language}&departure_route_id=${
            tratte[id]?.tratta.route_id
          }&departure_data=${encodeURIComponent(formattedDate)}`,
          { method: config.fetchPriceData.method }
        );
        if (response.status === 500) {
          throw new Error("Server error");
        }
        const data = await response.json();
        dispatch(upsertResult({ id, data: data.timetableGoing }));
      } catch (error) {
        console.error(error);
        dispatch(stopLoading(null));
        navigation("/"); // Redirect to the home page
        toast.error(
          error.message === "Server error"
            ? "Errore del server durante il recupero dei dati"
            : "Errore durante il recupero dei dati"
        );
      } finally {
        dispatch(stopLoading(id));
      }
    };

    if (tratte.length > 0 && date.length > 0) {
      Array.from({ length: nTratte + 1 }).forEach((_, index) => {
        const routeId = tratte[index]?.tratta?.route_id;
        const dateFormatted = date[index]?.dateFormatted;

        if (routeId && dateFormatted) {
          const cacheKey = `${routeId}-${dateFormatted}`;

          // Verifica se i dati sono già nel cache
          if (!cacheRef.current[cacheKey]) {
            fetchPriceData(index);
            // Salva i parametri nel cache
            cacheRef.current[cacheKey] = true;
          }
        }
      });
    }
  }, [tratte, date, nTratte]);

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
      if (routes.length === 0) {
        const fetchRoutes = async () => {
          const route = await getRoute();
          dispatch(setRoutes(route));
        };
        fetchRoutes();
      }
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
      // setNTratte(1);
      dispatch(setNTratte(1));
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
    loadingIds,
  };
};
