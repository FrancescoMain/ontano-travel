// Funzione per fare la chiamata POST
export const postQuote = async ({
  dataAndata,
  dataRitorno,
  adulti,
  bambini,
  etaBambini,
  animali,
  bagagli,
  bigliettoAndata,
  bigliettoRitorno,
}) => {
  // Crea l'array dei passeggeri
  const passengers = [
    ...Array.from({ length: parseInt(adulti, 10) }, () => ({ age: 18 })), // Aggiungi 18 per ogni adulto
    ...etaBambini.map((age) => ({ age: parseInt(age, 10) })), // Aggiungi l'età di ogni bambino
  ];

  // Crea il body della richiesta
  const body = {
    search_result_id: bigliettoAndata?.result_id,
    params: {
      passengers,
      animals: parseInt(animali, 10),
      luggages: parseInt(bagagli, 10),
    },
    departure: {
      search_result_id: bigliettoAndata?.result_id,
      params: {
        passengers,
        animals: parseInt(animali, 10),
        luggages: parseInt(bagagli, 10),
      },
    },
    return: bigliettoRitorno
      ? {
          search_result_id: bigliettoRitorno?.result_id,
          params: {
            passengers,
            animals: parseInt(animali, 10),
            luggages: parseInt(bagagli, 10),
          },
        }
      : null,
  };

  try {
    // Fai la chiamata POST
    const response = await fetch(
      "https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/reservation/quote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
