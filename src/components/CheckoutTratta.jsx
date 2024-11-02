import React from "react";
import dayjs from "dayjs";
import { IoMdPeople } from "react-icons/io";
import { CheckoutTariffe } from "./CheckoutTariffe";

export const CheckoutTratta = ({ route }) => {
  const formattedDeparture = dayjs(route.departure).format("DD/MMM/YYYY HH:mm");
  const formattedArrival = dayjs(route.arrive).format("DD/MMM/YYYY HH:mm");

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
        {processedTariffs.map((tariffa, index) => (
          <CheckoutTariffe
            tariffa={tariffa}
            company={route.company}
            key={index}
          />
        ))}

        <div class="bg-aliceblue d-flex justify-content-between align-items-center subtotal mb-3 ">
          <span class="h5"> Totale tratta </span>
          <span class="fw-bold">{route.priceFinal.priceFormatted}</span>
        </div>
      </div>
    </div>
  );
};
