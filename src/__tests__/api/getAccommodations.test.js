import { getAccommodations } from "../../_api/accommodations/getAccommodations";

// Mock fetch
global.fetch = jest.fn();

// Mock config
jest.mock("../../config/config", () => ({
  config: {
    basePath: "https://api.test.com",
    getAccommodations: {
      route: "/api/booking/accomodation",
      method: "GET",
    },
  },
}));

describe("getAccommodations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch accommodations with correct URL parameters", async () => {
    const mockAccommodations = [
      {
        code: "DS",
        description: "Poltrona",
        hosted_people: 1,
        type: "CHAIR",
      },
      {
        code: "A2",
        description: "Cabina Esterna (max 2 persone)",
        hosted_people: 2,
        type: "CABIN",
      },
    ];

    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAccommodations),
    });

    const result = await getAccommodations("search123", "it");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test.com/api/booking/accomodation?search_result_id=search123&language=it",
      { method: "GET" }
    );
    expect(result).toEqual(mockAccommodations);
  });

  it("should use default language 'it' when not provided", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await getAccommodations("search123");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test.com/api/booking/accomodation?search_result_id=search123&language=it",
      { method: "GET" }
    );
  });

  it("should use provided language parameter", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    await getAccommodations("search123", "en");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.test.com/api/booking/accomodation?search_result_id=search123&language=en",
      { method: "GET" }
    );
  });

  it("should throw error when response is not ok", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getAccommodations("search123", "it")).rejects.toThrow(
      "Failed to fetch accommodations"
    );
  });

  it("should return empty array from API", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    const result = await getAccommodations("search123", "it");

    expect(result).toEqual([]);
  });
});
