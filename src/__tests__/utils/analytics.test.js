import {
  trackGoogleAdsConversion,
  GOOGLE_ADS_CONVERSION_SEND_TO,
} from "../../utils/analytics";

describe("trackGoogleAdsConversion", () => {
  const ORIGINAL_ENV = process.env.REACT_APP_ENV;
  const prenotazione = {
    code: "ABC123",
    priceToPay: { price: 149.9 },
  };

  beforeEach(() => {
    window.gtag = jest.fn();
  });

  afterEach(() => {
    process.env.REACT_APP_ENV = ORIGINAL_ENV;
    delete window.gtag;
  });

  it("invia la conversione in produzione con valore, valuta e transaction_id", () => {
    process.env.REACT_APP_ENV = "production";

    const sent = trackGoogleAdsConversion(prenotazione);

    expect(sent).toBe(true);
    expect(window.gtag).toHaveBeenCalledTimes(1);
    expect(window.gtag).toHaveBeenCalledWith("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      value: 149.9,
      currency: "EUR",
      transaction_id: "ABC123",
    });
  });

  it("non invia la conversione fuori produzione", () => {
    process.env.REACT_APP_ENV = "development";

    const sent = trackGoogleAdsConversion(prenotazione);

    expect(sent).toBe(false);
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it("non lancia errori se gtag non è disponibile", () => {
    process.env.REACT_APP_ENV = "production";
    delete window.gtag;

    expect(() => trackGoogleAdsConversion(prenotazione)).not.toThrow();
    expect(trackGoogleAdsConversion(prenotazione)).toBe(false);
  });

  it("gestisce una prenotazione senza prezzo senza lanciare errori", () => {
    process.env.REACT_APP_ENV = "production";

    const sent = trackGoogleAdsConversion({ code: "NOPRICE" });

    expect(sent).toBe(true);
    expect(window.gtag).toHaveBeenCalledWith("event", "conversion", {
      send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      value: undefined,
      currency: "EUR",
      transaction_id: "NOPRICE",
    });
  });
});
