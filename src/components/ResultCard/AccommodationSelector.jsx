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

  // Check if capacity matches or exceeds passengers
  const isCapacityMatched = totalCapacity >= totalPassengers;

  // Calculate spare capacity (empty spots)
  const spareCapacity = totalCapacity - totalPassengers;

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  // Check if adding one more unit of this accommodation would exceed the limit
  // Rule: spare capacity must be less than the largest unit's capacity
  // (you can't have enough empty spots to fill another whole unit)
  const canIncreaseQty = (acc) => {
    const newCapacity = totalCapacity + acc.hosted_people;
    const newSpare = newCapacity - totalPassengers;
    // Find the max hosted_people among selected accommodations (including this one)
    const maxHosted = Math.max(
      acc.hosted_people,
      ...selectedAccommodations.map((a) => a.hosted_people)
    );
    return newSpare < maxHosted;
  };

  // Check if adding a new accommodation type is allowed
  const canAddAccommodation = (acc) => {
    const newCapacity = totalCapacity + acc.hosted_people;
    const newSpare = newCapacity - totalPassengers;
    // Find the max hosted_people (considering the new one too)
    const currentMax = selectedAccommodations.length > 0
      ? Math.max(...selectedAccommodations.map((a) => a.hosted_people))
      : 0;
    const maxHosted = Math.max(acc.hosted_people, currentMax);
    return newSpare < maxHosted;
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
        getOptionDisabled={(option) => {
          // Disable options not already selected if adding would exceed limit
          const isSelected = selectedAccommodations.some(
            (acc) => acc.code === option.code
          );
          if (isSelected) return false;
          return !canAddAccommodation(option);
        }}
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
        <Box className="accommodation-qty-container" sx={{ width: "100%", overflow: "hidden" }}>
          {selectedAccommodations.map((acc) => (
            <Box
              key={acc.code}
              className="accommodation-qty-row"
              sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}
            >
              <Typography
                variant="body2"
                className="accommodation-description"
                noWrap
                sx={{
                  flex: 1,
                  minWidth: 0,
                  maxWidth: "calc(100% - 100px)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {acc.description} ({acc.hosted_people} {t("posti")})
              </Typography>
              <Box className="accommodation-qty-controls" sx={{ flexShrink: 0 }}>
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
                <IconButton
                  size="small"
                  onClick={() => increaseQty(acc.code)}
                  disabled={!canIncreaseQty(acc)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Box className="accommodation-capacity-info">
            <Typography
              variant="caption"
              color={isCapacityMatched ? "success.main" : "textSecondary"}
              sx={{ fontWeight: isCapacityMatched ? 600 : 400 }}
            >
              {t("Capienza totale")}: {totalCapacity} / {totalPassengers}{" "}
              {t("passeggeri")} ({t("esclusi infant")})
              {isCapacityMatched && ` ✓`}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
