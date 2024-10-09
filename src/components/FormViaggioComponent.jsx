import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button, Card, Tab, TabList, Tabs, Typography } from "@mui/joy";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFormViaggio,
  setDataAndata,
  setDataRitorno,
  setSoloAndata,
  setTrattaAndata,
  setTrattaRitorno,
} from "../features/viaggio/viaggioFormSlice";
import { ModalAnimals } from "./Modals/ModalAnimals/ModalAnimals";
import { ModalPassengers } from "./Modals/ModalPassengers/ModalPassengers";
import { ModalBagagli } from "./Modals/ModalBagagli/ModalBagagli";
import Autocomplete from "@mui/joy/Autocomplete";
import dayjs from "dayjs";
import "dayjs/locale/it";

export const FormViaggioComponent = () => {
  const [rotte, setRotte] = useState([]);
  const [fromLocations, setFromLocations] = useState([]);
  const [formAndata, setFormAndata] = useState("");
  const [formRitorno, setFormRitorno] = useState("");
  const [openModalPassengers, setOpenModalPassengers] = useState(false);
  const [openModalAnimals, setOpenModalAnimals] = useState(false);
  const [openModalBagagli, setOpenModalBagagli] = useState(false);
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

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const handleClickTab = (e) => {
    const value = e.target.textContent;
    setFormAndata("");
    setFormRitorno("");
    setDataAndataForm(null);
    setDataRitornoForm(null);
    dispatch(resetFormViaggio());
    if (value === "Solo andata") {
      dispatch(setSoloAndata(true));
    } else {
      dispatch(setSoloAndata(false));
    }
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
        const uniqueFromLocations = [
          ...new Set(data.map((route) => route.from + " -> " + route.to)),
        ];
        setFromLocations(uniqueFromLocations);
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
          sx={{ height: 56 }}
          onChange={handleChangeAndata}
          isOptionEqualToValue={(option, value) => option === value}
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
          sx={{ height: 56 }}
          onChange={handleChangeRitorno}
          isOptionEqualToValue={(option, value) => option === value}
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
        <Card
          className="passenger-card"
          sx={{ width: 160 }}
          color="neutral"
          invertedColors={false}
          orientation="vertical"
          size="sm"
          variant="outlined"
          onClick={() => setOpenModalPassengers(true)}
        >
          <Typography color="primary" level="h5" noWrap={false} variant="plain">
            {t("Passeggeri")}
          </Typography>
          <Typography
            color="neutral"
            level="body-sm"
            noWrap={false}
            variant="plain"
          >
            {t("Aggiungi passeggeri")}
          </Typography>
        </Card>

        <Card
          className="passenger-card"
          sx={{ width: 160 }}
          color="neutral"
          invertedColors={false}
          orientation="vertical"
          size="sm"
          variant="outlined"
          onClick={() => setOpenModalAnimals(true)}
        >
          <Typography color="primary" level="h5" noWrap={false} variant="plain">
            {t("Animali")}
          </Typography>
          <Typography
            color="neutral"
            level="body-sm"
            noWrap={false}
            variant="plain"
          >
            {t("Aggiungi animali")}
          </Typography>
        </Card>

        <Card
          className="passenger-card"
          sx={{ width: 160 }}
          color="neutral"
          invertedColors={false}
          orientation="vertical"
          size="sm"
          variant="outlined"
          onClick={() => setOpenModalBagagli(true)}
        >
          <Typography color="primary" level="h5" noWrap={false} variant="plain">
            {t("Bagagli")}
          </Typography>
          <Typography
            color="neutral"
            level="body-sm"
            noWrap={false}
            variant="plain"
          >
            {t("Aggiungi bagagli")}
          </Typography>
        </Card>
      </div>
      {adulti > 0 && (
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {"N. " + t("Adulti") + ": " + adulti}
        </Typography>
      )}
      {bambini > 0 && (
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {"N. " + t("Bambini") + ": " + bambini}
        </Typography>
      )}
      {animali > 0 && (
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {"N. " + t("Animali") + ": " + animali}
        </Typography>
      )}
      {bagagli > 0 && (
        <Typography
          color="neutral"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {"N. " + t("Bagagli") + ": " + bagagli}
        </Typography>
      )}
      <Button
        disabled={buttonDisabled}
        variant="soft"
        color="neutral"
        size="lg"
        onClick={handleClickSearch}
      >
        {t("Cerca")}
      </Button>
      <ModalPassengers
        open={openModalPassengers}
        setOpen={setOpenModalPassengers}
      />
      <ModalAnimals open={openModalAnimals} setOpen={setOpenModalAnimals} />

      <ModalBagagli open={openModalBagagli} setOpen={setOpenModalBagagli} />
    </Card>
  );
};
