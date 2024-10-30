import i18n from "../../i18n"; // Import i18n to access the current language

// Funzione per fare la chiamata POST
export const reserve = async (nomi, cognomi, dto, payment, nTratte, quote) => {
  console.log(nomi);

  const body = {
    passengers: [],
    contactDTO: {
      contact_name: dto.nome,
      contact_surname: dto.cognome,
      contact_mail: dto.email,
      contact_phone: dto.cellulare,
    },
    paymentRequestDTO: {
      paymentMode: payment,
    },
  };

  // Itera sulle tratte e crea i dettagli dei passeggeri
  for (let i = 0; i < nTratte; i++) {
    const tratta = {
      line: i,
      details: [],
    };

    // Itera sui passeggeri, saltando il primo campo (indice 0)
    for (let j = 1; j < nomi[i].length; j++) {
      if (nomi[i][j] && cognomi[i] && cognomi[i][j]) {
        tratta.details.push({
          name: nomi[i][j].value || "",
          surname: cognomi[i][j].value || "",
          age: parseInt(cognomi[i][j].eta, 10) || 0, // Assicura che age sia sempre un numero
          sex: "M", // Puoi modificare questo valore se necessario
        });
      }
    }

    body.passengers.push(tratta);
  }

  console.log(body);

  // Get the current language or default to 'it'
  const language = i18n.language || "it";

  try {
    console.log(JSON.stringify(body));
    // Fai la chiamata POST
    const response = await fetch(
      `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/reservation/${quote}/reserve?language=${language}`,
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
    if (response.ok) {
      console.log("Success:", response.status);
      return true;
    } else {
      throw new Error("Network response was not ok");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
    } else {
      const text = await response.text();
      console.log("Success:", text);
      return text;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
