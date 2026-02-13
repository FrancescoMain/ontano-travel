import React from "react";
import { useTranslation } from "react-i18next";
import { TextField, MenuItem } from "@mui/material";
import {
  VEHICLE_TYPES,
  FUEL_TYPES,
} from "../ResultCard/VehicleSelector";

const getVehicleLabel = (type) => {
  const found = VEHICLE_TYPES.find((vt) => vt.value === type);
  return found ? found.label : type;
};

/**
 * Checkout section for collecting vehicle plate and fuel type.
 * BCY (Bicicletta/Surf) vehicles are skipped (no plate/fuel needed).
 * Vehicles with has_trailer also show trailer plate/fuel fields.
 *
 * @param {Object} props
 * @param {Array} props.vehicles - Vehicles from quote (with type, has_trailer)
 * @param {Array} props.vehicleDetails - Array of {regNumber, fuelType, trailerRegNumber?, trailerFuelType?}
 * @param {Function} props.onVehicleDetailsChange - Callback with updated vehicleDetails array
 */
export const CheckoutVehicleDetails = ({
  vehicles,
  vehicleDetails,
  onVehicleDetailsChange,
}) => {
  const { t } = useTranslation();

  const handleChange = (index, field, value) => {
    const updated = vehicleDetails.map((d, i) =>
      i === index ? { ...d, [field]: value } : d
    );
    onVehicleDetailsChange(updated);
  };

  const hasNonBCY = vehicles.some((v) => v.type !== "BCY");
  if (!hasNonBCY) return null;

  return (
    <div className="col-lg-12 col bg-passeggeri rounded mt-3 mb-3">
      <div className="row">
        <div className="col">
          <h2 className="text-primary ms-3 mt-2">{t("Dati Veicoli")}</h2>
          {vehicles.map((vehicle, index) => {
            if (vehicle.type === "BCY") return null;
            return (
              <div key={index} className="ms-3 me-3 mb-3">
                <h5 className="text-secondary">
                  {t("Veicolo")} {index + 1} - {getVehicleLabel(vehicle.type)}
                </h5>
                <div className="row g-2">
                  <div className="col-sm-6">
                    <TextField
                      fullWidth
                      size="small"
                      label={t("Targa")}
                      placeholder="AA000BB"
                      required
                      error={!vehicleDetails[index]?.regNumber}
                      value={vehicleDetails[index]?.regNumber || ""}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "regNumber",
                          e.target.value.toUpperCase()
                        )
                      }
                      inputProps={{ maxLength: 10 }}
                    />
                  </div>
                  <div className="col-sm-6">
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label={t("Carburante")}
                      value={vehicleDetails[index]?.fuelType || "BENZINA"}
                      onChange={(e) =>
                        handleChange(index, "fuelType", e.target.value)
                      }
                    >
                      {FUEL_TYPES.map((ft) => (
                        <MenuItem key={ft.value} value={ft.value}>
                          {ft.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
                {vehicle.has_trailer && (
                  <div className="mt-2">
                    <h6 className="text-secondary">{t("Rimorchio")}</h6>
                    <div className="row g-2">
                      <div className="col-sm-6">
                        <TextField
                          fullWidth
                          size="small"
                          label={t("Targa rimorchio")}
                          placeholder="AA000BB"
                          required
                          error={!vehicleDetails[index]?.trailerRegNumber}
                          value={vehicleDetails[index]?.trailerRegNumber || ""}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "trailerRegNumber",
                              e.target.value.toUpperCase()
                            )
                          }
                          inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      <div className="col-sm-6">
                        <TextField
                          select
                          fullWidth
                          size="small"
                          label={t("Carburante rimorchio")}
                          value={
                            vehicleDetails[index]?.trailerFuelType || "BENZINA"
                          }
                          onChange={(e) =>
                            handleChange(
                              index,
                              "trailerFuelType",
                              e.target.value
                            )
                          }
                        >
                          {FUEL_TYPES.map((ft) => (
                            <MenuItem key={ft.value} value={ft.value}>
                              {ft.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
