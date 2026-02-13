import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CheckoutVehicleDetails } from "../../components/Checkouts/CheckoutVehicleDetails";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("CheckoutVehicleDetails", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render fields for non-BCY vehicles", () => {
    const vehicles = [
      { type: "CAR" },
      { type: "MCY" },
    ];
    const details = [
      { regNumber: "", fuelType: "BENZINA" },
      { regNumber: "", fuelType: "BENZINA" },
    ];

    render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    expect(screen.getByText("Dati Veicoli")).toBeInTheDocument();
    expect(screen.getByText(/Veicolo 1 - Automobile/)).toBeInTheDocument();
    expect(screen.getByText(/Veicolo 2 - Moto\/Scooter/)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Targa/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Carburante/)).toHaveLength(2);
  });

  it("should skip BCY vehicles", () => {
    const vehicles = [
      { type: "CAR" },
      { type: "BCY" },
    ];
    const details = [
      { regNumber: "", fuelType: "BENZINA" },
      { regNumber: "", fuelType: "BENZINA" },
    ];

    render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    expect(screen.getByText(/Veicolo 1 - Automobile/)).toBeInTheDocument();
    expect(screen.queryByText(/Bicicletta/)).not.toBeInTheDocument();
    expect(screen.getAllByLabelText(/Targa/)).toHaveLength(1);
  });

  it("should return null when all vehicles are BCY", () => {
    const vehicles = [{ type: "BCY" }];
    const details = [{ regNumber: "", fuelType: "BENZINA" }];

    const { container } = render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    expect(container.innerHTML).toBe("");
  });

  it("should update regNumber in uppercase", () => {
    const vehicles = [{ type: "CAR" }];
    const details = [{ regNumber: "", fuelType: "BENZINA" }];

    render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    const plateInput = screen.getByLabelText(/Targa/);
    fireEvent.change(plateInput, { target: { value: "ab123cd" } });

    expect(mockOnChange).toHaveBeenCalledWith([
      { regNumber: "AB123CD", fuelType: "BENZINA" },
    ]);
  });

  it("should update fuelType", () => {
    const vehicles = [{ type: "CAR" }];
    const details = [{ regNumber: "AA000BB", fuelType: "BENZINA" }];

    render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    const fuelSelect = screen.getByLabelText(/Carburante/);
    fireEvent.mouseDown(fuelSelect);
    fireEvent.click(screen.getByText("Diesel"));

    expect(mockOnChange).toHaveBeenCalledWith([
      { regNumber: "AA000BB", fuelType: "DIESEL" },
    ]);
  });

  it("should show error when regNumber is empty", () => {
    const vehicles = [{ type: "CAR" }];
    const details = [{ regNumber: "", fuelType: "BENZINA" }];

    render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    const plateInput = screen.getByLabelText(/Targa/);
    expect(plateInput).toHaveAttribute("aria-invalid", "true");
  });

  it("should not show error when regNumber is filled", () => {
    const vehicles = [{ type: "CAR" }];
    const details = [{ regNumber: "AA000BB", fuelType: "BENZINA" }];

    render(
      <CheckoutVehicleDetails
        vehicles={vehicles}
        vehicleDetails={details}
        onVehicleDetailsChange={mockOnChange}
      />
    );

    const plateInput = screen.getByLabelText(/Targa/);
    expect(plateInput).toHaveAttribute("aria-invalid", "false");
  });
});
