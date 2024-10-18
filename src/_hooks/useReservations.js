import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { postQuote } from "../_api/reservations/quote";
import { getReservation } from "../_api/reservations/reservations";

export const useReservations = () => {
  const [passeggeri, setPasseggeri] = useState([]);
  const [quote, setQuote] = useState(null);
  const [prenotazione, setPrenotazione] = useState(null);
  const { adulti, bambini } = useSelector((state) => state.viaggioForm);
  const {
    dataAndata,
    dataRitorno,
    etaBambini,
    animali,
    bagagli,
    bigliettoAndata,
    bigliettoRitorno,
  } = useSelector((state) => state.viaggioForm);

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
  }, [
    adulti,
    bambini,
    dataAndata,
    dataRitorno,
    etaBambini,
    animali,
    bagagli,
    bigliettoAndata,
    bigliettoRitorno,
  ]);

  useEffect(() => {
    const fetchReservation = async () => {
      if (quote) {
        const reservation = await getReservation(quote);
        setPrenotazione(reservation);
      }
    };

    fetchReservation();
  }, [quote]);

  return { passeggeri, prenotazione };
};
