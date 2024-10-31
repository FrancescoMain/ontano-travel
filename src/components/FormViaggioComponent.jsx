import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  Button,
  Card,
  Input,
  Tab,
  TabList,
  Tabs,
  Typography,
  Tooltip,
} from "@mui/joy";
import React, { useState } from "react";
import { setEtaBambini } from "../features/viaggio/viaggioFormSlice";
import Autocomplete from "@mui/joy/Autocomplete";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { useFormViaggioComponent } from "../_hooks/useFormViaggioComponent";
import { FormattedMessage } from "./FormattedMessage";
import {
  resetDate,
  resetDettagli,
  resetTratta,
  upsertDettagli,
} from "../features/viaggio/findTratta";
import {
  removeSelected,
  resetSelected,
} from "../features/viaggio/resultTratta";
import { CiCircleInfo } from "react-icons/ci";

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
    selected,
    dispatch,
  } = useFormViaggioComponent();

  const showCollegamento = tab === "Collegamento" || tab === "Link";
  const resetHandle = (id) => {
    dispatch(resetSelected({ id }));
  };
  return (
    <Card
      className="card-viaggio"
      color="white"
      orientation="vertical"
      size="sm"
      variant="soft"
    >
      <ul class="nav nav-tabs">
        <li class="nav-item" onClick={handleClickTab}>
          <a
            className={`nav-link tab text-primary ${
              tab === "Collegamento" && "active"
            }`}
            aria-current="page"
            href="#"
          >
            {FormattedMessage("Collegamento")}
          </a>
        </li>
        <li class="nav-item" onClick={handleClickTab}>
          <a
            className={`nav-link tab text-primary ${
              tab === "Tour" && "active"
            }`}
            href="#"
          >
            {FormattedMessage("Tour")}
          </a>
        </li>
      </ul>

      {showCollegamento && (
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
          <DettagliViaggio
            selected={selected}
            id={0}
            resetHandle={resetHandle}
          />
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

export const ViaggioDiAndataForm = ({
  id,
  optionsChange,
  optionState,
  resultMode,
  setNTratte,
  nTratte,
}) => {
  const {
    t,
    fromLocations,
    filterOptions,
    handleChangeAndata,
    handleChangeDataA,
    tratte,
    date,
    dispatch,
    selected,
    multitratta,
  } = useFormViaggioComponent();
  const resetRoute = (id) => {
    setNTratte(nTratte - 1);
    dispatch(resetTratta({ id }));
    dispatch(resetDate({ id }));
    dispatch(resetDettagli({ id }));
  };

  const resetHandle = (id) => {
    dispatch(resetSelected({ id }));
  };
  return (
    <>
      <div className="d-flex gap-3 ">
        <h4 className="text-primary">
          {!multitratta || !resultMode
            ? t("Viaggio di andata")
            : t("Viaggio ") + (id + 1)}
        </h4>{" "}
        {resultMode && id !== 0 && (
          <span
            onClick={() => resetRoute(id)}
            className="text-secondary link-underline-secondary pointer"
          >
            {t("Rimuovi tratta")}
          </span>
        )}
      </div>
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
        {!resultMode && (
          <div className="d-flex gap-3">
            <div class="form-check">
              <input
                onClick={optionsChange}
                class="form-check-input"
                type="checkbox"
                value="Andata e ritorno"
                id="flexCheckDefault"
                checked={optionState === "Andata e ritorno"}
              />
              <label class="form-check-label" for="flexCheckDefault">
                {t("Andata e ritorno")}
              </label>
            </div>
            <div class="form-check">
              <input
                onClick={optionsChange}
                class="form-check-input"
                type="checkbox"
                value="Multitratta"
                id="flexCheckChecked"
                checked={optionState === "Multitratta"}
              />
              <label class="form-check-label" for="flexCheckChecked">
                {t("Più tratte")}
              </label>
            </div>
          </div>
        )}

        {resultMode && (
          <DettagliViaggio
            selected={selected}
            condition={resultMode && selected[id]?.data?.result_id}
            resetHandle={resetHandle}
            id={id}
          />
        )}
      </div>
    </>
  );
};

export const ViaggoiDiRitornoForm = ({ id, resultMode }) => {
  const {
    t,
    fromLocations,
    filterOptions,
    handleChangeRitorno,
    handleChangeDataB,
    soloAndata,
    tratte,
    date,
    selected,
    dispatch,
  } = useFormViaggioComponent();

  const resetHandle = (id) => {
    dispatch(resetSelected({ id }));
  };

  return (
    <>
      <h4 className="text-primary">{t("Viaggio di ritorno")}</h4>
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
      {resultMode && selected[id]?.data?.result_id && (
        <span
          className=" fs-6 fst-italic pointer underline text-secondary"
          onClick={() => resetHandle(id)}
        >
          Seleziona corsa
        </span>
      )}
      {/* <DettagliViaggio id={1} /> */}
    </>
  );
};

const DettagliViaggio = ({ id, selected, resetHandle }) => {
  const {
    etaBambinoString,
    t,
    dispatch,
    handleChangeAdulti,
    handleChangeBambini,
    handleChangeAnimali,
    handleChangeBagagli,
    dettagli,
    multitratta,
  } = useFormViaggioComponent();

  return (
    <>
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
        <div className="col col-lg-3 d-flex flex-column order-5 order-lg-0">
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
          <label htmlFor="animals" className="d-flex align-items-center">
            {t("Animali Domestici")}
            <Tooltip title="lorem ipsum">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "5px",
                }}
              >
                <CiCircleInfo />
              </span>
            </Tooltip>
          </label>
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
          <label htmlFor="bagagli" className="d-flex align-items-center">
            {t("Bagagli")}
            <Tooltip title="lorem ipsum">
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "5px",
                }}
              >
                <CiCircleInfo />
              </span>
            </Tooltip>
          </label>
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
              dispatch(
                upsertDettagli({ id: id + 1, etaBambini: newChildrenAge })
              );
              if (!multitratta && id === 0) {
                dispatch(upsertDettagli({ id: 1, etaBambini: newChildrenAge }));
              }
            }}
            value={dettagli[id]?.etaBambini[index] || ""}
            type="number"
            key={index}
            color="neutral"
            placeholder={`${etaBambinoString} ${index + 1}`}
            variant="outlined"
            className={`input-eta ${
              !dettagli[id].etaBambini[index] ? "error" : ""
            }`}
          />
        </div>
      ))}
      {selected[id]?.data?.result_id && (
        <span
          className=" fs-6 fst-italic pointer underline text-secondary"
          onClick={() => resetHandle(id)}
        >
          {t("Cambia corsa")}
        </span>
      )}
    </>
  );
};
