// Costanti del tag di monitoraggio conversioni di Google Ads.
// Tag fornito per le campagne sponsorizzate (account AW-16898515329).
export const GOOGLE_ADS_CONVERSION_ID = "AW-16898515329";
export const GOOGLE_ADS_CONVERSION_SEND_TO =
  "AW-16898515329/e-QyCN253KMaEIHD6_k-";

/**
 * Spara l'evento di conversione di Google Ads per una prenotazione conclusa.
 *
 * La conversione viene inviata solo in produzione per non contare conversioni
 * false generate dai test in ambiente di sviluppo. Riporta valore e valuta
 * della prenotazione per permettere il calcolo del ROI delle campagne.
 *
 * @param {object} prenotazione - Prenotazione confermata (deve contenere
 *   `code` e `priceToPay.price`).
 * @returns {boolean} true se la conversione è stata inviata, false altrimenti.
 */
export const trackGoogleAdsConversion = (prenotazione) => {
  if (process.env.REACT_APP_ENV !== "production") {
    return false;
  }

  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return false;
  }

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
    value: prenotazione?.priceToPay?.price,
    currency: "EUR",
    transaction_id: prenotazione?.code,
  });

  return true;
};
