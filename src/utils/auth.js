import axios from "axios";
import { store } from "../app/store";
import { setAccountData } from "../features/account/accountSlice";
import i18n from "../i18n";
import { config } from "../config/config"; // Import config
import { toast } from "react-toastify";

export const getToken = () => {
  return localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
};

export const handleLogout = () => {
  localStorage.removeItem("id_token");
  sessionStorage.removeItem("id_token");
  window.location.href = "/";
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

let accountDataFetched = false;

export const fetchAccountData = async () => {
  if (accountDataFetched) return;
  const token = getToken();
  if (token) {
    const state = store.getState();
    if (!state.account.data) {
      try {
        const response = await axios.get(
          `${config.basePath}/api/booking/account?language=${i18n.language}`,
          {
            headers: getAuthHeader(),
          }
        );
        if (response.status === 200) {
          store.dispatch(setAccountData(response.data));
          accountDataFetched = true;
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
        toast.error("Errore di autenticazione.");
        handleLogout();
      }
    }
  }
};
