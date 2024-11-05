import { apiClient } from "../apiClient"; // Import the configured axios instance
import { getAuthHeader } from "../../utils/auth"; // Import the getAuthHeader function
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
      return { ok: false };
    }
  } catch (error) {
    console.error("Error submitting external payment:", error);
    return { ok: false };
  }
};
