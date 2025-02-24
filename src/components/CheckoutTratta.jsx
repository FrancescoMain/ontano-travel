import React, { useState } from "react";
import dayjs from "dayjs";
import { CheckoutTariffe } from "./CheckoutTariffe";
import travelmar from "../assets/travelmar.png";
import snav from "../assets/snav.png";
import alilauro from "../assets/Logo-AliLauro.png";
import alilauroGruson from "../assets/Alilauro Gruson.png";
import Nlg from "../assets/nlg.png";
import { formatDateTime } from "../utils/dateUtils"; // Import formatDateTime function
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import alicost from "../assets/alicost.png";
import coastLines from "../assets/coast-lines.png";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const CheckoutTratta = ({
  route,
  post,
  onRefund,
  isAdmin,
  paymentMethod,
}) => {
  const { i18n } = useTranslation();
  const language = i18n.language;

  const formattedDeparture = formatDateTime(dayjs(route.departure).tz("Europe/Rome"), language);
  const formattedArrival = formatDateTime(dayjs(route.arrive).tz("Europe/Rome"), language);

  // Process tariffs
  let processedTariffs = [];

  if (route.company === "Snav") {
    // Group ADU, CHD, INF into 'Passeggeri'  
    let passengerTariffs = route.tariffs.filter((t) =>
      ["ADU", "CHD", "INF"].includes(t.category_code)
    );
    let otherTariffs = route.tariffs.filter(
      (t) => !["ADU", "CHD", "INF"].includes(t.category_code)
    );

    // Count total passengers and breakdown
    let totalPassengers = 0;
    let adultCount = 0;
    let childCount = 0;
    let infantCount = 0;

    passengerTariffs.forEach((t) => {
      totalPassengers += t.qty;
      if (t.category_code === "ADU") {
        adultCount += t.qty;
      } else if (t.category_code === "CHD") {
        childCount += t.qty;
      } else if (t.category_code === "INF") {
        infantCount += t.qty;
      }
    });

    // Create the description string
    let passengerDescription = `${totalPassengers} Passeggeri (`;
    let descriptions = [];
    if (adultCount > 0)
      descriptions.push(`${adultCount} Adult${adultCount > 1 ? "i" : "o"}`);
    if (childCount > 0)
      descriptions.push(`${childCount} Bambin${childCount > 1 ? "i" : "o"}`);
    if (infantCount > 0)
      descriptions.push(`${infantCount} Infant${infantCount > 1 ? "i" : "e"}`);
    passengerDescription += descriptions.join(", ") + ")";

    // Calculate price for passengers
    let totalRoutePrice = route.priceFinal.price;
    let otherTariffsTotalPrice = otherTariffs.reduce(
      (sum, t) => sum + t.price.price,
      0
    );
    let passengerPrice = totalRoutePrice - otherTariffsTotalPrice;

    let passengerTariff = {
      category_code: "PSG",
      qty: totalPassengers,
      description: passengerDescription,
      price: {
        priceFormatted: passengerPrice.toLocaleString("it-IT", {
          style: "currency",
          currency: "EUR",
        }),
        price: passengerPrice,
      },
    };

    processedTariffs = [passengerTariff, ...otherTariffs];
  } else {
    // For other companies, keep tariffs as is
    processedTariffs = route.tariffs;
  }

  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState(0);
  const [executeRefund, setExecuteRefund] = useState(true);

  const handleRefundClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleRefundSubmit = (e) => {
    e.preventDefault();
    onRefund(route.id, amount, executeRefund);
    setShowModal(false);
  };
  return (
    <div>
      <div class="bg-aliceblue row g-0 pb-2 pt-3">
        <div class="text-start col-5">
          <p class="h5 fw-bold mb-0">{route.from}</p>
        </div>
        <div class="text-center col-2">
          {route.company === "Travelmar" && (
            <img className="img-logo" src={travelmar} alt="Travelmar" />
          )}
          {route.company === "Snav" && (
            <img className="img-logo" src={snav} alt="Snav" />
          )}
          {route.company === "Snav Gescab" && (
            <img className="img-logo" src={snav} alt="Snav Gescab" />
          )}
          {route.company === "Alilauro" && (
            <img className="img-logo" src={alilauro} alt="Alilauro" />
          )}
          {route.company === "Nlg" && (
            <img className="img-logo" src={Nlg} alt="Nlg" />
          )}
          {route.company === "Alicost" && (
            <img className="img-logo" src={alicost} alt="Alicost" />
          )}
          {route.company === "Alilauro Gruson" && (
            <img
              className="img-logo"
              src={alilauroGruson}
              alt="Alilauro Gruson"
            />
          )}
          {route.company === "Coast Lines" && (
            <img
              className="img-logo coast-lines"
              src={coastLines}
              alt="Coast Lines"
            />
          )}
        </div>
        <div class="text-end col-5">
          <p class="h5 fw-bold mb-0">{route.to}</p>
        </div>
        <div class="text-start col-4">
          <p class="mb-0 text-capitalize">
            {formattedDeparture.date} {formattedDeparture.time}
          </p>
        </div>
        <div class="text-center col-4"></div>
        <div class="text-end col-4">
          <p class="mb-0 text-capitalize">
            {formattedArrival.date} {formattedArrival.time}
          </p>
        </div>
      </div>
      <div class="list-group list-group-flush bg-aliceblue">
        {processedTariffs.map((tariffa, index) => (
          <CheckoutTariffe
            tariffa={tariffa}
            company={route.company}
            key={index}
          />
        ))}
        {post && (
          <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal mt-2 ">
            <span className="h6">Stato</span>
            <span className="h6 ">
              {route?.status === "SUBMITTED" && "Sottomesso"}
              {route?.status === "CANCELLED" && "Cancellato"}
            </span>
          </div>
        )}
        <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal mb-3 ">
          <span class="h5"> Totale tratta </span>
          <span class="fw-bold">{route.priceFinal.priceFormatted}</span>
        </div>
        {route?.status === "CANCELLED" && (
          <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal mb-3 ">
            <span class="h5"> Rimborso </span>
            <span class="fw-bold">{route.priceReturned.priceFormatted}</span>
          </div>
        )}
        {isAdmin && route?.status !== "CANCELLED" && (
          <>
            <button
              className="btn btn-danger mt-2 mb-2"
              onClick={handleRefundClick}
            >
              Richiedi Rimborso
            </button>

            {showModal && (
              <>
                {/* Backdrop */}
                <div className="modal-backdrop fade show"></div>
                {/* Modale */}
                <div className="modal show d-block" tabIndex="-1">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Richiedi Rimborso</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={handleModalClose}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form onSubmit={handleRefundSubmit}>
                          <div className="mb-3">
                            <label htmlFor="formAmount" className="form-label">
                              Importo
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              id="formAmount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              required
                            />
                          </div>
                          {paymentMethod === "EXTERNAL_PAYMENT" ? (
                            ""
                          ) : (
                            <div className="form-check mb-3">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                id="formExecuteRefund"
                                checked={executeRefund}
                                onChange={(e) =>
                                  setExecuteRefund(e.target.checked)
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor="formExecuteRefund"
                              >
                                Esegui Rimborso Banca
                              </label>
                            </div>
                          )}

                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={handleModalClose}
                            >
                              Annulla
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Conferma
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
