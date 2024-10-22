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
import dayjs from "dayjs";
import travelmar from "../assets/travelmar.png";
import snav from "../assets/snav.png";
import alilauro from "../assets/Logo-AliLauro.png";
import alilauroGruson from "../assets/Alilauro Gruson.png";

export const Checkout = () => {
  const { passeggeri, prenotazione, etaBambini } = useReservations();
  return (
    <div className="conatiner">
      <form
        className="row d-flex justify-content-center needs-validation "
        noValidate
      >
        <div className="col-lg-9 col-11">
          <div className="row justify-content-between flex-lg-row flex-column flex-column-reverse align-items-start">
            <div className="col-lg-7 col  rounded  mb-3">
              <div className="col-lg-12 col bg-passeggeri rounded mt-3 mb-3 p-4">
                <div className="row">
                  <div className="col ">
                    <h2 className="text-primary">Dati Passeggeri</h2>

                    {passeggeri.map((_, index) => (
                      <CheckoutPasseggero n={index + 1} key={index} />
                    ))}
                    {etaBambini.map((eta, index) => (
                      <CheckoutPasseggero n={index + 1} key={index} eta={eta} />
                    ))}
                  </div>
                </div>
              </div>
              <Condizioni />
            </div>

            <div className="col-lg-4 col bg-aliceblue mt-3 rounded mb-3 sticky-lg-top d-flex flex-column flex-basis-0 flex-grow-0">
              <div>
                <h3 className="text-primary text-center">Il tuo viaggio</h3>
              </div>
              {prenotazione?.reservationRoutes.map((route, index) => (
                <CheckoutTratta route={route} key={index} />
              ))}
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
                  <span>Diritti di prenotazione</span>
                  <span>{prenotazione?.taxPreview.priceFormatted}</span>
                </div>
                <div class="spacer my-3 sconto d-none"></div>
                <div
                  id="div_Listino"
                  class="d-flex justify-content-between align-items-center sconto d-none"
                >
                  <span class="h5">Prezzo listino</span>
                  <span
                    class="h5 text-decoration-line-through listino"
                    data-regular-price-in-cents="11150"
                  ></span>
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
                  <span class="h4">Totale</span>
                  <span
                    class="h4 total-price"
                    data-total-price-in-cents="11150"
                  >
                    {prenotazione?.priceToPay.priceFormatted}
                  </span>
                </div>
                <div class="mt-3 d-none d-lg-block ">
                  <button
                    type="submit"
                    class="btn btn-success btn btn-lg w-100 text-white bg-green border-0 ms-auto fw-bold py-3"
                  >
                    CONFERMA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export const CheckoutTratta = ({ route }) => {
  const formattedDeparture = dayjs(route.departure).format("DD/MMM/YYYY HH:mm");
  const formattedArrival = dayjs(route.arrive).format("DD/MMM/YYYY HH:mm");
  return (
    <div>
      <div class="bg-aliceblue row g-0 pb-2 pt-3">
        <div class="text-start col-6">
          <p class="h5 fw-bold mb-0">{route.from}</p>
        </div>
        <div class="text-end col-6">
          <p class="h5 fw-bold mb-0">{route.to}</p>
        </div>
        <div class="text-start col-4">
          <p class="mb-0 text-capitalize">{formattedDeparture}</p>
        </div>
        <div class="text-center col-4"></div>
        <div class="text-end col-4">
          <p class="mb-0 text-capitalize">{formattedArrival}</p>
        </div>
      </div>
      <div class="list-group list-group-flush bg-aliceblue">
        {route.tariffs.map((tariffa, index) => (
          <CheckoutTariffe tariffa={tariffa} />
        ))}

        <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal mb-3 ">
          <span class="h5"> Totale tratta </span>
          <span class="fw-bold">{route.priceFinal.priceFormatted}</span>
        </div>
      </div>
    </div>
  );
};

export const CheckoutTariffe = ({ tariffa }) => {
  return (
    <div>
      <div class="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
        <div className="col-8 d-flex align-items-center gap-2">
          <span>
            {tariffa.category_code === "ADU" && <IoMdPeople />}
            {tariffa.category_code === "CHD" && <FaChild />}
            {tariffa.category_code === "ANI" && <FaDog />}
            {tariffa.category_code === "LUG" && <MdLuggage />}
          </span>
          <span>
            {tariffa.qty} {tariffa.category_code === "ADU" && "Adulti"}
            {tariffa.category_code === "CHD" && "Bambini"}
            {tariffa.category_code === "ANI" && "Animali"}
            {tariffa.category_code === "LUG" && "Bagagli"}
          </span>
        </div>
        <span className="col-4 text-end">{tariffa.price.priceFormatted} </span>
      </div>
    </div>
  );
};

export const Condizioni = () => {
  return (
    <div className="col-lg-12  col bg-passeggeri rounded mt-3 mb-3 p-4">
      <h2 className="text-primary">Condizioni e Contatti</h2>
      <CheckoutPrimoPasseggero />

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
            Ho letto e accettato i termini e le condizioni
          </label>
          <div className="invalid-feedback">
            Devi accettare i termini e le condizioni
          </div>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="flexCheckDefault2"
            required
          />
          <label className="form-check-label" htmlFor="flexCheckDefault2">
            Accetto Informatica sulla privacy
          </label>
          <div className="invalid-feedback">
            Devi accettare l'informativa sulla privacy
          </div>
          <div class="mt-3 d-block d-lg-none ">
            <button
              type="submit"
              class="btn btn-success btn btn-lg w-100 text-white bg-green border-0 ms-auto fw-bold py-3"
            >
              CONFERMA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
