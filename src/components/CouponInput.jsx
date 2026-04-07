import React from "react";
import { useTranslation } from "react-i18next";
import { applyCoupon, removeCoupon } from "../_api/reservations/coupon";

export const CouponInput = ({
  reservationCode,
  couponCode,
  onCouponApplied,
  onCouponRemoved,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleApply = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    setError("");
    try {
      const updatedReservation = await applyCoupon(
        reservationCode,
        inputValue.trim()
      );
      setInputValue("");
      onCouponApplied(updatedReservation);
    } catch (err) {
      setError(err.message || t("Coupon non valido"));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    setError("");
    try {
      const updatedReservation = await removeCoupon(reservationCode);
      onCouponRemoved(updatedReservation);
    } catch (err) {
      setError(err.message || t("Errore nella rimozione del coupon"));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleApply();
    }
  };

  if (couponCode) {
    return (
      <div className="d-flex flex-column gap-2 my-2">
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-success fw-bold">
            <i className="bi bi-check-circle me-1"></i>
            {t("Coupon applicato")}: {couponCode}
          </span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemove}
            disabled={loading}
          >
            {loading ? t("Loading...") : t("Rimuovi coupon")}
          </button>
        </div>
        {error && <small className="text-danger">{error}</small>}
      </div>
    );
  }

  return (
    <div className="d-flex flex-column gap-2 my-2">
      <div className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-sm"
          placeholder={t("Codice coupon")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          aria-label={t("Codice coupon")}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm text-nowrap"
          onClick={handleApply}
          disabled={loading || !inputValue.trim()}
        >
          {loading ? t("Loading...") : t("Applica")}
        </button>
      </div>
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};
