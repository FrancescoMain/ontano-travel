import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { Button, Card, Input, Tab, TabList, Tabs, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFormViaggio,
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
import Autocomplete from "@mui/joy/Autocomplete";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { matchSorter } from "match-sorter";

export const FormViaggioComponent = () => {
  const [rotte, setRotte] = useState([]);
  const [fromLocations, setFromLocations] = useState([]);
  const [formAndata, setFormAndata] = useState("");
  const [formRitorno, setFormRitorno] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [dataAndataForm, setDataAndataForm] = useState(null);
  const [dataRitornoForm, setDataRitornoForm] = useState(null);
  const [option, setOption] = useState(null);
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

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const etaBambinoString = t("Inserire età bambino");
  const filterOptions = (options, { inputValue }) => {
    return matchSorter(options, inputValue, { keys: ["value"] });
  };

  const handleClickTab = (e) => {
    const value = e.target.textContent;

    if (value === "Solo andata") {
      dispatch(setSoloAndata(true));
      dispatch(setTrattaRitorno(""));
      dispatch(setDataRitorno(""));
      setDataRitornoForm(null);
      setFormRitorno("");
    } else {
      dispatch(setSoloAndata(false));
    }
  };

  const handleChangeAdulti = (e) => {
    const value = e.target.value;
    dispatch(setAdulti(value));
  };

  const handleChangeBambini = (e) => {
    const value = e.target.value;
    dispatch(setBambini(value));
    // eta bambini viene tagliato dall'index che coincide con value
    if (value < bambini) {
      dispatch(setEtaBambini(etaBambini.slice(0, value)));

      return;
    }
  };
  const handleChangeAnimali = (e) => {
    const value = e.target.value;
    dispatch(setAnimali(value));
  };

  const handleChangeBagagli = (e) => {
    const value = e.target.value;
    dispatch(setBagagli(value));
  };

  const handleChangeAndata = (e) => {
    const value = e?.target?.textContent;
    const [from, to] = value.split(" -> ");
    const route = rotte.filter(
      (route) => route.from === from && route.to === to
    );
    const uniqueFromLocations = [
      ...new Set(route.map((route) => route.from + " -> " + route.to)),
    ];

    setFormAndata(uniqueFromLocations[0]);
    dispatch(setTrattaAndata(route[0]));
    if (!soloAndata) {
      const routeRitorno = rotte.filter(
        (route) => route.from === to && route.to === from
      );
      const uniqueToLocations = [
        ...new Set(route.map((route) => route.to + " -> " + route.from)),
      ];
      setFormRitorno(uniqueToLocations[0]);
      dispatch(setTrattaRitorno(routeRitorno[0]));
    }
  };

  const handleChangeRitorno = (e) => {
    const value = e?.target?.textContent;
    const [from, to] = value.split(" -> ");
    const route = rotte.filter(
      (route) => route.from === from && route.to === to
    );
    const uniqueFromLocations = [
      ...new Set(route.map((route) => route.from + " -> " + route.to)),
    ];

    setFormRitorno(uniqueFromLocations[0]);
    dispatch(setTrattaRitorno(route[0]));
  };

  const handleChangeDataA = (e) => {
    const dateString = e.toISOString(); // Converti l'oggetto Date in una stringa ISO
    dispatch(setDataAndata(dateString));
    setDataAndataForm(e);
  };

  const handleChangeDataB = (e) => {
    const dateString = e.toISOString(); // Converti l'oggetto Date in una stringa ISO
    dispatch(setDataRitorno(dateString));
    setDataRitornoForm(e);
  };

  const handleClickSearch = () => {
    console.log("Partenza", trattaAndata);
    console.log("Ritorno", trattaRitorno);
    console.log("Data partenza", dataAndata);
    console.log("Data ritorno", dataRitorno);
    console.log("Adulti", adulti);
    console.log("Bambini", bambini);
    console.log("Età bambini", etaBambini);
    console.log("Animali", animali);
    console.log("Bagagli", bagagli);
  };
  useEffect(() => {
    fetch("https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/route")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setRotte(data);
        const locations = data.map((route) => {
          const fromNames = route.from.split(" ");
          const toNames = route.to.split(" ");
          const allNames = [...fromNames, ...toNames];
          return {
            value: allNames.join(" "),
            label: `${route.from} -> ${route.to}`,
          };
        });
        setFromLocations(locations);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  useEffect(() => {
    // Controlla se tutti i campi di età dei bambini sono compilati
    if (soloAndata) {
      const soloAndata = trattaAndata && dataAndata;
      setButtonDisabled(!soloAndata);
    } else {
      const andata = trattaAndata && dataAndata;
      const ritorno = trattaRitorno && dataRitorno;
      setButtonDisabled(!andata || !ritorno);
    }
  }, [trattaAndata, dataAndata, trattaRitorno, dataRitorno, soloAndata]);
  return (
    <Card
      className="card-viaggio"
      color="white"
      orientation="vertical"
      size="lg"
      variant="soft"
    >
      <Tabs
        defaultValue={"andata-ritorno"}
        orientation="horizontal"
        onChange={handleClickTab}
      >
        <TabList className="tablist-viaggio" disableUnderline>
          <Tab
            className="tab-viaggio"
            sx={{ width: 320 }}
            variant="outlined"
            color="neutral"
            value={"andata-ritorno"}
            disableIndicator
          >
            {t("Andata e ritorno")}
          </Tab>
          <Tab
            className="tab-viaggio"
            sx={{ width: 320 }}
            variant="outlined"
            color="neutral"
            value={"solo-andata"}
            disableIndicator
          >
            {t("Solo andata")}
          </Tab>
        </TabList>
      </Tabs>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Viaggio di andata")}
      </Typography>
      <div className="row-cont">
        <Autocomplete
          value={formAndata}
          className="select-viaggio"
          placeholder={t("Seleziona una tratta")}
          options={fromLocations}
          filterOptions={filterOptions}
          sx={{ height: 56 }}
          onChange={handleChangeAndata}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <DatePicker
            label={t("Data di partenza")}
            inputFormat="DD/MM/YYYY"
            value={dataAndataForm}
            minDate={dayjs()}
            onChange={handleChangeDataA}
            sx={{ height: 70 }}
            className="date-picker"
          />
        </LocalizationProvider>
      </div>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Viaggio di ritorno")}
      </Typography>
      <div className="row-cont">
        <Autocomplete
          className="select-viaggio"
          placeholder={t("Seleziona una tratta")}
          options={fromLocations}
          disabled={soloAndata}
          value={formRitorno}
          filterOptions={filterOptions}
          sx={{ height: 56 }}
          onChange={handleChangeRitorno}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <DatePicker
            label={t("Data di ritorno")}
            inputFormat="DD/MM/YYYY"
            onChange={handleChangeDataB}
            value={dataRitornoForm || null}
            disabled={soloAndata}
            minDate={dataAndataForm || dayjs()}
            sx={{ height: 70, backgroundColor: soloAndata ? "white" : "" }}
            className="date-picker"
          />
        </LocalizationProvider>
      </div>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Dettagli viaggio")}
      </Typography>
      <div className="row-cont__detail">
        <div className="select-detail-cont">
          <label htmlFor="adults">{t("Adulti")}</label>

          <select
            value={adulti}
            onChange={handleChangeAdulti}
            id="adults"
            className="select-detail"
          >
            {Array.from({ length: 9 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <Typography
            color="neutral"
            level="body-xs"
            noWrap={false}
            variant="plain"
          >
            {t("Oltre i 12 anni")}
          </Typography>
        </div>
        <div className="select-detail-cont">
          <label htmlFor="children">{t("Bambini")}</label>

          <select
            value={bambini}
            onChange={handleChangeBambini}
            id="children"
            className="select-detail"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <Typography
            color="neutral"
            level="body-xs"
            noWrap={false}
            variant="plain"
          >
            {t("Fino agli 11 anni")}
          </Typography>
        </div>
        <div className="select-detail-cont">
          <label htmlFor="animals">{t("Animali Domestici")}</label>

          <select
            value={animali}
            onChange={handleChangeAnimali}
            id="animals"
            className="select-detail"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>

        <div className="select-detail-cont">
          <label htmlFor="bagagli">{t("Bagagli")}</label>

          <select
            value={bagagli}
            onChange={handleChangeBagagli}
            id="bagagli"
            className="select-detail"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {bambini > 0 && (
        <Typography
          color="primary"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {t("Inserire età bambini")}
        </Typography>
      )}
      {Array.from({ length: bambini }).map((_, index) => (
        <Input
          onChange={(e) => {
            if (e.target.value > 11) {
              e.target.value = 11;
            }
            if (e.target.value < 0) {
              e.target.value = 0;
            }
            const newChildrenAge = [...etaBambini];
            newChildrenAge[index] = e.target.value;
            dispatch(setEtaBambini(newChildrenAge));
          }}
          value={etaBambini[index] || ""}
          type="number"
          key={index}
          color="neutral"
          placeholder={`${etaBambinoString} ${index + 1}`}
          variant="outlined"
          className="input-eta"
        />
      ))}

      <Button
        disabled={buttonDisabled}
        variant="soft"
        color="neutral"
        size="lg"
        onClick={handleClickSearch}
      >
        {t("Cerca")}
      </Button>
    </Card>
  );
};
