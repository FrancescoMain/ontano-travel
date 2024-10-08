import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import viaggioFormReducer from "../features/viaggio/viaggioFormSlice";

export const store = configureStore({
  reducer: { counter: counterReducer, viaggioForm: viaggioFormReducer },
});
