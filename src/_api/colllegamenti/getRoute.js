import i18n from "../../i18n"; // Import i18n to access the current language
import { config } from "../../config/config"; // Import config to access basePath

export const getRoute = async () => {
  const language = i18n.language || "it"; // Get the current language or default to 'it'
  const url = `${config.basePath}${config.getRoute.route}?language=${language}`;

  try {
    // Fai la chiamata GET
    const response = await fetch(url, {
      method: config.getRoute.method,
      headers: {
        "Content-Type": "application/json",
      },
    });

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
