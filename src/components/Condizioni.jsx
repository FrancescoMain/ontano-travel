import React from "react";
import { useTranslation } from "react-i18next";
import { CheckoutPrimoPasseggero } from "../components/Checkouts/CheckoutPassegero";

export const Condizioni = ({
  value,
  onChange,
  fattura,
  onFatturaChange,
  invoiceDTO,
  onInvoiceDTOChange,
}) => {
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
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckFattura"
            checked={fattura}
            onChange={(e) => onFatturaChange(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="flexCheckFattura">
            {t("Richiedo la fattura")}
          </label>
        </div>
        {fattura && (
          <div className="mt-3">
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">{t("Nome Azienda")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.intestazione}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, intestazione: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">{t("Partita IVA / Codice Fiscale")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.pIvaCodiceFiscale}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, pIvaCodiceFiscale: e.target.value })
                  }
                  required
                />
              </div>
              
            </div>
            <div className="row mb-3">
            <div className="col">
                <label className="form-label">{t("Indirizzo")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.indirizzo}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, indirizzo: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">{t("CAP")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.cap}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, cap: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t("Città")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.citta}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, citta: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t("Provincia")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.provincia}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, provincia: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">{t("Nazione")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.nazione}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, nazione: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t("Codice Univoco")}</label>
                <input
                  type="text"
                  className="form-control"
                  value={invoiceDTO.codiceUnivoco}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, codiceUnivoco: e.target.value })
                  }
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t("Email PEC")}</label>
                <input
                  type="email"
                  className="form-control"
                  value={invoiceDTO.emailPec}
                  onChange={(e) =>
                    onInvoiceDTOChange({ ...invoiceDTO, emailPec: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
