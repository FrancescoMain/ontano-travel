import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "@fontsource/inter";
import "./i18n";
import { HomePage } from "./pages/HomePage";
import "./index.css";
import { Header } from "./components/Header/Header";
import { ResultPage } from "./pages/ResultPage";
import { ResultPageExternal } from "./pages/ResultPageExternal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Checkout } from "./pages/Checkout";
import { Success } from "./pages/Success";
import { Login } from "./pages/Login";
import { RecoveryPassword } from "./pages/RecoveryPassword";
import { fetchAccountData } from "./utils/auth";
import { PayByLinkSuccess } from "./pages/PayByLinkSuccess";
import { CercaPrenotazione } from "./pages/CercaPrenotazione";
import SearchGuest from "./pages/SearchGuest"; // Import SearchGuest
import { RegistraAgenzia } from "./pages/RegistraAgenzia";
import { RicercaAgenzia } from "./pages/RicercaAgenzia";
import { DettaglioAgenzia } from "./pages/DettaglioAgenzia"; // Import DettaglioAgenzia
import { Prenotazioni } from "./pages/Prenotazioni"; // Import Prenotazioni
import { ReservationDetail } from "./pages/ReservationDetail"; // Import ReservationDetail
import AdminEstrattoConto from "./pages/AdminEstrattoConto"; // Import AdminEstrattoConto
import AgencyEstrattoConto from "./pages/AgencyEstrattoConto"; // Import AgencyEstrattoConto
import Rendicontazione from "./pages/Rendicontazione"; // Import Rendicontazione
import { Dashboard } from "./pages/Dashboard"; // Import Dashboard
import { Recovery } from "./pages/Recovery"; // Import Recovery
import { SetPassword } from "./pages/SetPassword"; // Import SetPassword
import { RecoveryFinish } from "./pages/RecoveryFinish"; // Import RecoveryFinish
import { TabellonePartenze } from "./pages/TabellonePartenze"; // Import TabellonePartenze
import { DashboardAgenzia } from "./pages/DashboardAgenzia";
import { RestultTour } from "./pages/RestultTour";
import { Footer } from "./components/Footer/Footer";

const App = () => {
  const token =
    localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
  useEffect(() => {
    if (token) {
      fetchAccountData();
    }
  }, [token]);

  return (
    <Provider store={store}>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
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
        <div style={{ flex: "1" }}>
          <Routes>
            <Route path="/tabellone-partenze" element={<TabellonePartenze />} />{" "}
            {/* Add route */}
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/results" element={<ResultPage />} />
                    <Route
                      path="/results/external"
                      element={<ResultPageExternal />}
                    />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/recovery" element={<Recovery />} />{" "}
                    {/* Add route */}
                    <Route path="/recovery" element={<RecoveryPassword />} />
                    <Route
                      path="/pay-by-link-success"
                      element={<PayByLinkSuccess />}
                    />
                    <Route
                      path="/cerca-prenotazione"
                      element={<CercaPrenotazione />}
                    />
                    <Route path="/result-guest" element={<SearchGuest />} />
                    <Route
                      path="/registra-agenzia"
                      element={<RegistraAgenzia />}
                    />
                    <Route
                      path="/ricerca-agenzia"
                      element={<RicercaAgenzia />}
                    />
                    <Route path="/agenzia/:id" element={<DettaglioAgenzia />} />{" "}
                    <Route path="/prenotazioni" element={<Prenotazioni />} />{" "}
                    <Route
                      path="/reservation/:reservationCode"
                      element={<ReservationDetail />}
                    />{" "}
                    {/* Add route */}
                    <Route
                      path="/admin-estratto-conto"
                      element={<AdminEstrattoConto />}
                    />{" "}
                    {/* Add route */}
                    <Route
                      path="/agency-estratto-conto"
                      element={<AgencyEstrattoConto />}
                    />{" "}
                    {/* Add route */}
                    <Route
                      path="/rendicontazione"
                      element={<Rendicontazione />}
                    />{" "}
                    {/* Add route */}
                    <Route path="/dashboard" element={<Dashboard />} />{" "}
                    {/* Add route */}
                    <Route
                      path="/set-password"
                      element={<SetPassword />}
                    />{" "}
                    {/* Add route */}
                    <Route
                      path="/account/reset/finish"
                      element={<RecoveryFinish />}
                    />{" "}
                    {/* Add route */}
                    <Route
                      path="/dashboard-agenzia"
                      element={<DashboardAgenzia />}
                    />
                    <Route path="/result-tour" element={<RestultTour />} />
                    <Route path="*" element={<HomePage />} />
                  </Routes>
                </>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <App />
  </Router>
);
