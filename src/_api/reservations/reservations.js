export const getReservation = async (quoteId) => {
  console.log("getReservation", quoteId);

  try {
    // Fai la chiamata GET
    const response = await fetch(
      `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/reservation/${quoteId}`,
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
