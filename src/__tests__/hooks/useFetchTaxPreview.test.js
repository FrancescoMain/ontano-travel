import { renderHook, act } from "@testing-library/react";
import { useFetchTaxPreview } from "../../_hooks/useFetchTaxPreview";

// Mock fetch
global.fetch = jest.fn();

// Mock config
jest.mock("../../config/config", () => ({
  config: {
    basePath: "https://api.test.com",
    getTaxPreview: {
      route: "/api/booking/price/taxpreview",
      method: "GET",
    },
  },
}));

const DEBOUNCE_DELAY = 1500;

describe("useFetchTaxPreview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ price: 5.5, priceFormatted: "5,50 €" }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should skip fetch when totalPrice is 0", () => {
    const { result } = renderHook(() => useFetchTaxPreview(0));

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.taxData).toBeNull();
    expect(result.current.taxLoading).toBe(false);
  });

  it("should skip fetch when totalPrice is null", () => {
    const { result } = renderHook(() => useFetchTaxPreview(null));

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result.current.taxData).toBeNull();
    expect(result.current.taxLoading).toBe(false);
  });

  it("should fetch with correct URL when totalPrice is provided", async () => {
    renderHook(() => useFetchTaxPreview(120.5));

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchUrl = global.fetch.mock.calls[0][0];
    expect(fetchUrl).toBe(
      "https://api.test.com/api/booking/price/taxpreview?total_price=120.5"
    );
    expect(global.fetch.mock.calls[0][1]).toEqual({ method: "GET" });
  });

  it("should return taxData after successful fetch", async () => {
    const { result } = renderHook(() => useFetchTaxPreview(100));

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(result.current.taxData).toEqual({
      price: 5.5,
      priceFormatted: "5,50 €",
    });
    expect(result.current.taxLoading).toBe(false);
  });

  it("should show loading state before debounce completes", () => {
    const { result } = renderHook(() => useFetchTaxPreview(100));

    // Loading should be true immediately
    expect(result.current.taxLoading).toBe(true);

    // But fetch should not have been called yet
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("should debounce API calls", async () => {
    const { rerender } = renderHook(
      ({ price }) => useFetchTaxPreview(price),
      { initialProps: { price: 100 } }
    );

    // Change price before debounce fires
    act(() => {
      jest.advanceTimersByTime(500);
    });
    rerender({ price: 200 });

    act(() => {
      jest.advanceTimersByTime(500);
    });
    rerender({ price: 300 });

    // Wait for final debounce
    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    // Should only have fetched once (the last value)
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const fetchUrl = global.fetch.mock.calls[0][0];
    expect(fetchUrl).toContain("total_price=300");
  });

  it("should handle fetch errors gracefully", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network error"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useFetchTaxPreview(100));

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(result.current.taxData).toBeNull();
    expect(result.current.taxLoading).toBe(false);

    consoleSpy.mockRestore();
  });

  it("should handle non-ok response", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const { result } = renderHook(() => useFetchTaxPreview(100));

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(result.current.taxData).toBeNull();
    expect(result.current.taxLoading).toBe(false);

    consoleSpy.mockRestore();
  });

  it("should refetch when totalPrice changes", async () => {
    const { rerender } = renderHook(
      ({ price }) => useFetchTaxPreview(price),
      { initialProps: { price: 100 } }
    );

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    rerender({ price: 250 });

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    const secondUrl = global.fetch.mock.calls[1][0];
    expect(secondUrl).toContain("total_price=250");
  });

  it("should reset taxData when totalPrice becomes 0", async () => {
    const { result, rerender } = renderHook(
      ({ price }) => useFetchTaxPreview(price),
      { initialProps: { price: 100 } }
    );

    await act(async () => {
      jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
    });

    expect(result.current.taxData).not.toBeNull();

    rerender({ price: 0 });

    expect(result.current.taxData).toBeNull();
    expect(result.current.taxLoading).toBe(false);
  });
});
