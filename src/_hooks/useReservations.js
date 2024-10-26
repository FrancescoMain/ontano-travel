import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { postQuote } from "../_api/reservations/quote";
import { getReservation } from "../_api/reservations/reservations";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";
import { Collapse } from "bootstrap";

export const useReservations = () => {
  const [passeggeri, setPasseggeri] = useState([]);
  const [quote, setQuote] = useState(null);
  const [prenotazione, setPrenotazione] = useState(null);
  const [tratte, setTratte] = useState([]);
  const [isQuoteFetched, setIsQuoteFetched] = useState(false); // Nuovo stato per tracciare se la chiamata è stata effettuata
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const viaggioData = localStorage.getItem("viaggioData");

  useEffect(() => {
    if (viaggioData) {
      const parsedData = JSON.parse(viaggioData);
      const selected2 = parsedData.selected;
      selected2.forEach((element) => {
        if (element.prezzo) {
          setTratte((prev) => [...prev, element]);
        }
      });
    } else {
      navigate("/"); // Reindirizza alla home se i dati non sono presenti
    }
  }, [navigate, viaggioData]);

  useEffect(() => {
    if (tratte.length > 0 && !isQuoteFetched) {
      const fetchQuote = async () => {
        const result = await postQuote({ tratte });
        setQuote(result);
        setIsQuoteFetched(true); // Imposta lo stato per indicare che la chiamata è stata effettuata
      };
      fetchQuote();
    }
  }, [tratte, isQuoteFetched]);

  useEffect(() => {
    let passeggeri = [];
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

    // Imposta l'array dei passeggeri nello stato
    setPasseggeri(passeggeri);
    console.log(passeggeri);
  }, [tratte]);

  useEffect(() => {
    const fetchReservation = async () => {
      if (quote) {
        const reservation = await getReservation(quote);
        setPrenotazione(reservation);
      }
    };
    fetchReservation();
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

  return { passeggeri, prenotazione };
};
