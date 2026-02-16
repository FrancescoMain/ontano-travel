/**
 * Tests for vehicle duplication logic used in Checkout.jsx
 *
 * Key behavior:
 * - Frontend: user enters plate ONCE per unique vehicle (from first tratta)
 * - Backend: vehicle details are duplicated N times (one per tratta with vehicles)
 * - No regression: multiple vehicles with multiple tratte = still one plate per vehicle
 */

describe("Checkout vehicle logic", () => {
  // Simulates the vehiclesFromQuote + numTratteWithVehicles extraction from linkQuote
  function extractVehiclesFromLinkQuote(linkQuoteJson) {
    try {
      const parsed = JSON.parse(linkQuoteJson);
      const tratteWithVehicles =
        parsed.tratte?.filter((tratta) =>
          tratta.vehicles?.some((v) => v && v.type)
        ) || [];
      const firstTrattaVehicles =
        tratteWithVehicles[0]?.vehicles?.filter((v) => v && v.type) || [];
      return {
        vehiclesFromQuote:
          firstTrattaVehicles.length > 0 ? firstTrattaVehicles : null,
        numTratteWithVehicles: tratteWithVehicles.length,
      };
    } catch {
      return { vehiclesFromQuote: null, numTratteWithVehicles: 0 };
    }
  }

  // Simulates the vehiclesForReserve construction
  function buildVehiclesForReserve(
    vehiclesFromQuote,
    vehicleDetails,
    numTratteWithVehicles
  ) {
    if (!vehiclesFromQuote) return null;
    const singleSet = vehiclesFromQuote.flatMap((v, i) => {
      const main = {
        type: v.type,
        regNumber: vehicleDetails[i]?.regNumber || "",
        fuelType: vehicleDetails[i]?.fuelType || "BENZINA",
      };
      if (v.has_trailer) {
        return [
          main,
          {
            type: "TRL",
            regNumber: vehicleDetails[i]?.trailerRegNumber || "",
            fuelType: vehicleDetails[i]?.trailerFuelType || "BENZINA",
          },
        ];
      }
      return [main];
    });
    const repeated = [];
    for (let t = 0; t < numTratteWithVehicles; t++) {
      repeated.push(...singleSet);
    }
    return repeated;
  }

  describe("extractVehiclesFromLinkQuote", () => {
    it("should extract vehicles from first tratta only (round-trip, 1 vehicle)", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
        ],
      });

      const { vehiclesFromQuote, numTratteWithVehicles } =
        extractVehiclesFromLinkQuote(linkQuote);

      expect(vehiclesFromQuote).toHaveLength(1);
      expect(vehiclesFromQuote[0].type).toBe("CAR");
      expect(numTratteWithVehicles).toBe(2);
    });

    it("should extract vehicles from first tratta only (round-trip, 2 vehicles)", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [
          {
            vehicles: [
              { type: "CAR", height: "1.8", length: "4.5" },
              { type: "MCY", height: "1.2", length: "2.0" },
            ],
          },
          {
            vehicles: [
              { type: "CAR", height: "1.8", length: "4.5" },
              { type: "MCY", height: "1.2", length: "2.0" },
            ],
          },
        ],
      });

      const { vehiclesFromQuote, numTratteWithVehicles } =
        extractVehiclesFromLinkQuote(linkQuote);

      expect(vehiclesFromQuote).toHaveLength(2);
      expect(numTratteWithVehicles).toBe(2);
    });

    it("should handle multi-tratta (3 legs)", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
        ],
      });

      const { vehiclesFromQuote, numTratteWithVehicles } =
        extractVehiclesFromLinkQuote(linkQuote);

      expect(vehiclesFromQuote).toHaveLength(1);
      expect(numTratteWithVehicles).toBe(3);
    });

    it("should handle single tratta (solo andata)", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
        ],
      });

      const { vehiclesFromQuote, numTratteWithVehicles } =
        extractVehiclesFromLinkQuote(linkQuote);

      expect(vehiclesFromQuote).toHaveLength(1);
      expect(numTratteWithVehicles).toBe(1);
    });

    it("should return null when no vehicles", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [{ vehicles: [] }, { vehicles: [] }],
      });

      const { vehiclesFromQuote, numTratteWithVehicles } =
        extractVehiclesFromLinkQuote(linkQuote);

      expect(vehiclesFromQuote).toBeNull();
      expect(numTratteWithVehicles).toBe(0);
    });

    it("should return null when tratte have no vehicles key", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [{}, {}],
      });

      const { vehiclesFromQuote, numTratteWithVehicles } =
        extractVehiclesFromLinkQuote(linkQuote);

      expect(vehiclesFromQuote).toBeNull();
      expect(numTratteWithVehicles).toBe(0);
    });
  });

  describe("buildVehiclesForReserve", () => {
    it("should duplicate 1 vehicle for 2 tratte (round-trip)", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5" },
      ];
      const vehicleDetails = [{ regNumber: "AA000BB", fuelType: "BENZINA" }];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails, 2);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
      expect(result[1]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
    });

    it("should duplicate 2 vehicles for 2 tratte (round-trip, no regression)", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5" },
        { type: "MCY", height: "1.2", length: "2.0" },
      ];
      const vehicleDetails = [
        { regNumber: "AA000BB", fuelType: "BENZINA" },
        { regNumber: "CC111DD", fuelType: "DIESEL" },
      ];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails, 2);

      expect(result).toHaveLength(4);
      // First tratta
      expect(result[0]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
      expect(result[1]).toEqual({
        type: "MCY",
        regNumber: "CC111DD",
        fuelType: "DIESEL",
      });
      // Second tratta (duplicated)
      expect(result[2]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
      expect(result[3]).toEqual({
        type: "MCY",
        regNumber: "CC111DD",
        fuelType: "DIESEL",
      });
    });

    it("should duplicate vehicle with trailer for 2 tratte", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5", has_trailer: true },
      ];
      const vehicleDetails = [
        {
          regNumber: "AA000BB",
          fuelType: "BENZINA",
          trailerRegNumber: "XY789ZZ",
          trailerFuelType: "DIESEL",
        },
      ];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails, 2);

      expect(result).toHaveLength(4); // (CAR + TRL) x 2
      // First tratta
      expect(result[0]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
      expect(result[1]).toEqual({
        type: "TRL",
        regNumber: "XY789ZZ",
        fuelType: "DIESEL",
      });
      // Second tratta
      expect(result[2]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
      expect(result[3]).toEqual({
        type: "TRL",
        regNumber: "XY789ZZ",
        fuelType: "DIESEL",
      });
    });

    it("should not duplicate for single tratta", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5" },
      ];
      const vehicleDetails = [{ regNumber: "AA000BB", fuelType: "BENZINA" }];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails, 1);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
    });

    it("should duplicate 1 vehicle for 3 tratte (multi-tratta)", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5" },
      ];
      const vehicleDetails = [{ regNumber: "AA000BB", fuelType: "BENZINA" }];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails, 3);

      expect(result).toHaveLength(3);
      result.forEach((v) => {
        expect(v).toEqual({
          type: "CAR",
          regNumber: "AA000BB",
          fuelType: "BENZINA",
        });
      });
    });

    it("should return null when no vehicles", () => {
      const result = buildVehiclesForReserve(null, [], 2);
      expect(result).toBeNull();
    });

    it("should handle 2 vehicles + trailer for 2 tratte (complex case, no regression)", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5", has_trailer: true },
        { type: "MCY", height: "1.2", length: "2.0" },
      ];
      const vehicleDetails = [
        {
          regNumber: "AA000BB",
          fuelType: "BENZINA",
          trailerRegNumber: "TT111RR",
          trailerFuelType: "BENZINA",
        },
        { regNumber: "CC111DD", fuelType: "DIESEL" },
      ];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails, 2);

      // (CAR + TRL + MCY) x 2 = 6
      expect(result).toHaveLength(6);
      // First tratta
      expect(result[0]).toEqual({ type: "CAR", regNumber: "AA000BB", fuelType: "BENZINA" });
      expect(result[1]).toEqual({ type: "TRL", regNumber: "TT111RR", fuelType: "BENZINA" });
      expect(result[2]).toEqual({ type: "MCY", regNumber: "CC111DD", fuelType: "DIESEL" });
      // Second tratta
      expect(result[3]).toEqual({ type: "CAR", regNumber: "AA000BB", fuelType: "BENZINA" });
      expect(result[4]).toEqual({ type: "TRL", regNumber: "TT111RR", fuelType: "BENZINA" });
      expect(result[5]).toEqual({ type: "MCY", regNumber: "CC111DD", fuelType: "DIESEL" });
    });
  });
});
