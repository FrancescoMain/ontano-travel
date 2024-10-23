import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Button, Card, Input, Tab, TabList, Tabs, Typography } from "@mui/joy";
import React, { useState } from "react";
import { setEtaBambini } from "../features/viaggio/viaggioFormSlice";
import Autocomplete from "@mui/joy/Autocomplete";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { useFormViaggioComponent } from "../_hooks/useFormViaggioComponent";
import { FormattedMessage } from "./FormattedMessage";
import { upsertDettagli } from "../features/viaggio/findTratta";

dayjs.extend(isSameOrAfter);

export const FormViaggioComponent = () => {
  const {
    handleClickTab,
    t,
    buttonDisabled,
    handleClickSearch,
    tab,
    selectedOption,
    handleOptionChange,
  } = useFormViaggioComponent();

  return (
    <Card
      className="card-viaggio"
      color="white"
      orientation="vertical"
      size="sm"
      variant="soft"
    >
      <Tabs
        defaultValue={"collegamento"}
        orientation="horizontal"
        onChange={handleClickTab}
      >
        <TabList className="tablist-viaggio" disableUnderline>
          <Tab
            className="tab-viaggio"
            sx={{ width: 320 }}
            variant="outlined"
            color="neutral"
            value={0}
            disableIndicator
          >
            {FormattedMessage("Collegamento")}
          </Tab>
          <Tab
            className="tab-viaggio"
            sx={{ width: 320 }}
            variant="outlined"
            color="neutral"
            value={1}
            disableIndicator
          >
            {FormattedMessage("Tour")}
          </Tab>
        </TabList>
      </Tabs>

      {tab === "Collegamento" && (
        <>
          <ViaggioDiAndataForm
            optionsChange={handleOptionChange}
            optionState={selectedOption}
            id={0}
          />

          {selectedOption === "Andata e ritorno" && (
            <ViaggoiDiRitornoForm id={1} />
          )}
          {selectedOption === "Round trip" && <ViaggoiDiRitornoForm id={1} />}
          <Button
            disabled={buttonDisabled}
            variant="solid"
            color="primary"
            size="lg"
            onClick={handleClickSearch}
          >
            {t("Cerca")}
          </Button>
        </>
      )}
      {tab === "Tour" && <div>Work in progress</div>}
    </Card>
  );
};

export const ViaggioDiAndataForm = ({ id, optionsChange, optionState }) => {
  const {
    t,
    fromLocations,
    filterOptions,
    handleChangeAndata,
    handleChangeDataA,
    tratte,
    date,
  } = useFormViaggioComponent();
  return (
    <>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Viaggio di andata")}
      </Typography>
      <div className="row-cont">
        <Autocomplete
          value={tratte[id]?.trattaFormatted}
          className="select-viaggio"
          placeholder={t("Seleziona una tratta")}
          options={fromLocations}
          filterOptions={filterOptions}
          sx={{ height: 56 }}
          onChange={(e) => handleChangeAndata(e, id)}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
          <DatePicker
            label={t("Data di partenza")}
            inputFormat="DD/MM/YYYY"
            value={date[id]?.date || null}
            minDate={dayjs()}
            onChange={(e) => handleChangeDataA(e, id)}
            sx={{ height: 70 }}
            className="date-picker"
          />
        </LocalizationProvider>
        <ul className="nav nav-pills gap-3">
          <li className="nav-item" onClick={optionsChange}>
            <a
              className={`nav-link ${
                optionState === "Solo andata" && "active"
              }  ${optionState === "One way" && "active"}`}
              aria-current="page"
              href="#"
            >
              {t("Solo andata")}
            </a>
          </li>
          <li className="nav-item" onClick={optionsChange}>
            <a
              className={`nav-link ${
                optionState === "Andata e ritorno" && "active"
              }  ${optionState === "Round trip" && "active"}`}
              href="#"
            >
              {t("Andata e ritorno")}
            </a>
          </li>
          <li className="nav-item" onClick={optionsChange}>
            <a
              className={`nav-link ${
                optionState === "Multitratta" && "active"
              } ${optionState === "Multi-route" && "active"}`}
              href="#"
            >
              {t("Multitratta")}
            </a>
          </li>
        </ul>
        <DettagliViaggio id={id} />
      </div>
    </>
  );
};

