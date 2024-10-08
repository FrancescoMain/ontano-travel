import { useTranslation } from "react-i18next";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Button,
  Card,
  Option,
  Select,
  Tab,
  TabList,
  Tabs,
  Typography,
} from "@mui/joy";
import React, { useState, useEffect } from "react";
import { ModalPassengers } from "./ModalPassengers/ModalPassengers";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFormViaggio,
  setDataAndata,
  setDataRitorno,
  setSoloAndata,
  setTrattaAndata,
  setTrattaRitorno,
} from "../features/viaggio/viaggioFormSlice";

export const FormViaggioComponent = () => {
  const [rotte, setRotte] = useState([]);
  const [fromLocations, setFromLocations] = useState([]);
  const [fromLocationsA, setFromLocationsA] = useState("");
  const [fromLocationsR, setFromLocationsR] = useState("");
  const [toLocationsA, setToLocationsA] = useState([]);
  const [toLocationsR, setToLocationsR] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const {
    trattaAndata,
    dataAndata,
    soloAndata,
    trattaRitorno,
    dataRitorno,
    bambini,
    adulti,
    etaBambini,
  } = useSelector((state) => state.viaggioForm);

  const dispatch = useDispatch();

  const { t } = useTranslation();
  const handleClickTab = (e) => {
    const value = e.target.textContent;
    setToLocationsA([]);
    setToLocationsR([]);
    setFromLocationsA("");
    setFromLocationsR("");
    dispatch(resetFormViaggio());
    if (value === "Solo andata") {
      dispatch(setSoloAndata(true));
    } else {
      dispatch(setSoloAndata(false));
    }
  };

  const handleFromLocationChangeA = (e) => {
    setFromLocationsA(e?.target?.textContent);
    const value = e?.target?.textContent;
    const route = rotte.filter((route) => route.from === value);
    const uniqueToLocations = [...new Set(route.map((route) => route.to))];
    setToLocationsA(uniqueToLocations);
  };

  const handleFromLocationChangeR = (e) => {
    setFromLocationsR(e?.target?.textContent);
    const value = e?.target?.textContent;
    const route = rotte.filter((route) => route.to === value);
    const uniqueFromLocations = [...new Set(route.map((route) => route.from))];
    setToLocationsR(uniqueFromLocations);
  };

  const handleToLocationChangeA = (e) => {
    //devo cercare da data la tratta che contiene sia la location di partenza che quella di arrivo
    const value = e?.target?.textContent;
    const route = rotte.filter(
      (route) => route.from === fromLocationsA && route.to === value
    );

    dispatch(setTrattaAndata(route[0]));
  };

  const handleToLocationChangeR = (e) => {
    //devo cercare da data la tratta che contiene sia la location di partenza che quella di arrivo
    const value = e?.target?.textContent;
    const route = rotte.filter(
      (route) => route.from === fromLocationsR && route.to === value
    );
    dispatch(setTrattaRitorno(route[0]));
  };

  const handleChangeDataA = (e) => {
    const dateString = e.toISOString(); // Converti l'oggetto Date in una stringa ISO
    dispatch(setDataAndata(dateString));
  };

  const handleChangeDataB = (e) => {
    const dateString = e.toISOString(); // Converti l'oggetto Date in una stringa ISO
    dispatch(setDataRitorno(dateString));
  };

  const handleClickSearch = () => {
    console.log("Partenza", trattaAndata);
    console.log("Ritorno", trattaRitorno);
    console.log("Data partenza", dataAndata);
    console.log("Data ritorno", dataRitorno);
    console.log("Adulti", adulti);
    console.log("Bambini", bambini);
    console.log("Età bambini", etaBambini);
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
          ...new Set(data.map((route) => route.from)),
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
      color="neutral"
      orientation="vertical"
      size="lg"
      variant="soft"
    >
      <Tabs
        defaultValue={"andata-ritorno"}
        orientation="horizontal"
        onChange={handleClickTab}
      >
        <TabList>
          <Tab
            sx={{ width: 320 }}
            variant="soft"
            color="primary"
            value={"andata-ritorno"}
          >
            {t("Andata e ritorno")}
          </Tab>
          <Tab
            sx={{ width: 320 }}
            variant="soft"
            color="primary"
            value={"solo-andata"}
          >
            {t("Solo andata")}
          </Tab>
        </TabList>
      </Tabs>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Viaggio di andata")}
      </Typography>
      <div className="row-cont">
        <Select
          className="select-viaggio"
          sx={{ height: 55 }}
          color="primary"
          placeholder={t("Destinazione")}
          variant="soft"
          value={fromLocationsA || ""}
          onChange={handleFromLocationChangeA}
        >
          {fromLocations.map((location, index) => (
            <Option value={location} key={index}>
              {location}
            </Option>
          ))}
        </Select>
        <Select
          className="select-viaggio"
          sx={{ height: 55 }}
          color="primary"
          placeholder={t("Tratta di andata")}
          variant="soft"
          disabled={toLocationsA.length === 0}
          onChange={handleToLocationChangeA}
        >
          {toLocationsA.map((location, index) => (
            <Option value={location} key={index}>
              {location}
            </Option>
          ))}
        </Select>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            onChange={handleChangeDataA}
            sx={{ height: 70 }}
            className="date-picker"
          />
        </LocalizationProvider>
      </div>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Viaggio di ritorno")}
        <div className="row-cont">
          <Select
            className="select-viaggio"
            disabled={soloAndata}
            sx={{ height: 55 }}
            color="primary"
            placeholder={t("Porto di ritorno")}
            variant="soft"
            value={fromLocationsR || ""}
            onChange={handleFromLocationChangeR}
          >
            {fromLocations.map((location, index) => (
              <Option value={location} key={index}>
                {location}
              </Option>
            ))}
          </Select>
          <Select
            className="select-viaggio"
            disabled={toLocationsR.length === 0}
            sx={{ height: 55 }}
            color="primary"
            placeholder={t("Tratta di ritorno")}
            variant="soft"
            onChange={handleToLocationChangeR}
          >
            {toLocationsR.map((location, index) => (
              <Option value={location} key={index}>
                {location}
              </Option>
            ))}
          </Select>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              onChange={handleChangeDataB}
              disabled={soloAndata}
              sx={{ height: 70 }}
              className="date-picker"
            />
          </LocalizationProvider>
        </div>
      </Typography>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Dettagli viaggio")}
      </Typography>

      <Card
        className="passenger-card"
        sx={{ width: 160 }}
        color="primary"
        invertedColors={false}
        orientation="vertical"
        size="sm"
        variant="outlined"
        onClick={() => setOpenModal(true)}
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

      <Button
        disabled={buttonDisabled}
        variant="soft"
        color="primary"
        size="lg"
        onClick={handleClickSearch}
      >
        {t("Cerca")}
      </Button>
      <ModalPassengers open={openModal} setOpen={setOpenModal} />
    </Card>
  );
};
