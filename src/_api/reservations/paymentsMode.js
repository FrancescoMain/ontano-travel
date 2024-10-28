// Funzione per fare la chiamata POST
export const paymentsMode = async () => {
  try {
    // Fai la chiamata POST
    const response = await fetch(
      "http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/payment/mode",
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

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();
      console.log("Success:", result);
      return result;
    } else {
      const text = await response.text();
      console.log("Success:", text);
      return text;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
