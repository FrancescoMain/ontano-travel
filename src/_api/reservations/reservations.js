import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader } from "../../utils/auth"; // Import getAuthHeader
import { config } from "../../config/config"; // Import config

export const getReservation = async (quoteId) => {
  // Get the current language or default to 'it'
  const language = i18n.language || "it";

  try {
    // Fai la chiamata GET
    const response = await fetch(
      `${config.basePath}${config.getReservation.route}/${quoteId}?language=${language}`,
      {
        method: config.getReservation.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // Add authorization header
        },
      }
    );

    // Controlla se la risposta è ok
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Ottieni il risultato
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
