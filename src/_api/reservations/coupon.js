import i18n from "../../i18n";
import { getAuthHeader, handleLogout } from "../../utils/auth";
import { config } from "../../config/config";

export const applyCoupon = async (reservationCode, couponCode) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}${config.applyCoupon.route.replace("{reservation_code}", reservationCode)}?language=${language}`,
      {
        method: config.applyCoupon.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ couponCode }),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        window.location.href = "/login";
      }
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Coupon non valido");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error applying coupon:", error);
    throw error;
  }
};

export const removeCoupon = async (reservationCode) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}${config.removeCoupon.route.replace("{reservation_code}", reservationCode)}?language=${language}`,
      {
        method: config.removeCoupon.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        window.location.href = "/login";
      }
      throw new Error("Errore nella rimozione del coupon");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error removing coupon:", error);
    throw error;
  }
};
