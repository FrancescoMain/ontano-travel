import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader } from "../../utils/auth"; // Import getAuthHeader
import { config } from "../../config/config"; // Import config

// Funzione per fare la chiamata POST
export const postQuote = async ({ tratte, etaBambini }) => {
  let body = tratte.map((tratta) => {
    // Crea l'array dei passeggeri
    const passengers = [
      ...Array.from({ length: parseInt(tratta.adulti, 10) }, () => ({
        age: 18,
      })), // Aggiungi 18 per ogni adulto
      ...tratta.etaBambini.map((age) => ({ age: parseInt(age, 10) })), // Aggiungi l'età di ogni bambino
    ];

    // Crea l'oggetto per ogni tratta
    return {
      search_result_id: tratta.data.result_id,
      params: {
        passengers,
        animals: parseInt(tratta.animali, 10) || 0,
        luggages: parseInt(tratta.bagagli, 10) || 0,
      },
    };
  });

  // Get the current language or default to 'it'
  const language = i18n.language || "it";

  try {
    // Fai la chiamata POST
    const response = await fetch(
      `${config.basePath}${config.postQuote.route}?language=${language}`,
      {
        method: config.postQuote.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // Add authorization header
        },
        body: JSON.stringify(body),
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
