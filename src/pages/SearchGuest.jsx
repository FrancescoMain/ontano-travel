import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { CheckoutTratta } from "../components/CheckoutTratta";
import { resetReservation } from "../features/reservation/reservationSlice"; // Import the reset action
import { sendTicketsEmail } from "../_api/reservations/sendTicketsEmail"; // Import API
import { toast } from "react-toastify"; // Import toast
import { useTranslation } from "react-i18next"; // Import useTranslation

const SearchGuest = () => {
  const reservation = useSelector((state) => state.reservation.data);
  const guestEmail = useSelector((state) => state.reservation.guestEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { t } = useTranslation(); // Initialize translation
  const [isSending, setIsSending] = useState(false); // Loading state for button

  useEffect(() => {
    if (!reservation) {
      navigate("/cerca-prenotazione"); // Navigate to /cerca-prenotazione if no reservation data
    }

    return () => {
      dispatch(resetReservation()); // Reset reservation data on unmount
    };
  }, [dispatch, navigate, reservation]);

  const handleSendTickets = async () => {
    if (!reservation?.code || !guestEmail) {
      toast.error(t("Riprova più tardi"));
      return;
    }

    setIsSending(true);
    try {
      await sendTicketsEmail(reservation.code, guestEmail);
      toast.success(t("Biglietti inviati via email"));
    } catch (error) {
      toast.error(t("Riprova più tardi"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container">
      <div className="  align-items-center">
        <div className="col  bg-aliceblue rounded mb-3 d-flex flex-column  mt-3 p-3">
          <div>
            <h3 className="text-primary text-center">
              Prenotazione {<span>{reservation?.code}</span>}
            </h3>
            <div className="text-center mt-3 mb-3">
              <button
                className="btn btn-primary"
                onClick={handleSendTickets}
                disabled={isSending}
              >
                {isSending ? t("Invio in corso...") : t("Invia mail TKT")}
              </button>
            </div>
          </div>
          {reservation?.tour && (
            <div>
              <h3 className="text-primary text-center">
                Tour {<span>{reservation?.tour}</span>}
              </h3>
            </div>
          )}
          {reservation?.reservationRoutes.map((route, index) => (
            <div key={index}>
              <CheckoutTratta route={route} key={index} post={true} />
              {route.descriptionTour && (
                <div className="col bg-aliceblue rounded mb-3 d-flex flex-column mt-3 p-3">
                  <h4 className="text-primary text-center">Dettaglio Tour</h4>
                  <div
                    dangerouslySetInnerHTML={{ __html: route.descriptionTour }}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="card-footer bg-ice-white py-lg-3 rounded-bottom-left-4x rounded-bottom-right-4x border-top border-primary">
            <div
              id="div_DonazioneRiepilogo"
              className="d-flex justify-content-between align-items-center mb-2 d-none"
            >
              <span>Donazione</span>
              <span>0,00</span>
            </div>
            <div
              id="div_AssicurazioneRiepilogo"
              className="d-flex justify-content-between align-items-center mb-2 d-none"
            >
              <span>Garanzia di rimborso</span>
              <span>0,00</span>
            </div>
          </div>
          <div className="spacer my-3 sconto d-none"></div>
          <div className="d-flex justify-content-between align-items-center">
            <span>Totale Biglietti</span>
            <span>{reservation?.initialPrice.priceFormatted}</span>
          </div>
          <div className="spacer my-3 sconto d-none"></div>
          <div className="d-flex justify-content-between align-items-center">
            <span>Diritti di prenotazione</span>
            <span>{reservation?.taxPreview.priceFormatted}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span>Metodo di pagamento</span>
            <span>{reservation?.paymentmethod}</span>
          </div>
          <div className="spacer my-3 sconto d-none"></div>

          <div className="d-flex justify-content-between align-items-center sconto d-none">
            <span>Sconto</span>
            <span id="span_ImportoSonto">- 0,00</span>
          </div>
          <div className="spacer my-3"></div>
          <div
            id="total"
            className="d-flex justify-content-between align-items-center"
          >
            <span className="h4">Totale</span>
            <span className="h4 total-price" data-total-price-in-cents="11150">
              {reservation?.priceToPay.priceFormatted}
            </span>
          </div>
          {reservation?.invoice && (
            <div className="mt-3 ">
              <h4 className="text-primary text-center">Dati Fattura</h4>
              <div className="row mb-3 justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">Nome Azienda</label>
                  <p className="text-muted small">
                    {reservation.invoice.intestazione}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Partita IVA / Codice Fiscale
                  </label>
                  <p className="text-muted small">
                    {reservation.invoice.pIvaCodiceFiscale}
                  </p>
                </div>
                <div className="col-4">
                  <label className="form-label">Indirizzo</label>
                  <p className="text-muted small">
                    {reservation.invoice.indirizzo}
                  </p>
                </div>
              </div>
              <div className="row mb-3 justify-content-center"></div>
              <div className="row mb-3 justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">CAP</label>
                  <p className="text-muted small">{reservation.invoice.cap}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Città</label>
                  <p className="text-muted small">
                    {reservation.invoice.citta}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Provincia</label>
                  <p className="text-muted small">
                    {reservation.invoice.provincia}
                  </p>
                </div>
              </div>
              <div className="row mb-3 ">
                <div className="col-md-4">
                  <label className="form-label">Nazione</label>
                  <p className="text-muted small">
                    {reservation.invoice.nazione}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Codice Univoco</label>
                  <p className="text-muted small">
                    {reservation.invoice.codiceUnivoco}
                  </p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Email PEC</label>
                  <p className="text-muted small fs-6">
                    {reservation.invoice.emailPec}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchGuest;
