import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./VehicleSelector.css";

export const VEHICLE_TYPES = [
  { value: "CAR", label: "Automobile" },
  { value: "VEI", label: "Furgone" },
  { value: "CMPMINIBUS", label: "Camper e Minibus" },
  { value: "MCY", label: "Moto/Scooter" },
  { value: "BCY", label: "Bicicletta/Surf" },
];

export const FUEL_TYPES = [
  { value: "ICE", label: "Diesel / Benzina" },
  { value: "EV", label: "Veicoli elettrici" },
  { value: "GAS", label: "GPL / Metano" },
  { value: "HEV", label: "Ibridi elettrico + benzina o diesel" },
];

const DEFAULT_VEHICLE = {
  type: "CAR",
  height: "",
  length: "",
  has_trailer: false,
  trailer_length: "",
};

/**
 * Checks if a single vehicle has all required fields filled
 */
const isVehicleComplete = (vehicle) => {
  if (!vehicle.height || !vehicle.length) return false;
  if (vehicle.has_trailer && !vehicle.trailer_length) return false;
  return true;
};

/**
 * Checks if all vehicles in the array have complete data.
 * Returns true if there are no vehicles or all vehicles are complete.
 */
export const areVehiclesValid = (vehicles) => {
  if (!vehicles || vehicles.length === 0) return true;
  return vehicles.every(isVehicleComplete);
};

/**
 * Vehicle selector component for Grimaldi routes
 * @param {Object} props
 * @param {Array} props.vehicles - Currently selected vehicles
 * @param {Function} props.onVehiclesChange - Callback when vehicles change
 */
export const VehicleSelector = ({ vehicles, onVehiclesChange }) => {
  const { t } = useTranslation();

  const handleContainerClick = (e) => {
    e.stopPropagation();
  };

  const addVehicle = () => {
    onVehiclesChange([...vehicles, { ...DEFAULT_VEHICLE }]);
  };

  const removeVehicle = (index) => {
    onVehiclesChange(vehicles.filter((_, i) => i !== index));
  };

  const updateVehicle = (index, field, value) => {
    const updated = vehicles.map((v, i) => {
      if (i !== index) return v;
      const newVehicle = { ...v, [field]: value };
      if (field === "has_trailer" && !value) {
        newVehicle.trailer_length = "";
      }
      return newVehicle;
    });
    onVehiclesChange(updated);
  };

  return (
    <Box className="vehicle-selector" onClick={handleContainerClick}>
      <button
        type="button"
        className="vehicle-add-btn"
        onClick={addVehicle}
      >
        <AddIcon fontSize="small" />
        {t("Aggiungi veicolo")}
      </button>

      {vehicles.length > 0 && (
        <Box className="vehicle-list">
          {vehicles.map((vehicle, index) => (
            <Box key={index} className="vehicle-item">
              <Box className="vehicle-item-header">
                <Typography className="vehicle-item-title">
                  {t("Veicolo")} {index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeVehicle(index)}
                  aria-label={`${t("Rimuovi veicolo")} ${index + 1}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box className="vehicle-fields">
                <TextField
                  select
                  size="small"
                  className="vehicle-field-type"
                  label={t("Tipo")}
                  value={vehicle.type}
                  onChange={(e) =>
                    updateVehicle(index, "type", e.target.value)
                  }
                >
                  {VEHICLE_TYPES.map((vt) => (
                    <MenuItem key={vt.value} value={vt.value}>
                      {vt.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  type="number"
                  className="vehicle-field-size"
                  label={t("Altezza (m)")}
                  placeholder="1.80"
                  required
                  error={!vehicle.height}
                  value={vehicle.height}
                  onChange={(e) =>
                    updateVehicle(index, "height", e.target.value)
                  }
                  inputProps={{ inputMode: "decimal", step: "0.01", min: "0" }}
                />

                <TextField
                  size="small"
                  type="number"
                  className="vehicle-field-size"
                  label={t("Lunghezza (m)")}
                  placeholder="4.50"
                  required
                  error={!vehicle.length}
                  value={vehicle.length}
                  onChange={(e) =>
                    updateVehicle(index, "length", e.target.value)
                  }
                  inputProps={{ inputMode: "decimal", step: "0.01", min: "0" }}
                />
              </Box>

              <Box className="vehicle-trailer-row">
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={vehicle.has_trailer}
                      onChange={(e) =>
                        updateVehicle(index, "has_trailer", e.target.checked)
                      }
                    />
                  }
                  label={t("Rimorchio")}
                />
                {vehicle.has_trailer && (
                  <TextField
                    size="small"
                    type="number"
                    className="vehicle-trailer-length"
                    label={t("Lunghezza rimorchio (m)")}
                    placeholder="2.50"
                    required
                    error={!vehicle.trailer_length}
                    value={vehicle.trailer_length}
                    onChange={(e) =>
                      updateVehicle(index, "trailer_length", e.target.value)
                    }
                    inputProps={{ inputMode: "decimal", step: "0.01", min: "0" }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
