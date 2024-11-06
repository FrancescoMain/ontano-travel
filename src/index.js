import React from "react";
import ReactDOM from "react-dom/client";
import { store } from "./app/store";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
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
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { fetchAccountData } from "./utils/auth";
import { setAccountData } from "./features/account/accountSlice";
import { PayByLinkSuccess } from "./pages/PayByLinkSuccess";
import { CercaPrenotazione } from "./pages/CercaPrenotazione";

const App = () => {
  const navigate = useNavigate();
  let accountDataFetched = false;

  store.subscribe(() => {
    const token =
      localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
    if (token && !accountDataFetched) {
      fetchAccountData();
      accountDataFetched = true;
    }
  });

  return (
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
      <Header navigate={navigate} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/results/external" element={<ResultPageExternal />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<Success />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recovery" element={<RecoveryPassword />} />
        <Route path="/pay-by-link-success" element={<PayByLinkSuccess />} />
        <Route path="/cerca-prenotazione" element={<CercaPrenotazione />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
      {/* <Footer /> */}
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
