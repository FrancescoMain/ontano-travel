import React from "react";
import { Input, Typography } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { setDettagli } from "../features/tour/tourSlice";
import { useTranslation } from "react-i18next";
import { CiCircleInfo } from "react-icons/ci";
import { Tooltip as MuiTooltip } from "@mui/material";

export const DettagliViaggioTour = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const dettagli = useSelector((state) => state.tour.dettagli);

  const handleChange = (field, value) => {
    const newDettagli = { ...dettagli[id], [field]: value };
    dispatch(setDettagli({ id, dettagli: newDettagli }));
  };

  return (
    <>
      <div className="row flex-column flex-lg-row">
        <div className="col col-lg-3 d-flex flex-column">
          <label htmlFor="adults">{t("Adulti")}</label>
          <select
            value={dettagli[id]?.adulti || 1}
            onChange={(e) => handleChange("adulti", parseInt(e.target.value))}
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
            value={dettagli[id]?.bambini || 0}
            onChange={(e) => handleChange("bambini", parseInt(e.target.value))}
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
            value={dettagli[id]?.animali || 0}
            onChange={(e) => handleChange("animali", parseInt(e.target.value))}
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
            value={dettagli[id]?.bagagli || 0}
            onChange={(e) => handleChange("bagagli", parseInt(e.target.value))}
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
      {Array.from({ length: dettagli[id]?.bambini || 0 }).map((_, index) => (
        <div className="col mb-2" key={index}>
          <Input
            onChange={(e) => {
              if (e.target.value > 11) {
                e.target.value = 11;
              }
              if (e.target.value < 0) {
                e.target.value = 0;
              }
              const newChildrenAge = [...(dettagli[id]?.etaBambini || [])];
              newChildrenAge[index] = e.target.value;
              handleChange("etaBambini", newChildrenAge);
            }}
            value={dettagli[id]?.etaBambini?.[index] || ""}
            type="number"
            color="neutral"
            placeholder={`${t("Età bambino")} ${index + 1}`}
            variant="outlined"
            className={`input-eta ${
              !dettagli[id]?.etaBambini?.[index] ? "error" : ""
            }`}
          />
        </div>
      ))}
    </>
  );
};
