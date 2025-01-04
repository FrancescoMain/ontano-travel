import i18n from "../../i18n"; // Import i18n to access the current language
import { getAuthHeader, handleLogout } from "../../utils/auth"; // Import handleLogout
import { config } from "../../config/config"; // Import config
import Cookies from "js-cookie"; // Import js-cookie

// Funzione per fare la chiamata POST
export const reserve = async (
  nomi,
  cognomi,
  dto,
  payment,
  nTratte,
  quote,
  invoiceDTO = null
) => {
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

  // Aggiungi aff_code se presente nei cookies
  const affCode = Cookies.get("codice");
  if (affCode) {
    body.aff_code = affCode;
  }

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

  // Aggiungi invoiceDTO se presente
  if (invoiceDTO) {
    body.invoiceDTO = invoiceDTO;
  }

  // Get the current language or default to 'it'
  const language = i18n.language || "it";

  try {
    // Fai la chiamata POST
    const response = await fetch(
      `${config.basePath}${config.reserve.route}/${quote}/reserve?language=${language}`,
      {
        method: config.reserve.method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // Add authorization header
        },
        body: JSON.stringify(body),
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
    if (response.ok) {
      return true;
    } else {
      throw new Error("Network response was not ok");
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
    } else {
      const text = await response.text();
      return text;
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
