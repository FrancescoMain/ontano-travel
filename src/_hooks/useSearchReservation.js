import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchReservationThunk } from "../features/reservation/reservationSlice"; // Import the thunk
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { startLoading, stopLoading } from "../features/spinner/spinnerSlice";

const useSearchReservation = () => {
  const [bookingCode, setBookingCode] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.reservation);
  const { t } = useTranslation();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async (e) => {
    e.preventDefault();
    dispatch(fetchReservationThunk({ bookingCode, email }));
  };

  useEffect(() => {
    if (status === "failed") {
      toast.error(t("Prenotazione non trovata"));
      dispatch(stopLoading());
    }
    if (status === "loading") {
      dispatch(startLoading());
    }
    if (status === "succeeded") {
      dispatch(stopLoading());
      navigate("/result-guest"); // Redirect to search-guest
    }
    // if (status === "idle") {
    //   dispatch(

    // }
  }, [status, t, navigate]);

  return {
    bookingCode,
    setBookingCode,
    email,
    setEmail,
    handleSearch,
  };
};

export default useSearchReservation;