import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Input, Typography, Card } from "@mui/joy";
import { upsertDettagli } from "../../features/viaggio/findTratta";
import "./GrimaldiAgeInput.css";

export const GrimaldiAgeInput = ({ id = 0 }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { adulti, etaAdulti } = useSelector(
    (state) => state.tratte.dettagli[id]
  );

  const adultiNum = parseInt(adulti, 10) || 1;

  const handleAgeChange = (index, value) => {
    let finalValue = value;
    if (value !== "" && parseInt(value, 10) < 12) {
      finalValue = "12";
    }
    const newAdultAges = [...(etaAdulti || [])];
    newAdultAges[index] = finalValue;

    // Sync ages across all dettagli (0 to 9)
    for (let i = 0; i <= 9; i++) {
      dispatch(upsertDettagli({ id: i, etaAdulti: newAdultAges }));
    }
  };

  const allAgesValid =
    etaAdulti?.length === adultiNum &&
    etaAdulti.every((age) => age !== "" && parseInt(age, 10) >= 12);

  return (
    <Card
      className="grimaldi-age-card mb-4"
      color="warning"
      variant="soft"
      sx={{ p: 3 }}
    >
      <div className="d-flex align-items-center mb-2">
        <img
          src={require("../../assets/Logo-Grimaldi-Lines.jpg")}
          alt="Grimaldi"
          className="grimaldi-logo-small me-2"
        />
        <Typography level="title-md" color="warning">
          {t("Tratte Grimaldi - Inserire età adulti")}
        </Typography>
      </div>
      <Typography level="body-sm" className="mb-3">
        {t("Per calcolare il prezzo delle tratte Grimaldi, inserisci l'età di ogni adulto")}
      </Typography>
      <div className="d-flex flex-wrap gap-2">
        {Array.from({ length: adultiNum }).map((_, index) => (
          <div key={index} className="grimaldi-age-field">
            <Input
              type="number"
              min="12"
              placeholder={`${t("Età adulto")} ${index + 1}`}
              value={etaAdulti?.[index] || ""}
              onChange={(e) => handleAgeChange(index, e.target.value)}
              color={
                etaAdulti?.[index] && parseInt(etaAdulti[index], 10) >= 12
                  ? "success"
                  : "neutral"
              }
              sx={{ width: 120 }}
            />
          </div>
        ))}
      </div>
      {!allAgesValid && (
        <Typography level="body-xs" color="danger" className="mt-2">
          {t("Inserisci l'età di tutti gli adulti per vedere i prezzi Grimaldi")}
        </Typography>
      )}
    </Card>
  );
};
