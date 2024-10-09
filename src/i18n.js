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
      Passeggeri: "Passengers",
      "Aggiungi passeggeri": "Add passengers",
      Cerca: "SEARCH",
      "Seleziona i passeggeri": "Select passengers",
      "Adulti oltre i 12 anni": "Adults over 12 years old",
      "Bambini fino agli 11 anni": "Children up to 11 years old",
      "Inserire età bambino": "Enter child age",
      "Seleziona una tratta": "Select a route",
      "Data di partenza": "Departure date",
      "Data di ritorno": "Return date",
      Animali: "Animals",
      "Aggiungi animali": "Add animals",
      Bagagli: "Luggage",
      "Aggiungi bagagli": "Add luggage",
      Adulti: "Adults",
      Bambini: "Children",
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
      Passeggeri: "Passeggeri",
      "Aggiungi passeggeri": "Aggiungi passeggeri",
      Cerca: "CERCA",
      "Seleziona i passeggeri": "Seleziona i passeggeri",
      "Adulti oltre i 12 anni": "Adulti oltre i 12 anni",
      "Bambini fino agli 11 anni": "Bambini fino agli 11 anni",
      "Inserire età bambino": "Inserire età bambino",
      "Seleziona una tratta": "Seleziona una tratta",
      "Data di partenza": "Data di partenza",
      "Data di ritorno": "Data di ritorno",
      Animali: "Animali",
      "Aggiungi animali": "Aggiungi animali",
      Bagagli: "Bagagli",
      "Aggiungi bagagli": "Aggiungi bagagli",
      Adulti: "Adulti",
      Bambini: "Bambini",
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
