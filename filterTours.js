/**
 * Filtra i tour in base al codice del porto di partenza.
 * @param {Array} tours - Lista dei tour.
 * @param {string} portCode - Codice del porto di partenza.
 * @returns {Array} - Lista dei tour filtrati.
 */
function filterToursByPort(tours, portCode) {
  return tours.filter((tour) => tour.departurePort === portCode);
}

// Esempio di utilizzo
const tours = [
  {
    id: 22201,
    name: "Castellammare di Stabia",
    description: null,
    departurePort: "CAS",
    priceToPay: {
      price: 1.0,
      priceFormatted: "1,00 €",
    },
  },
  {
    id: 25102,
    name: "GIORNATA INTERA A CAPRI",
    description: "",
    departurePort: "BEV",
    priceToPay: {
      price: 50.0,
      priceFormatted: "50,00 €",
    },
  },
  {
    id: 25101,
    name: "TOUR ISCHIA & PROCIDA",
    description: "",
    departurePort: "BEV",
    priceToPay: {
      price: 61.0,
      priceFormatted: "61,00 €",
    },
  },
  {
    id: 28101,
    name: "SORRENTO & AMALFI",
    description: null,
    departurePort: "BEV",
    priceToPay: {
      price: 1.0,
      priceFormatted: "1,00 €",
    },
  },
];

const selectedPort = "BEV";
const filteredTours = filterToursByPort(tours, selectedPort);
console.log(filteredTours);
