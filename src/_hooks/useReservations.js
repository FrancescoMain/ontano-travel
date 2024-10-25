import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postQuote } from "../_api/reservations/quote";
import { getReservation } from "../_api/reservations/reservations";
import { useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";

export const useReservations = () => {
  const [passeggeri, setPasseggeri] = useState([]);
  const [quote, setQuote] = useState(null);
  const [prenotazione, setPrenotazione] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tratte, setTratte] = useState([]);
  const viaggioData = localStorage.getItem("viaggioData");

  useEffect(() => {
    console.log(viaggioData);
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
    if (tratte.length > 0) {
      const fetchQuote = async () => {
        const result = await postQuote({ tratte });
        setQuote(result);
      };
      fetchQuote();
    }
  }, [tratte]);

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
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
      "use strict";
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll(".needs-validation");
      // Loop over them and prevent submission
      Array.from(forms).forEach((form) => {
        form.addEventListener(
          "submit",
          (event) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
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
