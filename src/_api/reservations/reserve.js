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
  invoiceDTO = null,
  generi,
  numeriDiDocumento,
  tipiDiDocumento,
  nazionalità,
  luoghiDiNascita,
  dateDiNascita,
  disabilità
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

  // Funzione per calcolare l'età
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
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
        const birthDate =
          dateDiNascita && dateDiNascita[i] && dateDiNascita[i][j]
            ? dateDiNascita[i][j].value
            : null;
        const age = birthDate
          ? calculateAge(birthDate)
          : parseInt(cognomi[i][j].eta, 10) || 0;

        tratta.details.push({
          name: nomi[i][j].value || "",
          surname: cognomi[i][j].value || "",
          age: age, // Usa l'età calcolata o quella presente nel cognome
          sex: generi && generi[i] && generi[i][j] ? generi[i][j].value : "M", // Usa il genere se disponibile
          cure:
            disabilità && disabilità[i] && disabilità[i][j]
              ? disabilità[i][j].value
              : false, // Usa disabilità se disponibile
          nation:
            nazionalità && nazionalità[i] && nazionalità[i][j]
              ? nazionalità[i][j].value
              : "", // Usa nazionalità se disponibile
          birthPlace:
            luoghiDiNascita && luoghiDiNascita[i] && luoghiDiNascita[i][j]
              ? luoghiDiNascita[i][j].value
              : "", // Usa luogo di nascita se disponibile
          birthDate: birthDate || "", // Usa data di nascita se disponibile
          documentReference:
            numeriDiDocumento && numeriDiDocumento[i] && numeriDiDocumento[i][j]
              ? numeriDiDocumento[i][j].value
              : "", // Usa numero di documento se disponibile
          documentTypeCode:
            tipiDiDocumento && tipiDiDocumento[i] && tipiDiDocumento[i][j]
              ? tipiDiDocumento[i][j].value
              : "", // Usa tipo di documento se disponibile
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
