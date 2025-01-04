import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader, handleLogout } from "../../utils/auth"; // Import handleLogout
import { config } from "../../config/config";

export const getStore = async () => {
  // Get the current language or default to 'it'
  const language = i18n.language || "it";

  try {
    // Fai la chiamata GET
    const response = await fetch(
      `${config.basePath}${config.getStore.route}?language=${language}`,
      {
        method: config.getStore.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // Add authorization header
        },
      }
    );

    // Controlla se la risposta è ok
    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        window.location.href = "/login"; // Redirect to login
      }
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
