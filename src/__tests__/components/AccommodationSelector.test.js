import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AccommodationSelector } from "../../components/ResultCard/AccommodationSelector";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("AccommodationSelector", () => {
  const mockAccommodations = [
    { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR" },
    {
      code: "A2",
      description: "Cabina Esterna",
      hosted_people: 2,
      type: "CABIN",
    },
  ];

  const mockOnSelectionChange = jest.fn();

  const defaultProps = {
    accommodations: mockAccommodations,
    selectedAccommodations: [],
    onSelectionChange: mockOnSelectionChange,
    totalPassengers: 3,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render loading state", () => {
    render(<AccommodationSelector {...defaultProps} loading={true} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render nothing when no accommodations available", () => {
    const { container } = render(
      <AccommodationSelector {...defaultProps} accommodations={[]} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render autocomplete with placeholder", () => {
    render(<AccommodationSelector {...defaultProps} />);

    expect(
      screen.getByPlaceholderText("Seleziona sistemazione")
    ).toBeInTheDocument();
  });

  it("should show selected accommodations with quantity controls", () => {
    const selectedAccommodations = [
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 2 },
    ];

    render(
      <AccommodationSelector
        {...defaultProps}
        selectedAccommodations={selectedAccommodations}
      />
    );

    expect(screen.getByText("Poltrona (1 posti)")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should call onSelectionChange when increasing quantity", () => {
    const selectedAccommodations = [
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 1 },
    ];

    render(
      <AccommodationSelector
        {...defaultProps}
        selectedAccommodations={selectedAccommodations}
      />
    );

    const addButtons = screen.getAllByTestId("AddIcon");
    fireEvent.click(addButtons[0].closest("button"));

    expect(mockOnSelectionChange).toHaveBeenCalledWith([
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 2 },
    ]);
  });

  it("should call onSelectionChange when decreasing quantity", () => {
    const selectedAccommodations = [
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 2 },
    ];

    render(
      <AccommodationSelector
        {...defaultProps}
        selectedAccommodations={selectedAccommodations}
      />
    );

    const removeButtons = screen.getAllByTestId("RemoveIcon");
    fireEvent.click(removeButtons[0].closest("button"));

    expect(mockOnSelectionChange).toHaveBeenCalledWith([
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 1 },
    ]);
  });

  it("should disable decrease button when qty is 1", () => {
    const selectedAccommodations = [
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 1 },
    ];

    render(
      <AccommodationSelector
        {...defaultProps}
        selectedAccommodations={selectedAccommodations}
      />
    );

    const removeButtons = screen.getAllByTestId("RemoveIcon");
    const button = removeButtons[0].closest("button");

    expect(button).toBeDisabled();
  });

  it("should display total capacity info", () => {
    const selectedAccommodations = [
      { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR", qty: 2 },
      { code: "A2", description: "Cabina", hosted_people: 2, type: "CABIN", qty: 1 },
    ];

    render(
      <AccommodationSelector
        {...defaultProps}
        selectedAccommodations={selectedAccommodations}
        totalPassengers={4}
      />
    );

    // Total capacity: 2*1 + 1*2 = 4
    expect(screen.getByText(/Capienza totale.*4.*4.*passeggeri/)).toBeInTheDocument();
  });

  it("should stop click propagation", () => {
    const parentClickHandler = jest.fn();

    render(
      <div onClick={parentClickHandler}>
        <AccommodationSelector {...defaultProps} />
      </div>
    );

    const selector = screen.getByPlaceholderText("Seleziona sistemazione");
    fireEvent.click(selector);

    expect(parentClickHandler).not.toHaveBeenCalled();
  });
});
