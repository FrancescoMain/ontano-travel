import React from "react";
import {
  CheckoutPasseggero,
  CheckoutPrimoPasseggero,
} from "../components/Checkouts/CheckoutPassegero";
import { useReservations } from "../_hooks/useReservations";
import { IoMdPeople } from "react-icons/io";
import { MdLuggage } from "react-icons/md";
import { FaChild } from "react-icons/fa";
import { FaDog } from "react-icons/fa";

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
              <div>
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
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <IoMdPeople />
                      </span>
                      <span>2 Adulto</span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <FaChild />
                      </span>
                      <span>2 Bambino</span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <MdLuggage />
                      </span>
                      <span>1 Bagaglio </span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <FaDog />
                      </span>
                      <span>1 Animale </span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="bg-aliceblue d-flex justify-content-between align-items-center border-bottom">
                    <span>Tasse e diritti portuali</span>
                    <span>11,76</span>
                  </div>
                  <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal ">
                    <span class="h5"> Totale tratta </span>
                    <span class="fw-bold">39,00</span>
                  </div>
                </div>
              </div>
              <div>
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
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <IoMdPeople />
                      </span>
                      <span>2 Adulto</span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <FaChild />
                      </span>
                      <span>2 Bambino</span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <MdLuggage />
                      </span>
                      <span>1 Bagaglio </span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
                    <div className="col-8 d-flex align-items-center gap-2">
                      <span>
                        <FaDog />
                      </span>
                      <span>1 Animale </span>
                    </div>
                    <span className="col-4 text-end"> 27,24 </span>
                  </div>
                  <div class="bg-aliceblue d-flex justify-content-between align-items-center border-bottom">
                    <span>Tasse e diritti portuali</span>
                    <span>11,76</span>
                  </div>
                  <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal ">
                    <span class="h5"> Totale tratta </span>
                    <span class="fw-bold">39,00</span>
                  </div>
                </div>
              </div>
              <div class="card-footer bg-ice-white py-lg-3 px-3 rounded-bottom-left-4x rounded-bottom-right-4x border-top border-primary">
                <div
                  id="div_DonazioneRiepilogo"
                  class="d-flex justify-content-between align-items-center mb-2 d-none"
                >
                  <span>Donazione</span>
                  <span>0,00</span>
                </div>
                <div
                  id="div_AssicurazioneRiepilogo"
                  class="d-flex justify-content-between align-items-center mb-2 d-none"
                >
                  <span>Garanzia di rimborso</span>
                  <span>0,00</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span>Diritti di prenotazione</span> <span>16,00</span>
                </div>
                <div class="spacer my-3 sconto d-none"></div>
                <div
                  id="div_Listino"
                  class="d-flex justify-content-between align-items-center sconto d-none"
                >
                  <span class="h5">Prezzo listino</span>{" "}
                  <span
                    class="h5 text-decoration-line-through listino"
                    data-regular-price-in-cents="11150"
                  >
                    {" "}
                    111,50{" "}
                  </span>
                </div>
                <div class="d-flex justify-content-between align-items-center sconto d-none">
                  <span>Sconto</span>
                  <span id="span_ImportoSonto">- 0,00</span>
                </div>
                <div class="spacer my-3"></div>
                <div
                  id="total"
                  class="d-flex justify-content-between align-items-center"
                >
                  <span class="h4">Totale</span>{" "}
                  <span
                    class="h4 total-price"
                    data-total-price-in-cents="11150"
                  >
                    {" "}
                    € 111,50{" "}
                  </span>
                </div>
                <div class="mt-3 d-none d-lg-block">
                  <button
                    type="button"
                    class="btn btn-success btn btn-lg w-100 text-white bg-green border-0 ms-auto fw-bold py-3"
                  >
                    CONFERMA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
