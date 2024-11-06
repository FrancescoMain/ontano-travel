import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader } from "../../utils/auth"; // Import getAuthHeader
import { config } from "../../config/config";

// Funzione per fare la chiamata POST
export const paymentsMode = async () => {
  try {
    const language = i18n.language || "it"; // Get current language or default to 'it'
    // Fai la chiamata POST
    const response = await fetch(
      `${config.basePath}${config.paymentsMode.route}?language=${language}`,
      {
        method: config.paymentsMode.method,
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

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      return result;
    } else {
      const text = await response.text();
      return text;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
