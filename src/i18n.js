import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Cerca prenotazione": "Search reservation",
      "Solo andata": "One way",
      "Andata e ritorno": "Round trip",
      "Viaggio di andata": "Outbound trip",
      "Viaggio di ritorno": "Return trip",
      "Dettagli viaggio": "Travel details",
      "Porto di andata": "Departure port",
      "Porto di ritorno": "Return port",
      Destinazione: "Destination",
      "Dove Vuoi Andare?": "Where do you want to go?",
      "Tratta di andata": "Outbound route",
      "Tratta di ritorno": "Return route",
    },
  },
  it: {
    translation: {
      "Cerca prenotazione": "Cerca prenotazione",
      "Solo andata": "Solo andata",
      "Andata e ritorno": "Andata e ritorno",
      "Viaggio di andata": "Viaggio di andata",
      "Viaggio di ritorno": "Viaggio di ritorno",
      "Dettagli viaggio": "Dettagli viaggio",
      "Porto di andata": "Porto di andata",
      "Porto di ritorno": "Porto di ritorno",
      Destinazione: "Destinazione",
      "Dove Vuoi Andare?": "Dove Vuoi Andare?",
      "Tratta di andata": "Tratta di andata",
      "Tratta di ritorno": "Tratta di ritorno",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "it", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
