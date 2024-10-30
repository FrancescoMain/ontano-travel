import i18n from "../../i18n"; // Import i18n to access the current language

export const lightboxReserve = async (quoteId) => {
  console.log("getReservation", quoteId);

  try {
    const language = i18n.language || "it"; // Get current language or default to 'it'
    // Fai la chiamata GET
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/payment/${quoteId}/lightbox?language=${language}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
