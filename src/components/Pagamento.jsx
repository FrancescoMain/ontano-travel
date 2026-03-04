import React from "react";
import { useTranslation } from "react-i18next";

export const Pagamento = ({
  methods,
  checked,
  onChange,
  email,
  setEmail,
  fido,
  total,
}) => {
  const { t } = useTranslation();

  const isFidoInsufficient =
    fido != null && total != null && fido < total;

  return (
    <div className="col-lg-12  col bg-passeggeri rounded mt-3 mb-3 p-4">
      <h2 className="text-primary">{t("Metodo di pagamento")}</h2>

      {methods.map((method) => {
        const isDisabled =
          method === "EXTERNAL_PAYMENT" && isFidoInsufficient;

        return (
          <div className="form-check" key={method}>
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id={`flexRadioDefault-${method}`}
              checked={checked === method}
              onChange={() => onChange(method)}
              disabled={isDisabled}
            />
            <label
              className={`form-check-label${isDisabled ? " text-muted" : ""}`}
              htmlFor={`flexRadioDefault-${method}`}
            >
              {method === "CREDIT_CARD" && t("Carta di Credito")}
              {method === "PAY_BY_LINK" && t("PaybyLink")}
              {method === "EXTERNAL_PAYMENT" && (
                <>
                  {t("Estratto Conto")}
                  {fido != null && (
                    <span className={`ms-2 small${isFidoInsufficient ? " text-danger" : " text-success"}`}>
                      ({t("importo disponibile")} {fido.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €)
                    </span>
                  )}
                </>
              )}
            </label>
          </div>
        );
      })}

      {checked === "PAY_BY_LINK" && (
        <div className="mt-3">
          <label htmlFor="payByLinkEmail" className="form-label">
            {t("A quale email inviare il link")}
          </label>
          <input
            type="email"
            className="form-control"
            id="payByLinkEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
