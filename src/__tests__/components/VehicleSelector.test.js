import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { VehicleSelector } from "../../components/ResultCard/VehicleSelector";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("VehicleSelector", () => {
  const mockOnVehiclesChange = jest.fn();

  const defaultProps = {
    vehicles: [],
    onVehiclesChange: mockOnVehiclesChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly with no vehicles", () => {
    render(<VehicleSelector {...defaultProps} />);

    expect(screen.getByText("Aggiungi veicolo")).toBeInTheDocument();
    expect(screen.queryByText(/Veicolo 1/)).not.toBeInTheDocument();
  });

  it("should add a new vehicle when clicking add button", () => {
    render(<VehicleSelector {...defaultProps} />);

    fireEvent.click(screen.getByText("Aggiungi veicolo"));

    expect(mockOnVehiclesChange).toHaveBeenCalledWith([
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ]);
  });

  it("should render vehicle with type select", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "1.80",
        length: "4.50",
        has_trailer: false,
        trailer_length: "",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    expect(screen.getByText("Veicolo 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
    expect(screen.getByLabelText("Altezza (m)")).toBeInTheDocument();
    expect(screen.getByLabelText("Lunghezza (m)")).toBeInTheDocument();
  });

  it("should update vehicle type", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    // MUI Select: open dropdown and select option
    const select = screen.getByLabelText("Tipo");
    fireEvent.mouseDown(select);
    fireEvent.click(screen.getByText("Moto"));

    expect(mockOnVehiclesChange).toHaveBeenCalledWith([
      {
        type: "MOTO",
        height: "",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ]);
  });

  it("should update height and length", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    const heightInput = screen.getByLabelText("Altezza (m)");
    fireEvent.change(heightInput, { target: { value: "1.80" } });

    expect(mockOnVehiclesChange).toHaveBeenCalledWith([
      {
        type: "CAR",
        height: "1.80",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ]);

    mockOnVehiclesChange.mockClear();

    const lengthInput = screen.getByLabelText("Lunghezza (m)");
    fireEvent.change(lengthInput, { target: { value: "4.50" } });

    expect(mockOnVehiclesChange).toHaveBeenCalledWith([
      {
        type: "CAR",
        height: "",
        length: "4.50",
        has_trailer: false,
        trailer_length: "",
      },
    ]);
  });

  it("should show trailer_length field when has_trailer is checked", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: true,
        trailer_length: "2.50",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    expect(
      screen.getByLabelText("Lunghezza rimorchio (m)")
    ).toBeInTheDocument();
  });

  it("should hide trailer_length field when has_trailer is unchecked", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    expect(
      screen.queryByLabelText("Lunghezza rimorchio (m)")
    ).not.toBeInTheDocument();
  });

  it("should clear trailer_length when unchecking has_trailer", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: true,
        trailer_length: "2.50",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    expect(mockOnVehiclesChange).toHaveBeenCalledWith([
      {
        type: "CAR",
        height: "",
        length: "",
        has_trailer: false,
        trailer_length: "",
      },
    ]);
  });

  it("should remove a vehicle", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "1.80",
        length: "4.50",
        has_trailer: false,
        trailer_length: "",
      },
      {
        type: "MOTO",
        height: "1.20",
        length: "2.00",
        has_trailer: false,
        trailer_length: "",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    expect(screen.getByText("Veicolo 1")).toBeInTheDocument();
    expect(screen.getByText("Veicolo 2")).toBeInTheDocument();

    // Click delete on first vehicle
    const deleteButtons = screen.getAllByTestId("DeleteIcon");
    fireEvent.click(deleteButtons[0].closest("button"));

    expect(mockOnVehiclesChange).toHaveBeenCalledWith([
      {
        type: "MOTO",
        height: "1.20",
        length: "2.00",
        has_trailer: false,
        trailer_length: "",
      },
    ]);
  });

  it("should handle multiple vehicles", () => {
    const vehicles = [
      {
        type: "CAR",
        height: "1.80",
        length: "4.50",
        has_trailer: false,
        trailer_length: "",
      },
      {
        type: "CAMPER",
        height: "2.80",
        length: "7.00",
        has_trailer: true,
        trailer_length: "3.00",
      },
    ];

    render(
      <VehicleSelector
        vehicles={vehicles}
        onVehiclesChange={mockOnVehiclesChange}
      />
    );

    expect(screen.getByText("Veicolo 1")).toBeInTheDocument();
    expect(screen.getByText("Veicolo 2")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Lunghezza rimorchio (m)")
    ).toBeInTheDocument();
  });

  it("should stop click propagation", () => {
    const parentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler}>
        <VehicleSelector {...defaultProps} />
      </div>
    );

    fireEvent.click(screen.getByText("Aggiungi veicolo"));

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