export const ViaggoiDiRitornoForm = ({ id }) => {
  const {
    t,
    fromLocations,
    filterOptions,
    handleChangeRitorno,
    handleChangeDataB,
    soloAndata,
    tratte,
    date,
  } = useFormViaggioComponent();

  return (
    <>
      <Typography color="primary" level="h4" noWrap={false} variant="plain">
        {t("Viaggio di ritorno")}
      </Typography>
      <div className="row-cont">
        <Autocomplete
          value={tratte[id]?.trattaFormatted}
          className="select-viaggio"
          placeholder={t("Seleziona una tratta")}
          options={fromLocations}
          filterOptions={filterOptions}
          sx={{ height: 56 }}
          onChange={(e) => handleChangeRitorno(e, id)}
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
            onChange={(e) => handleChangeDataB(e, id)}
            value={date[id]?.date || null}
            minDate={date[0]?.date || dayjs()}
            sx={{ height: 70, backgroundColor: soloAndata ? "white" : "" }}
            className="date-picker"
          />
        </LocalizationProvider>
      </div>
      {/* <DettagliViaggio id={1} /> */}
    </>
  );
};

const DettagliViaggio = ({ id }) => {
  const {
    etaBambinoString,
    t,
    dispatch,
    handleChangeAdulti,
    handleChangeBambini,
    handleChangeAnimali,
    handleChangeBagagli,
    dettagli,
  } = useFormViaggioComponent();

  return (
    <>
      <Typography
        sx={{ marginBottom: 2 }}
        color="primary"
        level="h5"
        noWrap={false}
        variant="plain"
      >
        {t("Dettagli viaggio")}
      </Typography>
      <div className="row flex-column flex-lg-row">
        <div className="col col-lg-3 d-flex flex-column">
          <label htmlFor="adults">{t("Adulti")}</label>

          <select
            value={dettagli[id]?.adulti}
            onChange={(e) => handleChangeAdulti(e, id)}
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
        <div className="col col-lg-3 d-flex flex-column">
          <label htmlFor="children">{t("Bambini")}</label>

          <select
            value={dettagli[id]?.bambini}
            onChange={(e) => handleChangeBambini(e, id)}
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
        <div className="col col-lg-3 d-flex flex-column">
          <label htmlFor="animals">{t("Animali Domestici")}</label>

          <select
            value={dettagli[id]?.animali}
            onChange={(e) => handleChangeAnimali(e, id)}
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

        <div className="col col-lg-3 d-flex flex-column">
          <label htmlFor="bagagli">{t("Bagagli")}</label>

          <select
            value={dettagli[id]?.bagagli}
            onChange={(e) => handleChangeBagagli(e, id)}
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
      {dettagli[id]?.bambini > 0 && (
        <Typography
          color="primary"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {t("Inserire età bambini")}
        </Typography>
      )}
      {Array.from({ length: dettagli[id]?.bambini }).map((_, index) => (
        <div className="col">
          <Input
            onChange={(e) => {
              if (e.target.value > 11) {
                e.target.value = 11;
              }
              if (e.target.value < 0) {
                e.target.value = 0;
              }
              const newChildrenAge = [...dettagli[id]?.etaBambini];
              newChildrenAge[index] = e.target.value;
              dispatch(upsertDettagli({ id, etaBambini: newChildrenAge }));
            }}
            value={dettagli[id]?.etaBambini[index] || ""}
            type="number"
            key={index}
            color="neutral"
            placeholder={`${etaBambinoString} ${index + 1}`}
            variant="outlined"
          />
        </div>
      ))}
    </>
  );
};
