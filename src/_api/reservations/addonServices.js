import i18n from "../../i18n";
import { getAuthHeader, handleLogout } from "../../utils/auth";
import { config } from "../../config/config";

const handleResponseError = async (response, fallbackMessage) => {
  if (response.status === 401) {
    handleLogout();
    window.location.href = "/login";
  }
  const errorData = await response.json().catch(() => null);
  throw new Error(errorData?.message || fallbackMessage);
};

export const suggestAddons = async (reservationCode) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}${config.suggestAddons.route.replace(":reservation_code", reservationCode)}?language=${language}`,
      {
        method: config.suggestAddons.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      await handleResponseError(response, "Errore nel caricamento degli addon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching addon suggestions:", error);
    throw error;
  }
};

export const applyAddon = async (reservationCode, addonServiceId, qty) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}${config.applyAddon.route.replace(":reservation_code", reservationCode)}?language=${language}`,
      {
        method: config.applyAddon.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ addonServiceId, qty }),
      }
    );

    if (!response.ok) {
      await handleResponseError(response, "Errore nell'applicazione dell'addon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error applying addon:", error);
    throw error;
  }
};

export const removeAddon = async (reservationCode, addonId) => {
  const language = i18n.language || "it";

  try {
    const response = await fetch(
      `${config.basePath}${config.removeAddon.route
        .replace(":reservation_code", reservationCode)
        .replace(":addon_id", addonId)}?language=${language}`,
      {
        method: config.removeAddon.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      }
    );

    if (!response.ok) {
      await handleResponseError(response, "Errore nella rimozione dell'addon");
    }

    return await response.json();
  } catch (error) {
    console.error("Error removing addon:", error);
    throw error;
  }
};
