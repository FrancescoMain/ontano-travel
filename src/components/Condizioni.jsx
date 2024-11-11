import React from "react";
import { useTranslation } from "react-i18next";
import { CheckoutPrimoPasseggero } from "../components/Checkouts/CheckoutPassegero";

export const Condizioni = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <div className="col-lg-12  col bg-passeggeri rounded mt-3 mb-3 p-4">
      <h2 className="text-primary">{t("Condizioni e Contatti")}</h2>
      <CheckoutPrimoPasseggero value={value} onChange={onChange} />

      <div className="col">
        <div className="form-check">
          <input
            required
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            {t("Ho letto e accettato i")}{" "}
            <a
              href="https://www.quickferries.com/it/condizioni-generali-di-prenotazioni/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("termini e condizioni")}
            </a>
            {" / "}
            <a
              href="https://www.quickferries.com/it/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Informativa sulla privacy")}
            </a>
          </label>
        </div>
        {/* <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault2"
            required
          />
          <label className="form-check-label" htmlFor="flexCheckDefault2">
            {t("Accetto")}{" "}
            <a
              href="https://www.quickferries.com/it/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Informativa sulla privacy")}
            </a>
          </label>
        </div> */}
      </div>
    </div>
  );
};
