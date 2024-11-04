import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader } from "../../utils/auth"; // Import getAuthHeader

// Funzione per fare la chiamata POST
export const paymentsMode = async () => {
  try {
    const language = i18n.language || "it"; // Get current language or default to 'it'
    // Fai la chiamata POST
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/payment/mode?language=${language}`,
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
