import { basePathDev, basePathProd } from "./basePath";

export const config = {
  basePath: basePathDev,
  // basePath: basePathProd,
  authenticate: { route: "/api/authenticate", method: "POST" },
  getRoute: { route: "/api/booking/route", method: "GET" },
  fetchPriceData: { route: "/api/booking/route/search", method: "GET" },
  fetchPriceSearchResult: {
    route: "/api/booking/price/searchresult",
    method: "GET",
  },
  reserve: { route: "/api/booking/reservation", method: "POST" },
  getReservation: { route: "/api/booking/reservation", method: "GET" },
  postQuote: { route: "/api/booking/reservation/multi/quote", method: "POST" },
  paymentsMode: { route: "/api/booking/payment/mode", method: "GET" },
  payByLinkReserve: { route: "/api/booking/payment", method: "GET" },
  lightboxReserve: { route: "/api/booking/payment", method: "GET" },
  getStore: { route: "/api/booking/store/info", method: "GET" },
  fetchAccountData: { route: "/api/booking/account", method: "GET" },
  fetchReservation: {
    route: "/api/booking/reservation/:bookingCode/guest",
    method: "GET",
  },
  fetchReservationLogged: {
    route: "/api/booking/reservation/:bookingCode/logged",
    method: "GET",
  },
  postAgency: { route: "/api/booking/agency", method: "POST" },
  fetchAgenzie: {
    route: "/api/booking/agency/search",
    method: "GET",
  },
  fetchDettaglioAgenzia: {
    route: "/api/booking/agency/:id/get",
    method: "GET",
  }, // Add fetchDettaglioAgenzia route
  searchReservations: {
    route: "/api/booking/reservation/search",
    method: "GET",
  },
  fetchEstrattoConto: { route: "/api/booking/estrattoconto/search", method: "GET" }, // Add fetchEstrattoConto route
  approveEstrattoConto: { route: "/api/booking/estrattoconto", method: "POST" }, // Add approveEstrattoConto route
};
