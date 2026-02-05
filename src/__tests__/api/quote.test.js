import { postQuote } from "../../_api/reservations/quote";

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
    postQuote: {
      route: "/quote",
      method: "POST",
    },
  },
}));

// Mock auth
jest.mock("../../utils/auth", () => ({
  getAuthHeader: () => ({ Authorization: "Bearer test-token" }),
  handleLogout: jest.fn(),
}));

describe("postQuote - etaAdulti", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("should use etaAdulti when provided and matches adulti count", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [5],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.passengers).toEqual([
      { age: 25 },
      { age: 30 },
      { age: 5 },
    ]);
  });

  it("should use default age 18 when etaAdulti is empty", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [5],
        etaAdulti: [],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.passengers).toEqual([
      { age: 18 },
      { age: 18 },
      { age: 5 },
    ]);
  });

  it("should use default age 18 when etaAdulti is undefined", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [5],
        // etaAdulti not provided
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.passengers).toEqual([
      { age: 18 },
      { age: 18 },
      { age: 5 },
    ]);
  });

  it("should use default age when etaAdulti length does not match adulti count", async () => {
    const tratte = [
      {
        adulti: 3,
        etaBambini: [],
        etaAdulti: [25, 30], // Only 2 ages for 3 adults
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    // Should fall back to default ages since count doesn't match
    expect(requestBody[0].params.passengers).toEqual([
      { age: 18 },
      { age: 18 },
      { age: 18 },
    ]);
  });

  it("should handle multiple tratte with different etaAdulti", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
      },
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "456" },
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.passengers).toEqual([
      { age: 25 },
      { age: 30 },
    ]);
    expect(requestBody[1].params.passengers).toEqual([
      { age: 25 },
      { age: 30 },
    ]);
  });
});

describe("postQuote - accommodations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      headers: {
        get: () => "application/json",
      },
      json: () => Promise.resolve({ success: true }),
    });
  });

  it("should include accommodations inside params when provided", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
        accommodations: [
          { code: "DS", qty: 2, hosted_people: 1, type: "CHAIR" },
          { code: "A2", qty: 1, hosted_people: 2, type: "CABIN" },
        ],
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.accomodations).toEqual([
      { code: "DS", qty: 2, hosted_people: 1, type: "CHAIR" },
      { code: "A2", qty: 1, hosted_people: 2, type: "CABIN" },
    ]);
  });

  it("should not include accommodations in params when array is empty", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
        accommodations: [],
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.accomodations).toBeUndefined();
  });

  it("should not include accommodations in params when undefined", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
        // accommodations not provided
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.accomodations).toBeUndefined();
  });

  it("should handle multiple tratte with different accommodations", async () => {
    const tratte = [
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "123" },
        accommodations: [{ code: "DS", qty: 2, hosted_people: 1, type: "CHAIR" }],
      },
      {
        adulti: 2,
        etaBambini: [],
        etaAdulti: [25, 30],
        animali: 0,
        bagagli: 0,
        data: { result_id: "456" },
        accommodations: [], // No accommodations for return
      },
    ];

    await postQuote({ tratte });

    expect(global.fetch).toHaveBeenCalled();
    const requestBody = JSON.parse(global.fetch.mock.calls[0][1].body);

    expect(requestBody[0].params.accomodations).toEqual([
      { code: "DS", qty: 2, hosted_people: 1, type: "CHAIR" },
    ]);
    expect(requestBody[1].params.accomodations).toBeUndefined();
  });
});
