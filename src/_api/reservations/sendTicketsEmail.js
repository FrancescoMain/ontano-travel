import { getAuthHeader, handleLogout } from "../../utils/auth";
import { config } from "../../config/config";
import i18n from "../../i18n";

export const sendTicketsEmail = async (reservationCode, email) => {
  try {
    const response = await fetch(
      `${config.basePath}/api/booking/reservation/email?language=${i18n.language}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          reservation_code: reservationCode,
          email: email,
        }),
      }
    );

    if (response.status === 401) {
      handleLogout();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to send tickets");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      // Check for KO status in response body
      if (data.status === "KO") {
        const error = new Error(data.message || "Failed to send tickets");
        error.apiMessage = data.message;
        throw error;
      }

      return data;
    }

    return { status: "OK" };
  } catch (error) {
    console.error("Error sending tickets:", error);
    throw error;
  }
};
