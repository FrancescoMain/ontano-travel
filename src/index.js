import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource/inter";
import "./i18n";
import { HomePage } from "./pages/HomePage";
import "./index.css";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { ResultPage } from "./pages/ResultPage";
import { ResultPageExternal } from "./pages/ResultPageExternal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/results",
    element: <ResultPage />,
  },
  {
    path: "/results/external",
    element: <ResultPageExternal />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <Header />
    <RouterProvider router={router} />
    <Footer />
  </Provider>
);
