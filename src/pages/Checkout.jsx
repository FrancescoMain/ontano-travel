import React from "react";
import {
  CheckoutPasseggero,
  CheckoutPrimoPasseggero,
} from "../components/Checkouts/CheckoutPassegero";
import { useReservations } from "../_hooks/useReservations";

export const Checkout = () => {
  const { passeggeri } = useReservations();
  return (
    <div className="conatiner">
      <div className="row d-flex justify-content-center ">
        <div className="col-9">
          <div className="row justify-content-between">
            <div className="col-7 bg-aliceblue rounded mt-3 mb-3 p-4">
              <div className="row">
                <div className="col ">
                  <h2 className="text-primary">Dati Passeggeri</h2>
                  <CheckoutPrimoPasseggero />

                  {passeggeri.map(
                    (_, index) =>
                      index !== 0 && (
                        <CheckoutPasseggero n={index + 1} key={index} />
                      )
                  )}
                </div>
                <h2 className="text-primary">Condizioni</h2>
                <div className="col">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Ho letto e accettato i termini e le condizioni
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckDefault"
                    >
                      Accetto Informatica sulla privacy
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-4 bg-aliceblue mt-3 ">Resoconto</div>
          </div>
        </div>
      </div>
    </div>
  );
};
