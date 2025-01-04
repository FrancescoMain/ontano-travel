import { apiClient } from "../apiClient"; // Import the configured axios instance
import { getAuthHeader, handleLogout } from "../../utils/auth"; // Import handleLogout
import i18n from "../../i18n"; // Import the i18n instance

export const submitExternalPayment = async (quote) => {
  try {
    const response = await apiClient.post(
      `/api/booking/reservation/${quote}/submit?language=${i18n.language}`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    // Check if the response status is 200
    if (response.status === 200) {
      return { ok: true };
    } else {
      if (response.status === 401) {
        handleLogout();
        window.location.href = "/login"; // Redirect to login
      }
      return { ok: false };
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    console.error("Error submitting external payment:", error);
    return { ok: false };
  }
};
