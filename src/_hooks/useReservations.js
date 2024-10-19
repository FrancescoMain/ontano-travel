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
  const [adulti, setAdulti] = useState(null);
  const [bambini, setBambini] = useState(null);
  const [etaBambini, setEtaBambini] = useState([]);
  const [animali, setAnimali] = useState(null);
  const [bagagli, setBagagli] = useState(null);
  const [bigliettoAndata, setBigliettoAndata] = useState(null);
  const [bigliettoRitorno, setBigliettoRitorno] = useState(null);
  const [dataAndata, setDataAndata] = useState(null);
  const [dataRitorno, setDataRitorno] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const viaggioData = localStorage.getItem("viaggioData");
    console.log("viaggioData", viaggioData);
    if (viaggioData) {
      const {
        adulti,
        etaBambini,
        animali,
        bagagli,
        bigliettoAndata,
        bigliettoRitorno,
        dataAndata,
        dataRitorno,
      } = JSON.parse(viaggioData);

      setAdulti(adulti);
      setEtaBambini(etaBambini);
      setAnimali(animali);
      setBagagli(bagagli);
      setBigliettoAndata(bigliettoAndata);
      setBigliettoRitorno(bigliettoRitorno);
      setDataAndata(dataAndata);
      setDataRitorno(dataRitorno);
    } else {
      navigate("/"); // Reindirizza alla home se i dati non sono presenti
    }
  }, []);
  useEffect(() => {
    const fetchQuote = async () => {
      const result = await postQuote({
        dataAndata,
        dataRitorno,
        adulti,
        bambini,
        etaBambini,
        animali,
        bagagli,
        bigliettoAndata,
        bigliettoRitorno,
      });
      setQuote(result);
    };

    fetchQuote();

    setPasseggeri(Array.from({ length: parseInt(adulti, 10) }));
    setPasseggeri((prev) => [
      ...prev,
      ...Array.from({ length: parseInt(bambini, 10) }),
    ]);
  }, [adulti]);

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
  }, [prenotazione]);
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
