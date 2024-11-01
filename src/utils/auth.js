import axios from "axios";
import { store } from "../app/store";
import { setAccountData } from "../features/account/accountSlice";
import i18n from "../i18n";

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

export const fetchAccountData = async () => {
  const token = getToken();
  if (token) {
    const state = store.getState();
    if (!state.account.data) {
      try {
        const response = await axios.get(
          `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/account?language=${i18n.language}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        store.dispatch(setAccountData(response.data));
      } catch (error) {
        console.error("Error fetching account data:", error);
      }
    }
  }
};
