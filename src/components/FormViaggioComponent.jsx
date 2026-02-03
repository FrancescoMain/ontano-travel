import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Button, Card, Input, Typography } from "@mui/joy";
import React, { useState, useEffect, useRef } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { useFormViaggioComponent } from "../_hooks/useFormViaggioComponent";
import { FormattedMessage } from "./FormattedMessage";
import {
  resetDate,
  resetDettagli,
  resetTratta,
  setNTratte,
  upsertDettagli,
} from "../features/viaggio/findTratta";
import { resetSelected } from "../features/viaggio/resultTratta";
import { CiCircleInfo } from "react-icons/ci";
import { Tooltip as MuiTooltip } from "@mui/material";
import { TourComponent } from "./TourComponent";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

dayjs.extend(isSameOrAfter);

const VALIDATION_DEBOUNCE = 1500; // 1.5 seconds debounce for validation

// Separate component for adult age input with local state and debounce
const AdultAgeInput = ({ index, id, dettagli, multitratta, placeholder }) => {
  const dispatch = useDispatch();
  const [localValue, setLocalValue] = useState(
    dettagli[id]?.etaAdulti?.[index] || ""
  );
  const debounceRef = useRef(null);

  // Sync local state when Redux state changes externally
  useEffect(() => {
    const reduxValue = dettagli[id]?.etaAdulti?.[index] || "";
    if (reduxValue !== localValue && !debounceRef.current) {
      setLocalValue(reduxValue);
    }
  }, [dettagli[id]?.etaAdulti?.[index]]);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalValue(value);

    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce validation and dispatch
    debounceRef.current = setTimeout(() => {
      let validatedValue = value;
      if (value !== "" && parseInt(value, 10) < 12) {
        validatedValue = "12";
        setLocalValue("12");
      }

      const newAdultAge = [...(dettagli[id]?.etaAdulti || [])];
      newAdultAge[index] = validatedValue;
      dispatch(upsertDettagli({ id, etaAdulti: newAdultAge }));
      dispatch(upsertDettagli({ id: id + 1, etaAdulti: newAdultAge }));
      if (!multitratta && id === 0) {
        dispatch(upsertDettagli({ id: 1, etaAdulti: newAdultAge }));
      }
      debounceRef.current = null;
    }, VALIDATION_DEBOUNCE);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const isEmpty = localValue === undefined || localValue === "";

  return (
    <div className="col" key={`adult-age-${index}`}>
      <Input
        onChange={handleChange}
        value={localValue}
        type="number"
        color="neutral"
        placeholder={placeholder}
        variant="outlined"
        className={`input-eta ${isEmpty ? "error" : ""}`}
      />
    </div>
  );
};

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
  } = useFormViaggioComponent(true);

  const showCollegamento = tab === "Collegamento" || tab === "Link";
  const resetHandle = (id) => {
    dispatch(resetSelected({ id }));
  };
  return (
    <Card
      className="card-viaggio col-lg-4 ms-lg-4"
      color="white"
      orientation="vertical"
      size="sm"
      variant="soft"
    >
      <ul class="nav nav-tabs">
        <li class="nav-item" onClick={handleClickTab}>
          <a
            className={`fs-5 fw-bold nav-link tab text-primary ${
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
            className={`nav-link tab text-primary fs-5 fw-bold ${
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
      {tab === "Tour" && <TourComponent />}
    </Card>
  );
};

export const ViaggioDiAndataForm = ({
  id,
  optionsChange,
  optionState,
  resultMode,
  nTratte,
  hasGrimaldiResults,
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
  } = useFormViaggioComponent(false);
  const resetRoute = (id) => {
    dispatch(setNTratte(nTratte - 1));
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
            role="button"
            aria-label={t("Rimuovi tratta")}
          >
            {t("Rimuovi tratta")}
          </span>
        )}
      </div>
      <div className="row-cont">
        <Autocomplete
          value={tratte[id]?.trattaFormatted || ""}
          className="select-viaggio"
          placeholder={t("Seleziona una tratta")}
          options={fromLocations}
          filterOptions={filterOptions}
          sx={{ height: 56 }}
          onChange={(e, option) => {
            if (option?.label) {
              const syntheticEvent = { target: { textContent: option.label } };
              handleChangeAndata(syntheticEvent, id);
            }
          }}
          id={`tratta-autocomplete-${id}`}
          aria-label={t("Seleziona una tratta")}
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
          <div className="d-flex gap-3 ">
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
            hasGrimaldiResults={hasGrimaldiResults}
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
  } = useFormViaggioComponent(false);

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
          onChange={(e, option) => {
            if (option?.label) {
              const syntheticEvent = { target: { textContent: option.label } };
              handleChangeRitorno(syntheticEvent, id);
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

export const DettagliViaggio = ({ id, selected, resetHandle, hasGrimaldiResults }) => {
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
  } = useFormViaggioComponent(false);

  return (
    <>
      <div
        className="row flex-column flex-lg-row dettagli"
        role="group"
        aria-labelledby={`dettagli-viaggio-${id}`}
      >
        <div className="col col-lg-3 d-flex flex-column">
          <label htmlFor={`adults-${id}`}>{t("Adulti")}</label>

          <select
            value={dettagli[id]?.adulti}
            onChange={(e) => handleChangeAdulti(e, id)}
            id={`adults-${id}`}
            className="select-detail"
            aria-label={t("Seleziona numero di adulti")}
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
            {t("Animali")}
            <MuiTooltip
              title="Informazioni sugli animali domestici"
              enterTouchDelay={0}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "5px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <CiCircleInfo />
              </span>
            </MuiTooltip>
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
            <MuiTooltip title="Informazioni sui bagagli" enterTouchDelay={0}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "5px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <CiCircleInfo />
              </span>
            </MuiTooltip>
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
      {hasGrimaldiResults && dettagli[id]?.adulti > 0 && (
        <Typography
          color="primary"
          level="body-md"
          noWrap={false}
          variant="plain"
        >
          {t("Inserire età adulti")}
        </Typography>
      )}
      {hasGrimaldiResults &&
        Array.from({ length: dettagli[id]?.adulti || 0 }).map((_, index) => (
          <AdultAgeInput
            key={`adult-age-${index}`}
            index={index}
            id={id}
            dettagli={dettagli}
            multitratta={multitratta}
            placeholder={`${t("Età adulto")} ${index + 1}`}
          />
        ))}
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
        <div className="col" key={`child-age-${index}`}>
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
            value={
              dettagli[id]?.etaBambini?.[index] === 0
                ? "0"
                : dettagli[id]?.etaBambini?.[index] || ""
            }
            type="number"
            color="neutral"
            placeholder={`${etaBambinoString} ${index + 1}`}
            variant="outlined"
            className={`input-eta ${
              dettagli[id]?.etaBambini?.[index] === undefined ? "error" : ""
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
