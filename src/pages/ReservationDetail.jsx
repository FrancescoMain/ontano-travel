import React, { useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Import useLocation
import { useDispatch, useSelector } from "react-redux";
import { resetReservation, fetchReservationByCodeThunk, requestRefund, fetchReservationThunk } from "../features/reservation/reservationSlice";
import { CheckoutTratta } from "../components/CheckoutTratta";

export const ReservationDetail = () => {
  const { reservationCode } = useParams();
  const location = useLocation(); // Initialize useLocation
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('guestEmail'); // Get guestEmail from query params
  const reservation = useSelector((state) => state.reservation.data);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const accountData = useSelector((state) => state.account.data);
  const isAdmin = accountData?.authorities?.includes("ROLE_WEB_ADMIN");

  useEffect(() => {
   
      dispatch(fetchReservationByCodeThunk(reservationCode)); // Use the new thunk
   
    return () => {
      dispatch(resetReservation()); // Reset reservation data on unmount
    };
  }, [dispatch, reservationCode, email, isAdmin]);

  const handleRefund = (routeId, amount, executeRefund) => {
    dispatch(requestRefund({ routeId, amount, executeRefund, reservationCode }));
  };

  return (
    <div className="container">
      <div className="  align-items-center">
        <div className="col  bg-aliceblue rounded mb-3 d-flex flex-column  mt-3 p-3">
          <div>
            <h3 className="text-primary text-center">
              Prenotazione {<span>{reservation?.code}</span>}
            </h3>
          </div>
          {reservation?.tour && (
            <div>
              <h3 className="text-primary text-center">
                Tour {<span>{reservation?.tour}</span>}
              </h3>
            </div>
          )}
          {reservation?.reservationRoutes?.map((route, index) => (
            <CheckoutTratta
              route={route}
              key={index}
              post={true}
              onRefund={handleRefund}
              isAdmin={isAdmin}
            />
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
          {/* <div className="d-flex justify-content-between align-items-center">
            <span>Totale biglietti </span>
            <span>
              {reservation?.priceToPay.price - reservation?.taxPreview.price} €
            </span>
          </div> */}
          <div className="spacer my-3 sconto d-none"></div>
          <div className="d-flex justify-content-between align-items-center">
            <span>Diritti di prenotazione</span>
            <span>{reservation?.taxPreview?.priceFormatted}</span>
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
              {reservation?.priceToPay?.priceFormatted}
            </span>
          </div>
          {reservation?.invoice && (
            <div className="mt-3 ">
              <h4 className="text-primary text-center">Dati Fattura</h4>
              <div className="row mb-3 justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">Nome Azienda</label>
                  <p className="text-muted small">{reservation.invoice.intestazione}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Partita IVA / Codice Fiscale</label>
                  <p className="text-muted small">{reservation.invoice.pIvaCodiceFiscale}</p>
                </div>
                <div className="col-4">
                  <label className="form-label">Indirizzo</label>
                  <p className="text-muted small">{reservation.invoice.indirizzo}</p>
                </div>
              </div>
              <div className="row mb-3 justify-content-center">
                <div className="col-md-4">
                  <label className="form-label">CAP</label>
                  <p className="text-muted small">{reservation.invoice.cap}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Città</label>
                  <p className="text-muted small">{reservation.invoice.citta}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Provincia</label>
                  <p className="text-muted small">{reservation.invoice.provincia}</p>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Nazione</label>
                  <p className="text-muted small">{reservation.invoice.nazione}</p>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Codice Univoco</label>
                  <p className="text-muted small">{reservation.invoice.codiceUnivoco}</p>
                </div>
              </div>
              <div className="row mb-3 ">
                <div className="col-md-4">
                  <label className="form-label">Email PEC</label>
                  <p className="text-muted small">{reservation.invoice.emailPec}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
