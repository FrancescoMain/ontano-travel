import React from "react";
import { useTranslation } from "react-i18next";
import { getAddonTheme, MAX_ADDON_QTY } from "../../utils/addonServiceConfig";
import "./AddonServiceCard.css";

const unitLabel = (unit, t) => {
  if (unit === "day") return t("/ giorno");
  return t("/ pers.");
};

export const AddonServiceCard = ({ addon, appliedQty, onApply, onRemove, disabled }) => {
  const { t } = useTranslation();
  const theme = getAddonTheme(addon.name);
  const isSelected = appliedQty > 0;
  const totalPrice = (addon.price?.price || 0) * appliedQty;
  const priceFormatted = addon.price?.priceFormatted || `€ ${(addon.price?.price || 0).toFixed(2)}`;

  const handleDecrement = () => {
    if (appliedQty <= 0 || disabled) return;
    const next = appliedQty - 1;
    if (next === 0) onRemove(addon);
    else onApply(addon, next);
  };

  const handleIncrement = () => {
    if (disabled) return;
    if (appliedQty >= MAX_ADDON_QTY) return;
    onApply(addon, appliedQty + 1);
  };

  return (
    <div className={`addon-card${isSelected ? " addon-card-selected" : ""}`}>
      <div className="addon-card-header" style={{ backgroundColor: theme.bgColor }}>
        {isSelected && (
          <span className="addon-card-check" aria-label={t("Selezionato")}>
            <i className="bi bi-check-lg"></i>
          </span>
        )}
        {addon.image ? (
          <img
            className="addon-card-image"
            src={`data:image/svg+xml;base64,${addon.image}`}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <span className="addon-card-icon" aria-hidden="true">{theme.icon}</span>
        )}
        {addon.tooltip && (
          <span className="addon-card-tooltip-badge" title={addon.tooltip}>
            {addon.tooltip}
          </span>
        )}
      </div>
      <div className="addon-card-body">
        <div className="addon-card-title-row">
          <h5 className="addon-card-title">{addon.title}</h5>
          <span className={`addon-card-price-badge${isSelected ? " selected" : ""}`}>
            {priceFormatted} {unitLabel(theme.unit, t)}
          </span>
        </div>
        {addon.description && (
          <p className="addon-card-description">{addon.description}</p>
        )}
        <div className="addon-card-footer">
          <div className="addon-card-stepper">
            <button
              type="button"
              className="addon-stepper-btn"
              onClick={handleDecrement}
              disabled={disabled || appliedQty <= 0}
              aria-label={t("Diminuisci quantità")}
            >
              −
            </button>
            <span className="addon-stepper-qty">{appliedQty}</span>
            <button
              type="button"
              className="addon-stepper-btn"
              onClick={handleIncrement}
              disabled={disabled || appliedQty >= MAX_ADDON_QTY}
              aria-label={t("Aumenta quantità")}
            >
              +
            </button>
          </div>
          <span className={`addon-card-total${isSelected ? " selected" : ""}`}>
            € {totalPrice.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>
    </div>
  );
};
