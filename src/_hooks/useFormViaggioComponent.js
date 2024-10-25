import {
  setAdulti,
  setAnimali,
  setBagagli,
  setBambini,
  setDataAndata,
  setDataRitorno,
  setEtaBambini,
  setSoloAndata,
  setTrattaAndata,
  setTrattaRitorno,
} from "../features/viaggio/viaggioFormSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";
import { useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { getRoute } from "../_api/colllegamenti/getRoute";
import { setRoutes } from "../features/routes/routesSlice";
import {
  removeDate,
  removeDettagli,
  removeTratta,
  setMultitratta,
  upsertDate,
  upsertDettagli,
  upsertTratta,
} from "../features/viaggio/findTratta";

export const useFormViaggioComponent = () => {
  //REFACORING MULTITRATTAù
  const { t } = useTranslation();

  const [tab, setTab] = useState(t("Collegamento"));
  const [rotte, setRotte] = useState([]);
  const [fromLocations, setFromLocations] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Solo andata");

  const { tratte, date, dettagli, multitratta } = useSelector(
    (state) => state.tratte
  );

  const { selected } = useSelector((state) => state.resultsTratta);

  const handleOptionChange = (event) => {
    let dueTratte = true;
    console.log("event.target.value", event.target.value);
    if (event.target.value === selectedOption) {
      setSelectedOption("Solo andata");
      dueTratte = true;
    } else {
      if (event.target.value === "Andata e ritorno") {
        dueTratte = false;
        setSelectedOption("Andata e ritorno");
      } else if (event.target.value === "Multitratta") {
        dueTratte = true;
        setSelectedOption("Multitratta");
      }
    }

    if (dueTratte) {
      dispatch(setMultitratta(true));
      dispatch(removeTratta(1));
      dispatch(removeDate(1));
      dispatch(removeDettagli(1));
    } else {
      const findRoute = rotte.filter(
        (route) =>
          route.from === tratte[0]?.tratta?.to &&
          route.to === tratte[0]?.tratta?.from
      );
      const findeeFormatted = [
        ...new Set(findRoute.map((route) => route.from + " -> " + route.to)),
      ];
      dispatch(setMultitratta(false));
      dispatch(
        upsertTratta({
          id: 1,
          tratta: findRoute[0],
          trattaFormatted: findeeFormatted,
        })
      );
      dispatch(
        upsertDate({
          id: 1,
          date: date[0]?.date,
          dateFormatted: date[0]?.dateFormatted,
        })
      );
      dispatch(
        upsertDettagli({
          id: 1,
          adulti: dettagli[0]?.adulti,
          bambini: dettagli[0]?.bambini,
          etaBambini: dettagli[0]?.etaBambini,
          animali: dettagli[0]?.animali,
          bagagli: dettagli[0]?.bagagli,
        })
      );
    }
  };

  const [formAndata, setFormAndata] = useState("");
  const [formRitorno, setFormRitorno] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [dataAndataForm, setDataAndataForm] = useState(null);
  const [dataRitornoForm, setDataRitornoForm] = useState(null);
  const {
    trattaAndata,
    dataAndata,
    soloAndata,
    trattaRitorno,
    dataRitorno,
    bambini,
    adulti,
    etaBambini,
    animali,
    bagagli,
  } = useSelector((state) => state.viaggioForm);

  const { routes } = useSelector((state) => state.routes);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const etaBambinoString = t("Inserire età bambino");
  const filterOptions = (options, { inputValue }) => {
    return matchSorter(options, inputValue, { keys: ["value"] });
  };

  const handleClickTab = (e) => {
    const value = e.target.textContent;
    setTab(value);
  };

  const handleChangeAdulti = (e, id) => {
    const value = e.target.value;
    dispatch(upsertDettagli({ id, adulti: value }));
    dispatch(upsertDettagli({ id: id + 1, adulti: value }));
    if (!multitratta && id === 0) {
      dispatch(upsertDettagli({ id: 1, adulti: value }));
    }
  };

  const handleChangeBambini = (e, id) => {
    const value = e.target.value;
    // dispatch(setBambini(value));
    dispatch(upsertDettagli({ id, bambini: value }));
    dispatch(upsertDettagli({ id: id + 1, bambini: value }));

    if (!multitratta && id === 0) {
      dispatch(upsertDettagli({ id: 1, bambini: value }));
      if (value < dettagli[1].etaBambini.length) {
        dispatch(
          upsertDettagli({
            id,
            etaBambini: dettagli[1].etaBambini.slice(0, value),
          })
        );
      }
      // eta bambini viene tagliato dall'index che coincide con value
      if (value < dettagli[id].etaBambini.length) {
        dispatch(
          upsertDettagli({
            id,
            etaBambini: dettagli[id].etaBambini.slice(0, value),
          })
        );

        return;
      }
    }
  };
  const handleChangeAnimali = (e, id) => {
    const value = e.target.value;
    dispatch(upsertDettagli({ id, animali: value }));
    dispatch(upsertDettagli({ id: id + 1, animali: value }));

    if (!multitratta && id === 0) {
      dispatch(upsertDettagli({ id: 1, animali: value }));
    }
  };

  const handleChangeBagagli = (e, id) => {
    const value = e.target.value;
    dispatch(upsertDettagli({ id, bagagli: value }));
    dispatch(upsertDettagli({ id: id + 1, bagagli: value }));
    if (!multitratta && id === 0) {
      dispatch(upsertDettagli({ id: 1, bagagli: value }));
    }
  };

  const handleChangeAndata = (e, id) => {
    const value = e?.target?.textContent;
    const [from, to] = value.split(" -> ");
    const route = rotte.filter(
      (route) => route.from === from && route.to === to
    );
    const uniqueFromLocations = [
      ...new Set(route.map((route) => route.from + " -> " + route.to)),
    ];

    // setFormAndata(uniqueFromLocations[0]);
    // dispatch(setTrattaAndata(route[0]));
    dispatch(
      upsertTratta({
        id,
        tratta: route[0],
        trattaFormatted: uniqueFromLocations,
      })
    );

    const routeRitorno = rotte.filter(
      (route) => route.from === to && route.to === from
    );
    const uniqueToLocations = [
      ...new Set(route.map((route) => route.to + " -> " + route.from)),
    ];
    // setFormRitorno(uniqueToLocations[0]);
    // dispatch(setTrattaRitorno(routeRitorno[0]));
    dispatch(
      upsertTratta({
        id: id + 1,
        tratta: routeRitorno[0],
        trattaFormatted: uniqueToLocations,
      })
    );
  };

  const handleChangeRitorno = (e, id) => {
    const value = e?.target?.textContent;
    const [from, to] = value.split(" -> ");
    const route = rotte.filter(
      (route) => route.from === from && route.to === to
    );
    const uniqueFromLocations = [
      ...new Set(route.map((route) => route.from + " -> " + route.to)),
    ];
    // setFormRitorno(uniqueFromLocations[0]);
    // dispatch(setTrattaRitorno(route[0]));
    dispatch(
      upsertTratta({
        id,
        tratta: route[0],
        trattaFormatted: uniqueFromLocations,
      })
    );
  };
  const handleChangeDataA = (e, id) => {
    const date = dayjs(e);
    const today = dayjs();

    if (date.isValid() && date.isSameOrAfter(today, "day")) {
      const dateString = date.toISOString(); // Converti l'oggetto Date in una stringa ISO
      // dispatch(setDataAndata(dateString));
      // dispatch(setDataRitorno(dateString));
      // setDataAndataForm(date);
      // setDataRitornoForm(date);
      if (!multitratta) {
        dispatch(upsertDate({ id: 0, date: date, dateFormatted: dateString }));
        dispatch(upsertDate({ id: 1, date: date, dateFormatted: dateString }));
      } else {
        dispatch(upsertDate({ id, date: date, dateFormatted: dateString }));
        dispatch(
          upsertDate({ id: id + 1, date: date, dateFormatted: dateString })
        );
      }
    } else {
      // Gestisci il caso in cui la data non è valida
      console.error("Invalid date");
    }
  };

  const handleChangeDataB = (e) => {
    const date = dayjs(e);
    const today = dayjs();

    if (date.isValid() && date.isSameOrAfter(today, "day")) {
      const dateString = date.toISOString(); // Converti l'oggetto Date in una stringa ISO
      // dispatch(setDataRitorno(dateString));
      // setDataRitornoForm(date);
      dispatch(upsertDate({ id: 1, date: date, dateFormatted: dateString }));
    } else {
      // Gestisci il caso in cui la data non è valida
      console.error("Invalid date");
    }
  };

  const handleClickSearch = () => {
    navigate("/results");
  };

  useEffect(() => {
    const fetchRotte = async () => {
      if (routes.length > 0) {
        // Se le rotte sono già presenti, non fare la chiamata API
        setRotte(routes);
        const locations = routes.map((route) => {
          const fromNames = route.from.split(" ");
          const toNames = route.to.split(" ");
          const allNames = [...fromNames, ...toNames];
          return {
            value: allNames.join(" "),
            label: `${route.from} -> ${route.to}`,
          };
        });
        setFromLocations(locations);
        return;
      }

      dispatch(startLoading());
      try {
        const route = await getRoute();
        dispatch(setRoutes(route));
        setRotte(route);
        const locations = route.map((route) => {
          const fromNames = route.from.split(" ");
          const toNames = route.to.split(" ");
          const allNames = [...fromNames, ...toNames];
          return {
            value: allNames.join(" "),
            label: `${route.from} -> ${route.to}`,
          };
        });
        setFromLocations(locations);
      } catch (error) {
        console.error("Error fetching routes:", error);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchRotte();
  }, [dispatch, routes]);

  useEffect(() => {
    // const allAgesFilled =
    //   bambini == 0 ||
    //   (etaBambini.length == bambini && etaBambini.every((age) => age !== ""));
    const allAgesFilledArray = dettagli.map((dettaglio) => {
      return (
        dettaglio?.etaBambini?.length == dettaglio.bambini &&
        dettaglio?.etaBambini?.every((age) => age !== "")
      );
    });
    const allAgesFilled = allAgesFilledArray.every((age) => age);

    const allTratteFlled = tratte.every((tratta) => tratta.tratta);
    const allDateFilled = date.every((date) => date.date);

    // Controlla se tutti i campi di età dei bambini sono compilati
    if (multitratta) {
      const soloAndataValid = allTratteFlled && allDateFilled && allAgesFilled;
      setButtonDisabled(!soloAndataValid);
    } else {
      const soloAndataValid = allTratteFlled && allDateFilled && allAgesFilled;
      setButtonDisabled(!soloAndataValid);
    }
  }, [
    trattaAndata,
    dataAndata,
    trattaRitorno,
    dataRitorno,
    soloAndata,
    bambini,
    etaBambini,
    dettagli,
    tratte,
    date,
  ]);

  return {
    t,
    formAndata,
    fromLocations,
    filterOptions,
    handleChangeAndata,
    dataAndataForm,
    handleChangeDataA,
    soloAndata,
    formRitorno,
    handleChangeRitorno,
    dataRitornoForm,
    handleChangeDataB,
    adulti,
    handleChangeAdulti,
    bambini,
    handleChangeBambini,
    etaBambini,
    handleChangeAnimali,
    animali,
    handleChangeBagagli,
    bagagli,
    buttonDisabled,
    handleClickSearch,
    dispatch,
    etaBambinoString,
    handleClickTab,
    tab,
    routes,
    tratte,
    date,
    dettagli,
    selectedOption,
    handleOptionChange,
    selected,
    multitratta,
  };
};
