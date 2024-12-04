import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "Cerca prenotazione": "Search reservation",
      "Codice Prenotazione": "Booking Code",
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
      Cerca: "Search",
      "Seleziona i passeggeri": "Select passengers",
      "Adulti oltre i 12 anni": "Adults over 12 years old",
      "Bambini fino agli 11 anni": "Children up to 11 years old",
      "Inserire età bambino": "Enter child age",
      "Seleziona una tratta": "Select a route",
      "Data di partenza": "Departure date",
      "Data di ritorno": "Return date",
      Animali: "Animals",
      "Animali Domestici": "Pets",
      "Aggiungi animali": "Add animals",
      Bagagli: "Luggage",
      "Aggiungi bagagli": "Add luggage",
      Adulti: "Adults",
      Bambini: "Children",
      "Inserire età bambino": "Enter child age",
      "Oltre i 12 anni": "Over 12 years old",
      "Fino agli 11 anni": "Up to 11 years old",
      Collegamento: "Link",
      Tour: "Tour",
      "Inserire età bambini": "Enter child age",
      Multitratta: "Multi-route",
      "Viaggio ": "Travel ",
      "+ Aggiungi Rotta": "+ Add Route",
      Login: "Login",
      Username: "Username",
      "Enter username": "Enter username",
      "Please enter your username.": "Please enter your username.",
      Password: "Password",
      "Enter password": "Enter password",
      "Please enter your password.": "Please enter your password.",
      "Remember me": "Remember me",
      "Forgot Password?": "Forgot Password?",
      "Recovery Password": "Recovery Password",
      Email: "Email",
      "Please enter your email.": "Please enter your email.",
      "Recover Password": "Recover Password",
      "Condizioni e Contatti": "Terms and Contacts",
      "Ho letto e accettato i": "I have read and accepted the",
      "termini e condizioni": "terms and conditions",
      Accetto: "I accept",
      "Informativa sulla privacy": "Privacy Policy",
      Prenotazioni: "Reservations",
      Dashboard: "Dashboard",
      Logout: "Logout",
      "Link inviato con successo": "Link sent successfully",
      "Completa il pagamento": "Complete the payment",
      "Il link scade tra": "The link expires in",
      "ID della prenotazione": "Reservation ID",
      "Tutti i diritti riservati": "All rights reserved",
      "An error occurred. Please try again.": "An error occurred. Please try again.",
      "Invalid username or password.": "Invalid username or password.",
      "Prenotazione non trovata": "Reservation not found",
      "Register Agency": "Registration Agency",
      "Agency Name": "Agency Name",
      "Ragione Sociale": "Ragione Sociale",
      "Partita IVA": "Partita IVA",
      Address: "Address",
      City: "City",
      CAP: "CAP",
      Province: "Province",
      Nationality: "Nationality",
      Telephone: "Telephone",
      Email: "Email",
      Referente: "Referente",
      Password: "Password",
      Submit: "Submit",
      "An agency with this name already exists.": "An agency with this name already exists.",
      "An agency with this Ragione Sociale already exists.": "An agency with this Ragione Sociale already exists.",
      "An agency with this Partita IVA already exists.": "An agency with this Partita IVA already exists.",
      "An agency with this email already exists.": "An agency with this email already exists.",
      "Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character.": "Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character.",
      "CAP must be exactly 5 digits.": "CAP must be exactly 5 digits.",
      "Partita IVA must be exactly 11 digits.": "Partita IVA must be exactly 11 digits.",
      "Loading...": "Loading...",
      "Agency registered successfully!": "Agency registered successfully!",
      "Agency registered successfully! You will receive an email when the site administrator accepts your registration request.": "Agency registered successfully! You will receive an email when the site administrator accepts your registration request.",
      "Registrazione Agenzia": "Agency Registration",
      "This will be used for logging in": "This will be used for logging in",
      "Ricerca Agenzia": "Search Agency",
      Name: "Name",
      "Abilita Pagamento Estratto Conto": "Enable Payment Statement",
      "Abilita Pagamento Pay By Link": "Enable Payment Pay By Link",
      Attivo: "Active",
      "Percentual Commissione": "Commission Percentage",
      "Diritti Di Prenotazione": "Booking Rights",
      "Dettaglio Agenzia": "Agency Details",
      Yes: "Yes",
      No: "No",
      Close: "Close",
      Save: "Save",
      "Visualizza Estratto Conto": "View Statement",
      "Tutti": "All",
      "Da approvare": "To Approve",
      "Approvati": "Approved",
      "Name Agency": "Name Agency",
      "Month": "Month",
      "Approved": "Approved",
      "Upload Date": "Upload Date",
      "Approval Date": "Approval Date",
      "Actions": "Actions",
      "Search by name": "Search by name",
      "Search": "Search",
      "Error": "Error",
      "Page Size": "Page Size",
      "From Date": "From Date",
      "To Date": "To Date",
      "Scaricando...": "Downloading...",
      "Scarica": "Download",
      "Codice della prenotazione": "Booking Code",
      "Data di inizio": "Start Date",
      "Data di fine": "End Date",
      "Agenzia": "Agency",
      "Email dell'ospite": "Guest Email",
      "Nome del contatto": "Contact Name",
      "Cognome del contatto": "Contact Surname",
      "Data Prenotazione": "Booking Date",
      "Prezzo": "Price",
      "Email Contatto": "Contact Email",
      "Nome Contatto": "Contact Name",
      "Cognome Contatto": "Contact Surname",
      "Nome Agenzia": "Agency Name",
      "Rendicontazione": "Reporting",
      "Contenuto della pagina di rendicontazione.": "Content of the reporting page.",
      "Both dates are required.": "Both dates are required.",
      "Select Agency": "Select Agency",
      "Set New Password": "Set New Password",
      "Old Password": "Old Password",
      "New Password": "New Password",
      "Confirm Password": "Confirm Password",
      "Passwords do not match": "Passwords do not match",
      "Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character": "Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character",
      "Password set successfully": "Password set successfully",
      "Failed to set password": "Failed to set password",
      "Set Password": "Set Password",
      "Recovery": "Recovery",
      "Change Password": "Change Password",
      "Password changed successfully": "Password changed successfully",
      "Password Recovery": "Password Recovery",
      "Send Recovery Email": "Send Recovery Email",
      "Recovery email sent successfully.": "Recovery email sent successfully.",
      "Back to Login": "Back to Login",
    },
  },
  it: {
    translation: {
      "Cerca prenotazione": "Cerca prenotazione",
      "Codice Prenotazione": "Codice Prenotazione",
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
      Cerca: "Cerca",
      "Seleziona i passeggeri": "Seleziona i passeggeri",
      "Adulti oltre i 12 anni": "Adulti oltre i 12 anni",
      "Bambini fino agli 11 anni": "Bambini fino agli 11 anni",
      "Inserire età bambino": "Inserire età bambino",
      "Seleziona una tratta": "Seleziona una tratta",
      "Data di partenza": "Data di partenza",
      "Data di ritorno": "Data di ritorno",
      Animali: "Animali",
      "Animali Domestici": "Animali domestici",
      "Aggiungi animali": "Aggiungi animali",
      Bagagli: "Bagagli",
      "Aggiungi bagagli": "Aggiungi bagagli",
      Adulti: "Adulti",
      Bambini: "Bambini",
      "Inserire età bambino": "Inserire età bambino",
      "Oltre i 12 anni": "Oltre i 12 anni",
      "Fino agli 11 anni": "Fino agli 11 anni",
      Collegamento: "Collegamento",
      Tour: "Tour",
      Login: "Accedi",
      Username: "Nome utente",
      "Enter username": "Inserisci nome utente",
      "Please enter your username.": "Per favore inserisci il tuo nome utente.",
      Password: "Password",
      "Enter password": "Inserisci password",
      "Please enter your password.": "Per favore inserisci la tua password.",
      "Remember me": "Ricordami",
      "Forgot Password?": "Password dimenticata?",
      "Recovery Password": "Recupero Password",
      Email: "Email",
      "Please enter your email.": "Per favore inserisci la tua email.",
      "Recover Password": "Recupera Password",
      "Condizioni e Contatti": "Condizioni e Contatti",
      "Ho letto e accettato i": "Ho letto e accettato i",
      "termini e condizioni": "termini e condizioni",
      Accetto: "Accetto",
      "Informativa sulla privacy": "Informativa sulla privacy",
      Prenotazioni: "Prenotazioni",
      Dashboard: "Dashboard",
      Logout: "Logout",
      "Link inviato con successo": "Link inviato con successo",
      "Completa il pagamento": "Completa il pagamento",
      "Il link scade tra": "Il link scade tra",
      "ID della prenotazione": "ID della prenotazione",
      "Tutti i diritti riservati": "Tutti i diritti riservati",
      "An error occurred. Please try again.": "Si è verificato un errore. Per favore riprova.",
      "Invalid username or password.": "Nome utente o password non validi.",
      "Prenotazione non trovata": "Prenotazione non trovata",
      "Register Agency": "Registrazione Agenzia",
      "Agency Name": "Nome dell'Agenzia",
      "Ragione Sociale": "Ragione Sociale",
      "Partita IVA": "Partita IVA",
      Address: "Indirizzo",
      City: "Città",
      CAP: "CAP",
      Province: "Provincia",
      Nationality: "Nazionalità",
      Telephone: "Telefono",
      Email: "Email",
      Referente: "Referente",
      Password: "Password",
      Submit: "Invia",
      "An agency with this name already exists.": "Un'agenzia con questo nome esiste già.",
      "An agency with this Ragione Sociale already exists.": "Un'agenzia con questa Ragione Sociale esiste già.",
      "An agency with this Partita IVA already exists.": "Un'agenzia con questa Partita IVA esiste già.",
      "An agency with this email already exists.": "Un'agenzia con questa email esiste già.",
      "Password must be at least 8 characters long and include a number, an uppercase letter, a lowercase letter, and a special character.": "La password deve essere lunga almeno 8 caratteri e includere un numero, una lettera maiuscola, una lettera minuscola e un carattere speciale.",
      "CAP must be exactly 5 digits.": "Il CAP deve essere esattamente di 5 cifre.",
      "Partita IVA must be exactly 11 digits.": "La Partita IVA deve essere esattamente di 11 cifre.",
      "Loading...": "Caricamento...",
      "Agency registered successfully!": "Agenzia registrata con successo!",
      "Agency registered successfully! You will receive an email when the site administrator accepts your registration request.": "Agenzia registrata con successo! Riceverai un'email quando l'amministratore del sito accetterà la tua richiesta di registrazione.",
      "This will be used for logging in": "Questo sarà utilizzato per accedere",
      "Ricerca Agenzia": "Ricerca Agenzia",
      Name: "Nome",
      "Abilita Pagamento Estratto Conto": "Abilita Pagamento Estratto Conto",
      "Abilita Pagamento Pay By Link": "Abilita Pagamento Pay By Link",
      Attivo: "Attivo",
      "Percentual Commissione": "Percentuale Commissione",
      "Diritti Di Prenotazione": "Diritti Di Prenotazione",
      "Dettaglio Agenzia": "Dettaglio Agenzia",
      Yes: "Sì",
      No: "No",
      Close: "Chiudi",
      Save: "Salva",
      "Visualizza Estratto Conto": "Visualizza Estratto Conto",
      "Tutti": "Tutti",
      "Da approvare": "Da approvare",
      "Approvati": "Approvati",
      "Name Agency": "Nome Agenzia",
      "Month": "Mese",
      "Approved": "Approvato",
      "Upload Date": "Data di Caricamento",
      "Approval Date": "Data di Approvazione",
      "Actions": "Azioni",
      "Search by name": "Cerca per nome",
      "Search": "Cerca",
      "Error": "Errore",
      "Page Size": "Dimensione della pagina",
      "From Date": "Data di inizio",
      "To Date": "Data di fine",
      "Scaricando...": "Scaricando...",
      "Scarica": "Scarica",
      "Prenotazioni": "Prenotazioni",
      "Codice della prenotazione": "Codice della prenotazione",
      "Data di inizio": "Data di inizio",
      "Data di fine": "Data di fine",
      "Agenzia": "Agenzia",
      "Email dell'ospite": "Email dell'ospite",
      "Nome del contatto": "Nome del contatto",
      "Cognome del contatto": "Cognome del contatto",
      "Codice Prenotazione": "Codice Prenotazione",
      "Data Prenotazione": "Data Prenotazione",
      "Prezzo": "Prezzo",
      "Email Contatto": "Email Contatto",
      "Nome Contatto": "Nome Contatto",
      "Cognome Contatto": "Cognome Contatto",
      "Nome Agenzia": "Nome Agenzia",
      "Rendicontazione": "Rendicontazione",
      "Contenuto della pagina di rendicontazione.": "Contenuto della pagina di rendicontazione.",
      "Both dates are required.": "Entrambe le date sono obbligatorie.",
      "Select Agency": "Seleziona Agenzia",
      "Set New Password": "Imposta nuova password",
      "Old Password": "Vecchia password",
      "New Password": "Nuova password",
      "Confirm Password": "Conferma password",
      "Passwords do not match": "Le password non corrispondono",
      "Password must be at least 8 characters long and contain at least one number, one lowercase letter, one uppercase letter, and one special character": "La password deve essere lunga almeno 8 caratteri e contenere almeno un numero, una lettera minuscola, una lettera maiuscola e un carattere speciale",
      "Password set successfully": "Password impostata con successo",
      "Failed to set password": "Impostazione della password non riuscita",
      "Set Password": "Imposta password",
      "Recovery": "Recupero",
      "Change Password": "Cambia password",
      "Password changed successfully": "Password cambiata con successo",
      "Password Recovery": "Recupero Password",
      "Send Recovery Email": "Invia Email di Recupero",
      "Recovery email sent successfully.": "Email di recupero inviata con successo.",
      "Back to Login": "Torna al Login",
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
