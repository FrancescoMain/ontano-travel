import { renderHook, waitFor, act } from "@testing-library/react";
import { useFetchPriceData } from "../../_hooks/useFetchPriceData";

// Mock fetch
global.fetch = jest.fn();

// Mock i18n
jest.mock("../../i18n", () => ({
  language: "it",
}));

// Mock config
jest.mock("../../config/config", () => ({
  config: {
    basePath: "https://api.test.com",
    fetchPriceSearchResult: {
      route: "/price",
      method: "GET",
    },
  },
}));

const DEBOUNCE_DELAY = 1500;

describe("useFetchPriceData", () => {
  const mockSetLoading = jest.fn();
  const mockSetPriceData = jest.fn();

  const defaultProps = {
    data: { result_id: "123" },
    adulti: 2,
    etaBambini: [5],
    etaAdulti: [],
    animali: 0,
    bagagli: 0,
    setLoading: mockSetLoading,
    setPriceData: mockSetPriceData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ price: 100, priceFormatted: "100,00 €" }),
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("skipFetch parameter", () => {
    it("should not fetch when skipFetch is true", async () => {
      renderHook(() =>
        useFetchPriceData({
          ...defaultProps,
          skipFetch: true,
        })
      );

      // Advance timers past debounce
      act(() => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
      });

      expect(global.fetch).not.toHaveBeenCalled();
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetPriceData).toHaveBeenCalledWith(null);
    });

    it("should fetch when skipFetch is false", async () => {
      renderHook(() =>
        useFetchPriceData({
          ...defaultProps,
          skipFetch: false,
        })
      );

      // Advance timers past debounce
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
      });

      expect(global.fetch).toHaveBeenCalled();
    });

    it("should fetch when skipFetch is not provided (default)", async () => {
      const { etaAdulti, ...propsWithoutEtaAdulti } = defaultProps;
      renderHook(() => useFetchPriceData(propsWithoutEtaAdulti));

      // Advance timers past debounce
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
      });

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe("etaAdulti parameter", () => {
    it("should use default age 18 when etaAdulti is empty", async () => {
      renderHook(() =>
        useFetchPriceData({
          ...defaultProps,
          etaAdulti: [],
        })
      );

      // Advance timers past debounce
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
      });

      expect(global.fetch).toHaveBeenCalled();
      const fetchUrl = global.fetch.mock.calls[0][0];
      // Should have 2 adults with age 18 and 1 child with age 5
      expect(fetchUrl).toContain("passengers_age=18");
      expect(fetchUrl).toContain("passengers_age=5");
    });

    it("should use etaAdulti when provided and matches adulti count", async () => {
      renderHook(() =>
        useFetchPriceData({
          ...defaultProps,
          adulti: 2,
          etaAdulti: [25, 30],
        })
      );

      // Advance timers past debounce
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
      });

      expect(global.fetch).toHaveBeenCalled();
      const fetchUrl = global.fetch.mock.calls[0][0];
      expect(fetchUrl).toContain("passengers_age=25");
      expect(fetchUrl).toContain("passengers_age=30");
      expect(fetchUrl).toContain("passengers_age=5");
    });

    it("should fall back to default age when etaAdulti length does not match adulti count", async () => {
      renderHook(() =>
        useFetchPriceData({
          ...defaultProps,
          adulti: 3,
          etaAdulti: [25, 30], // Only 2 ages for 3 adults
        })
      );

      // Advance timers past debounce
      await act(async () => {
        jest.advanceTimersByTime(DEBOUNCE_DELAY + 100);
      });

      expect(global.fetch).toHaveBeenCalled();
      const fetchUrl = global.fetch.mock.calls[0][0];
      // Should use default ages (18) since count doesn't match
      const matches = fetchUrl.match(/passengers_age=18/g);
      expect(matches).toHaveLength(3);
    });
  });
});
