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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Checkout } from "./pages/Checkout";
import { Success } from "./pages/Success";
import { Login } from "./pages/Login";
import { RecoveryPassword } from "./pages/RecoveryPassword"; // Import RecoveryPassword
import { fetchAccountData } from "./utils/auth"; // Import fetchAccountData
import { setAccountData } from "./features/account/accountSlice"; // Import setAccountData
import { PayByLinkSuccess } from "./pages/PayByLinkSuccess"; // Import PayByLinkSuccess

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
  {
    path: "/checkout",
    element: <Checkout />,
  },
  {
    path: "/success",
    element: <Success />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/recovery",
    element: <RecoveryPassword />, // Add RecoveryPassword route
  },
  {
    path: "/pay-by-link-success",
    element: <PayByLinkSuccess />, // Add PayByLinkSuccess route
  },
]);

let accountDataFetched = false; // Add a flag to track if account data has been fetched

store.subscribe(() => {
  const token =
    localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
  if (token && !accountDataFetched) {
    fetchAccountData();
    accountDataFetched = true; // Set the flag to true after fetching account data
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />

    <Header />
    <RouterProvider router={router} />
    {/* <Footer /> */}
  </Provider>
);
