import React from "react";
import { useTranslation } from "react-i18next";
import {
  Autocomplete,
  TextField,
  Box,
  Chip,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import "./AccommodationSelector.css";

/**
 * Accommodation selector component for Grimaldi routes
 * @param {Object} props
 * @param {Array} props.accommodations - Available accommodations from API
 * @param {Array} props.selectedAccommodations - Currently selected accommodations with qty
 * @param {Function} props.onSelectionChange - Callback when selection changes
 * @param {number} props.totalPassengers - Total number of passengers
 * @param {boolean} props.loading - Whether accommodations are loading
 */
export const AccommodationSelector = ({
  accommodations,
  selectedAccommodations,
  onSelectionChange,
  totalPassengers,
  loading,
}) => {
  const { t } = useTranslation();

  const handleAutocompleteChange = (event, newValue) => {
    // When adding a new accommodation, set qty to 1
    const updatedSelections = newValue.map((option) => {
      const existing = selectedAccommodations.find(
        (acc) => acc.code === option.code
      );
      if (existing) {
        return existing;
      }
      return { ...option, qty: 1 };
    });
    onSelectionChange(updatedSelections);
  };

  const increaseQty = (code) => {
    const updated = selectedAccommodations.map((acc) =>
      acc.code === code ? { ...acc, qty: acc.qty + 1 } : acc
    );
    onSelectionChange(updated);
  };

  const decreaseQty = (code) => {
    const updated = selectedAccommodations
      .map((acc) => (acc.code === code ? { ...acc, qty: acc.qty - 1 } : acc))
      .filter((acc) => acc.qty > 0);
    onSelectionChange(updated);
  };

  const removeAccommodation = (code) => {
    const updated = selectedAccommodations.filter((acc) => acc.code !== code);
    onSelectionChange(updated);
  };

  // Calculate total capacity of selected accommodations
  const totalCapacity = selectedAccommodations.reduce(
    (sum, acc) => sum + acc.hosted_people * acc.qty,
    0
  );

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <Box
        className="accommodation-selector"
        onClick={handleContainerClick}
        sx={{ display: "flex", justifyContent: "center", py: 2 }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!accommodations || accommodations.length === 0) {
    return null;
  }

  return (
    <Box className="accommodation-selector" onClick={handleContainerClick}>
      <Autocomplete
        multiple
        options={accommodations}
        getOptionLabel={(option) =>
          `${option.description} (${option.hosted_people} ${t("posti")})`
        }
        isOptionEqualToValue={(option, value) => option.code === value.code}
        value={selectedAccommodations}
        onChange={handleAutocompleteChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={`${option.description} x${option.qty}`}
                {...tagProps}
                onDelete={() => removeAccommodation(option.code)}
                size="small"
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t("Seleziona sistemazione")}
            size="small"
            variant="outlined"
          />
        )}
        size="small"
      />

      {selectedAccommodations.length > 0 && (
        <Box className="accommodation-qty-container">
          {selectedAccommodations.map((acc) => (
            <Box key={acc.code} className="accommodation-qty-row">
              <Typography variant="body2" className="accommodation-description">
                {acc.description} ({acc.hosted_people} {t("posti")})
              </Typography>
              <Box className="accommodation-qty-controls">
                <IconButton
                  size="small"
                  onClick={() => decreaseQty(acc.code)}
                  disabled={acc.qty <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" className="accommodation-qty-value">
                  {acc.qty}
                </Typography>
                <IconButton size="small" onClick={() => increaseQty(acc.code)}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Box className="accommodation-capacity-info">
            <Typography variant="caption" color="textSecondary">
              {t("Capienza totale")}: {totalCapacity} / {totalPassengers}{" "}
              {t("passeggeri")}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
