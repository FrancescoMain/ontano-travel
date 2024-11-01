import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader } from "../../utils/auth"; // Import getAuthHeader

export const getReservation = async (quoteId) => {
  console.log("getReservation", quoteId);

  // Get the current language or default to 'it'
  const language = i18n.language || "it";

  try {
    // Fai la chiamata GET
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/reservation/${quoteId}?language=${language}`,
      {
        method: "GET",
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
    console.log("Success:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
