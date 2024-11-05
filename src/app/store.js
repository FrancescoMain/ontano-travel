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
  },
});
