import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader } from "../../utils/auth"; // Import getAuthHeader
import { config } from "../../config/config";

export const lightboxReserve = async (quoteId) => {
  try {
    const language = i18n.language || "it"; // Get current language or default to 'it'
    // Fai la chiamata GET
    const response = await fetch(
      `${config.basePath}${config.lightboxReserve.route}/${quoteId}/lightbox?language=${language}`,
      {
        method: config.lightboxReserve.method,
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
