export const getRoute = async () => {
  try {
    // Fai la chiamata GET
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/route`,
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
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};