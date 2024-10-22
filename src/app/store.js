import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import viaggioFormReducer from "../features/viaggio/viaggioFormSlice";
import spinnerReducer from "../features/spinner/spinnerSlice";
import viaggioReducer from "../features/viaggio/findTratta";
import routesReducer from "../features/routes/routesSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    viaggioForm: viaggioFormReducer,
    spinner: spinnerReducer,
    tratte: viaggioReducer,
    routes: routesReducer,
  },
});
