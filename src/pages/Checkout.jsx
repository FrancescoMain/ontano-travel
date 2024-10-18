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
            <div className="col-4 bg-aliceblue mt-3 rounded mb-3  ">
              <h3 className="text-primary text-center">Il tuo viaggio</h3>
              <div class="bg-aliceblue row g-0 pb-2 pt-3">
                <div class="text-start col-6">
                  <p class="h5 fw-bold mb-0">Capri</p>
                </div>
                <div class="text-end col-6">
                  <p class="h5 fw-bold mb-0">Amalfi</p>
                </div>
                <div class="text-start col-4">
                  <p class="mb-0 text-capitalize">sab 19 ott 09:45</p>
                </div>
                <div class="text-center col-4">
                  <img
                    class="my-2"
                    src="//cdn.traghettilines.it/new/img/compagnie/results/51.png"
                  />
                </div>
                <div class="text-end col-4">
                  <p class="mb-0 text-capitalize">sab 19 ott 10:35</p>
                </div>
              </div>
              <div class="list-group list-group-flush bg-aliceblue">
                <div class="bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                  <span>2 Passeggeri (1 Adulto, 1 Bambino) </span>{" "}
                  <span> 27,24 </span>
                </div>
                <div class="bg-aliceblue d-flex justify-content-between align-items-center border-bottom">
                  <span>Tasse e diritti portuali</span>
                  <span>11,76</span>
                </div>
                <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal ">
                  <span class="h5"> Totale andata </span>
                  <span class="fw-bold">39,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
