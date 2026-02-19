import { getAuthHeader, handleLogout } from "../../utils/auth";
import { config } from "../../config/config";

export const askRefund = async (reservationCode, email, message) => {
  try {
    const response = await fetch(
      `${config.basePath}${config.askRefund.route}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          reservation_code: reservationCode,
          email: email,
          message: message,
        }),
      }
    );

    if (response.status === 401) {
      handleLogout();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to request refund");
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (data.status === "KO") {
        const error = new Error(data.message || "Failed to request refund");
        error.apiMessage = data.message;
        throw error;
      }

      return data;
    }

    return { status: "OK" };
  } catch (error) {
    console.error("Error requesting refund:", error);
    throw error;
  }
};
