import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postQuote } from "../_api/reservations/quote";
import { getReservation } from "../_api/reservations/reservations";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { Collapse } from "bootstrap";
import { paymentsMode } from "../_api/reservations/paymentsMode";
import {
  resetResults,
  resetSelected,
  resetSelectedAll,
} from "../features/viaggio/resultTratta";

export const useReservations = () => {
  const [passeggeri, setPasseggeri] = useState([]);
  const [quote, setQuote] = useState(null);
  const [prenotazione, setPrenotazione] = useState(null);
  const [isQuoteFetched, setIsQuoteFetched] = useState(false); // Nuovo stato per tracciare se la chiamata è stata effettuata
  const [paymentsMethod, setPaymentsMethod] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tourQuote = localStorage.getItem("tourQuote");
  const linkQuote = localStorage.getItem("linkQuote");
  const [isTour, setIsTour] = useState(false);

  useEffect(() => {
    if (!tourQuote && !linkQuote) {
      dispatch(stopLoading());
      dispatch(resetResults());
      dispatch(resetSelectedAll());
      navigate("/"); // Reindirizza alla home se i dati non sono presenti
    } else if (tourQuote) {
      setIsTour(true);
      const parsedData = JSON.parse(tourQuote);
      console.log("parsedData", parsedData);
      setQuote(parsedData.reservationCode);
      setIsQuoteFetched(true);
    } else if (linkQuote) {
      const parsedData = JSON.parse(linkQuote);
      setQuote(parsedData.result);
      setIsQuoteFetched(true);
    }
  }, [navigate, tourQuote, linkQuote]);

  useEffect(() => {
    let passeggeri = [];

    if (linkQuote) {
      const parsedData = JSON.parse(linkQuote);
      console.log(parsedData);
      const tratte = parsedData.tratte;
      tratte.forEach((tratta) => {
        const { id, adulti, bambini, etaBambini } = tratta;

        // Crea un oggetto per ogni tratta con le informazioni richieste
        const trattaInfo = {
          id,
          adulti: parseInt(adulti, 10),
          bambini: parseInt(bambini, 10),
          tot: parseInt(adulti, 10) + parseInt(bambini, 10),
          etaBambini: etaBambini.map((eta) => parseInt(eta, 10)),
        };

        // Aggiungi l'oggetto all'array dei passeggeri
        passeggeri.push(trattaInfo);
      });
    } else if (prenotazione) {
      const data = prenotazione.reservationRoutes[0].tariffs;
      console.log(data);

      let adulti = 0;
      let bambini = 0;
      const parsedData = JSON.parse(tourQuote);

      data.forEach((item) => {
        const { qty, category_code } = item;

        if (category_code === "ADU") {
          adulti = adulti + 1;
        } else if (category_code === "CHD" || category_code === "INF") {
          bambini = bambini + 1;
        }
      });

      const prenotazioneInfo = {
        id: 0,
        adulti,
        bambini,
        tot: adulti + bambini,
        etaBambini: parsedData.etaBambini, // Assuming etaBambini is not available in this context
      };

      // Aggiungi l'oggetto all'array dei passeggeri
      passeggeri.push(prenotazioneInfo);
      console.log(prenotazioneInfo);
    }

    // Imposta l'array dei passeggeri nello stato
    setPasseggeri(passeggeri);
  }, [prenotazione]);

  useEffect(() => {
    const fetchReservation = async () => {
      console.log(quote);
      if (quote) {
        const reservation = await getReservation(quote);
        setPrenotazione(reservation);
      }
    };
    fetchReservation();

    const fetchPaymentsMethod = async () => {
      const payments = await paymentsMode();
      setPaymentsMethod(payments);
    };
    if (paymentsMethod.length === 0) {
      fetchPaymentsMethod();
    }
  }, [quote]);

  useEffect(() => {
    dispatch(startLoading());
    if (prenotazione) {
      dispatch(stopLoading());
    }
  }, [prenotazione, dispatch]);
  useEffect(() => {
    (() => {
      "use strict";
      const forms = document.querySelectorAll(".needs-validation");

      Array.from(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          (event) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();

              const collapses = form.querySelectorAll(".collapse");

              Array.from(collapses).forEach((collapse) => {
                const invalidFields = collapse.querySelectorAll(":invalid");

                if (invalidFields.length > 0) {
                  const bsCollapse = new Collapse(collapse, {
                    toggle: false,
                  });
                  bsCollapse.show();
                }
              });
            }
            form.classList.add("was-validated");
          },
          false
        );
      });
    })();
  }, []);

  return { passeggeri, prenotazione, paymentsMethod, quote, isTour };
};
