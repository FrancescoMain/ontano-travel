import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  suggestAddons,
  applyAddon,
  removeAddon,
} from "../../_api/reservations/addonServices";
import { AddonServiceCard } from "./AddonServiceCard";
import "./AddonServicesSection.css";

export const AddonServicesSection = ({
  reservationCode,
  appliedAddons,
  onReservationUpdated,
}) => {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [mutatingId, setMutatingId] = React.useState(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!reservationCode) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    suggestAddons(reservationCode)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.items || [];
        const sorted = [...list].sort(
          (a, b) => (a.priority ?? 0) - (b.priority ?? 0)
        );
        setSuggestions(sorted);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError(err.message || "Errore nel caricamento degli addon");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reservationCode]);

  const appliedByServiceId = React.useMemo(() => {
    const map = new Map();
    (appliedAddons || []).forEach((a) => {
      map.set(a.addonServiceId, a);
    });
    return map;
  }, [appliedAddons]);

  const handleApply = async (addon, qty) => {
    setMutatingId(addon.id);
    try {
      const updated = await applyAddon(reservationCode, addon.id, qty);
      onReservationUpdated(updated);
    } catch (err) {
      toast.error(err.message || t("Errore nell'applicazione dell'addon"));
    } finally {
      setMutatingId(null);
    }
  };

  const handleRemove = async (addon) => {
    const applied = appliedByServiceId.get(addon.id);
    if (!applied) return;
    setMutatingId(addon.id);
    try {
      const updated = await removeAddon(reservationCode, applied.id);
      onReservationUpdated(updated);
    } catch (err) {
      toast.error(err.message || t("Errore nella rimozione dell'addon"));
    } finally {
      setMutatingId(null);
    }
  };

  if (!reservationCode) return null;
  if (loading) {
    return (
      <div className="addon-section col-lg-12 col bg-passeggeri rounded mt-3 mb-3 p-4">
        <div className="text-muted small">{t("Caricamento addon in corso...")}</div>
      </div>
    );
  }
  if (error) {
    return null;
  }
  if (!suggestions.length) return null;

  return (
    <div className="addon-section col-lg-12 col bg-passeggeri rounded mt-3 mb-3 p-4">
      <div className="addon-section-heading">
        <h2 className="text-primary addon-section-title">
          {t("Arricchisci il tuo viaggio")}
        </h2>
        <span className="addon-section-badge">{t("NOVITÀ")}</span>
      </div>
      <p className="addon-section-subtitle">
        {t("Aggiungi servizi opzionali alla tua prenotazione per un'esperienza ancora migliore.")}
      </p>
      <div className="addon-section-grid">
        {suggestions.map((addon) => {
          const applied = appliedByServiceId.get(addon.id);
          return (
            <AddonServiceCard
              key={addon.id}
              addon={addon}
              appliedQty={applied?.qty || 0}
              onApply={handleApply}
              onRemove={handleRemove}
              disabled={mutatingId !== null && mutatingId !== addon.id}
            />
          );
        })}
      </div>
    </div>
  );
};
