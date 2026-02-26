import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import { CheckoutTratta } from "../components/CheckoutTratta";
import { resetReservation } from "../features/reservation/reservationSlice"; // Import the reset action
import { sendTicketsEmail } from "../_api/reservations/sendTicketsEmail"; // Import API
import { askRefund } from "../_api/reservations/askRefund";
import { toast } from "react-toastify"; // Import toast
import { useTranslation } from "react-i18next"; // Import useTranslation
import {
  Modal,
  ModalClose,
  ModalDialog,
  Typography,
  Button,
  Textarea,
} from "@mui/joy";

const SearchGuest = () => {
  const reservation = useSelector((state) => state.reservation.data);
  const guestEmail = useSelector((state) => state.reservation.guestEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { t } = useTranslation(); // Initialize translation
  const [isSending, setIsSending] = useState(false);
  const isSendingRef = useRef(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundMessage, setRefundMessage] = useState("");
  const [isRequestingRefund, setIsRequestingRefund] = useState(false);

  useEffect(() => {
    if (!reservation) {
      navigate("/cerca-prenotazione"); // Navigate to /cerca-prenotazione if no reservation data
    }

    return () => {
      dispatch(resetReservation()); // Reset reservation data on unmount
    };
  }, [dispatch, navigate, reservation]);

  const handleSendTickets = async () => {
    if (isSendingRef.current) return;
    if (!reservation?.code || !guestEmail) {
      toast.error(t("Riprova più tardi"));
      return;
    }

    isSendingRef.current = true;
    setIsSending(true);
    try {
      await sendTicketsEmail(reservation.code, guestEmail);
      toast.success(t("Biglietti inviati via email"));
    } catch (error) {
      const errorMessage = error.apiMessage || t("Riprova più tardi");
      toast.error(errorMessage);
    } finally {
      isSendingRef.current = false;
      setIsSending(false);
    }
  };

  const handleAskRefund = async () => {
    if (!reservation?.code || !guestEmail) {
      toast.error(t("Riprova più tardi"));
      return;
    }

    setIsRequestingRefund(true);
    try {
      await askRefund(reservation.code, guestEmail, refundMessage);
      toast.success(t("Richiesta di rimborso inviata"));
      setShowRefundModal(false);
      setRefundMessage("");
    } catch (error) {
      const errorMessage = error.apiMessage || t("Riprova più tardi");
      toast.error(errorMessage);
    } finally {
      setIsRequestingRefund(false);
    }
  };

  return (
    <div className="container">
      <div className="  align-items-center">
        <div className="col  bg-aliceblue rounded mb-3 d-flex flex-column  mt-3 p-3">
          <div>
            <h3 className="text-primary text-center">
              {t("Prenotazione")} {<span>{reservation?.code}</span>}
            </h3>
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
                  <h4 className="text-primary text-center">{t("Dettaglio Tour")}</h4>
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
              <span>{t("Donazione")}</span>
              <span>0,00</span>
            </div>
            <div
              id="div_AssicurazioneRiepilogo"
              className="d-flex justify-content-between align-items-center mb-2 d-none"
            >
              <span>{t("Garanzia di rimborso")}</span>
              <span>0,00</span>
            </div>
          </div>
          <div className="spacer my-3 sconto d-none"></div>
          <div className="d-flex justify-content-between align-items-center">
            <span>{t("Totale Biglietti")}</span>
            <span>{reservation?.initialPrice.priceFormatted}</span>
          </div>
          <div className="spacer my-3 sconto d-none"></div>
          <div className="d-flex justify-content-between align-items-center">
            <span>{t("Diritti di prenotazione")}</span>
            <span>{reservation?.taxPreview.priceFormatted}</span>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <span>{t("Metodo di pagamento")}</span>
            <span>{reservation?.paymentmethod}</span>
          </div>
          <div className="spacer my-3 sconto d-none"></div>

          <div className="d-flex justify-content-between align-items-center sconto d-none">
            <span>{t("Sconto")}</span>
            <span id="span_ImportoSonto">- 0,00</span>
          </div>
          <div className="spacer my-3"></div>
          <div
            id="total"
            className="d-flex justify-content-between align-items-center"
          >
            <span className="h4">{t("Totale")}</span>
            <span className="h4 total-price" data-total-price-in-cents="11150">
              {reservation?.priceToPay.priceFormatted}
            </span>
          </div>
          {reservation?.invoice && (
            <div className="mt-3 ">
              <h4 className="text-primary text-center">{t("Dati Fattura")}</h4>
              <div className="row mb-3 justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">{t("Nome Azienda")}</label>
                  <p className="text-muted small">
                    {reservation.invoice.intestazione}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    {t("Partita IVA / Codice Fiscale")}
                  </label>
                  <p className="text-muted small">
                    {reservation.invoice.pIvaCodiceFiscale}
                  </p>
                </div>
                <div className="col-4">
                  <label className="form-label">{t("Indirizzo")}</label>
                  <p className="text-muted small">
                    {reservation.invoice.indirizzo}
                  </p>
                </div>
              </div>
              <div className="row mb-3 justify-content-center"></div>
              <div className="row mb-3 justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">{t("CAP")}</label>
                  <p className="text-muted small">{reservation.invoice.cap}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">{t("Città")}</label>
                  <p className="text-muted small">
                    {reservation.invoice.citta}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">{t("Provincia")}</label>
                  <p className="text-muted small">
                    {reservation.invoice.provincia}
                  </p>
                </div>
              </div>
              <div className="row mb-3 ">
                <div className="col-md-4">
                  <label className="form-label">{t("Nazione")}</label>
                  <p className="text-muted small">
                    {reservation.invoice.nazione}
                  </p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">{t("Codice Univoco")}</label>
                  <p className="text-muted small">
                    {reservation.invoice.codiceUnivoco}
                  </p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">{t("Email PEC")}</label>
                  <p className="text-muted small fs-6">
                    {reservation.invoice.emailPec}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="d-flex justify-content-end flex-wrap gap-2 mt-4">
            <button
              className="btn btn-warning"
              onClick={() => setShowRefundModal(true)}
            >
              {t("Richiedi Rimborso")}
            </button>
            <button
              className="btn btn-success"
              onClick={handleSendTickets}
              disabled={isSending}
            >
              {isSending ? t("Invio in corso...") : t("Reinvia email con biglietto")}
            </button>
          </div>
        </div>
      </div>

      <Modal open={showRefundModal} onClose={() => setShowRefundModal(false)}>
        <ModalDialog sx={{ maxWidth: "95vw", width: 500 }} color="primary" variant="outlined">
          <ModalClose />
          <Typography level="h4">{t("Richiedi Rimborso")}</Typography>
          <Textarea
            placeholder={t("Messaggio (opzionale)")}
            minRows={3}
            value={refundMessage}
            onChange={(e) => setRefundMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setShowRefundModal(false)}
            >
              {t("Annulla")}
            </Button>
            <Button
              variant="solid"
              color="warning"
              loading={isRequestingRefund}
              onClick={handleAskRefund}
            >
              {isRequestingRefund
                ? t("Invio richiesta in corso...")
                : t("Invia richiesta")}
            </Button>
          </div>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default SearchGuest;
