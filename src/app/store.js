import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import viaggioFormReducer from "../features/viaggio/viaggioFormSlice";
import spinnerReducer from "../features/spinner/spinnerSlice";
import viaggioReducer from "../features/viaggio/findTratta";
import routesReducer from "../features/routes/routesSlice";
import resultTrattaReducer from "../features/viaggio/resultTratta";
import accountReducer from "../features/account/accountSlice"; // Import accountReducer
import payByLinkReducer from "../features/payByLink/payByLinkSlice"; // Import payByLinkReducer
import tourReducer from "../features/tour/tourSlice"; // Import tourReducer
import reservationReducer from "../features/reservation/reservationSlice"; // Import reservationReducer
import registraAgenziaReducer from "../features/registraAgenzia/registraAgenziaSlice"; // Import registraAgenziaReducer
import ricercaAgenziaReducer from "../features/ricercaAgenzia/ricercaAgenziaSlice"; // Import ricercaAgenziaReducer
import dettaglioAgenziaReducer from "../features/ricercaAgenzia/dettaglioAgenziaSlice"; // Import dettaglioAgenziaReducer
import prenotazioniReducer from "../features/reservation/prenotazioniSlice"; // Import prenotazioniReducer
import estrattoContoReducer from "../features/estrattoConto/estrattoContoSlice"; // Import estrattoContoReducer
import rendicontazioneReducer from "../features/rendicontazione/rendicontazioneSlice"; // Import rendicontazioneReducer
import routeReducer from "../features/routes/routeAsyncSlice"; // Import routeReducer
import tabellonePartenzeReducer from "../features/tabellonePartenze/tabellonePartenzeSlice"; // Import tabellonePartenzeReducer
import nationalitiesReducer from "../features/nationalities/nationalitiesSlice"; // Import nationalitiesReducer
import documentTypesReducer from "../features/documentTypes/documentTypesSlice"; // Import documentTypesReducer

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    viaggioForm: viaggioFormReducer,
    spinner: spinnerReducer,
    tratte: viaggioReducer,
    routes: routesReducer,
    resultsTratta: resultTrattaReducer,
    account: accountReducer, // Add account reducer
    payByLink: payByLinkReducer, // Add payByLink reducer
    tour: tourReducer, // Add tour reducer
    reservation: reservationReducer, // Add reservation reducer
    registraAgenzia: registraAgenziaReducer, // Add registraAgenzia reducer
    ricercaAgenzia: ricercaAgenziaReducer, // Add ricercaAgenzia reducer
    dettaglioAgenzia: dettaglioAgenziaReducer, // Add dettaglioAgenzia reducer
    prenotazioni: prenotazioniReducer, // Add prenotazioni reducer
    estrattoConto: estrattoContoReducer, // Add estrattoConto reducer
    rendicontazione: rendicontazioneReducer, // Add rendicontazione reducer
    route: routeReducer, // Add route reducer
    tabellonePartenze: tabellonePartenzeReducer, // Add tabellonePartenze reducer
    nationalities: nationalitiesReducer, // Add nationalities reducer
    documentTypes: documentTypesReducer, // Add documentTypes reducer
  },
});
