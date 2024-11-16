import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetReservation, fetchReservationByCodeThunk } from "../features/reservation/reservationSlice";
import { CheckoutTratta } from "../components/CheckoutTratta";

export const ReservationDetail = () => {
  const { reservationCode } = useParams();
  const reservation = useSelector((state) => state.reservation.data);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    dispatch(fetchReservationByCodeThunk(reservationCode)); // Use the new thunk

    return () => {
      dispatch(resetReservation()); // Reset reservation data on unmount
    };
  }, [dispatch, reservationCode]);
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
          {reservation?.reservationRoutes.map((route, index) => (
            <CheckoutTratta route={route} key={index} post={true} />
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
            <span>{reservation?.taxPreview.priceFormatted}</span>
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
        </div>
      </div>
    </div>
  );
};
