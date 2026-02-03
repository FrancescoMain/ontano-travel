import { renderHook, act } from "@testing-library/react";
import { useFetchAccommodations } from "../../_hooks/useFetchAccommodations";
import { getAccommodations } from "../../_api/accommodations/getAccommodations";

// Mock the API function
jest.mock("../../_api/accommodations/getAccommodations");

// Mock i18n
jest.mock("../../i18n", () => ({
  language: "it",
}));

const DEBOUNCE_DELAY = 300;

describe("useFetchAccommodations", () => {
  const mockSetLoading = jest.fn();
  const mockSetAccommodations = jest.fn();

  const defaultProps = {
    searchResultId: "search123",
    isGrimaldi: true,
    setLoading: mockSetLoading,
    setAccommodations: mockSetAccommodations,
  };

  const mockAccommodations = [
    { code: "DS", description: "Poltrona", hosted_people: 1, type: "CHAIR" },
    {
      code: "A2",
      description: "Cabina Esterna",
      hosted_people: 2,
      type: "CABIN",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    getAccommodations.mockResolvedValue(mockAccommodations);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should fetch accommodations for Grimaldi routes", async () => {
    renderHook(() => useFetchAccommodations(defaultProps));

    // Should set loading true immediately
    expect(mockSetLoading).toHaveBeenCalledWith(true);

    // Advance timers past debounce
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(getAccommodations).toHaveBeenCalledWith("search123", "it");
    expect(mockSetAccommodations).toHaveBeenCalledWith(mockAccommodations);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should not fetch for non-Grimaldi routes", async () => {
    renderHook(() =>
      useFetchAccommodations({
        ...defaultProps,
        isGrimaldi: false,
      })
    );

    // Advance timers past debounce
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(getAccommodations).not.toHaveBeenCalled();
    expect(mockSetAccommodations).toHaveBeenCalledWith([]);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  it("should not fetch when searchResultId is missing", async () => {
    renderHook(() =>
      useFetchAccommodations({
        ...defaultProps,
        searchResultId: null,
      })
    );

    // Advance timers past debounce
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(getAccommodations).not.toHaveBeenCalled();
    expect(mockSetAccommodations).toHaveBeenCalledWith([]);
  });

  it("should handle API errors gracefully", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getAccommodations.mockRejectedValue(new Error("API error"));

    renderHook(() => useFetchAccommodations(defaultProps));

    // Advance timers past debounce
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(mockSetAccommodations).toHaveBeenCalledWith([]);
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(consoleError).toHaveBeenCalled();

    consoleError.mockRestore();
  });

  it("should debounce the API call", async () => {
    renderHook(() => useFetchAccommodations(defaultProps));

    // Advance timers halfway
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY / 2);
    });

    // Should not have called yet
    expect(getAccommodations).not.toHaveBeenCalled();

    // Advance timers past debounce
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    // Now should have called
    expect(getAccommodations).toHaveBeenCalledTimes(1);
  });

  it("should handle null response from API", async () => {
    getAccommodations.mockResolvedValue(null);

    renderHook(() => useFetchAccommodations(defaultProps));

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(mockSetAccommodations).toHaveBeenCalledWith([]);
  });
});
