/**
 * Tests for vehicle logic used in Checkout.jsx
 *
 * Key behavior:
 * - Frontend: user enters plate ONCE per unique vehicle (from first tratta)
 * - Backend: receives vehicle details once, distributes per tratta internally
 * - No regression: round-trip/multi-tratta shows same plate fields as single tratta
 */

describe("Checkout vehicle logic", () => {
  // Simulates the vehiclesFromQuote extraction from linkQuote
  function extractVehiclesFromLinkQuote(linkQuoteJson) {
    try {
      const parsed = JSON.parse(linkQuoteJson);
      const firstTrattaWithVehicles = parsed.tratte?.find(
        (tratta) => tratta.vehicles?.some((v) => v && v.type)
      );
      const vehicles = firstTrattaWithVehicles?.vehicles?.filter(
        (v) => v && v.type
      ) || [];
      return vehicles.length > 0 ? vehicles : null;
    } catch {
      return null;
    }
  }

  // Simulates the vehiclesForReserve construction
  function buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails) {
    if (!vehiclesFromQuote) return null;
    return vehiclesFromQuote.flatMap((v, i) => {
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

      const vehicles = extractVehiclesFromLinkQuote(linkQuote);

      expect(vehicles).toHaveLength(1);
      expect(vehicles[0].type).toBe("CAR");
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

      const vehicles = extractVehiclesFromLinkQuote(linkQuote);

      expect(vehicles).toHaveLength(2);
      expect(vehicles[0].type).toBe("CAR");
      expect(vehicles[1].type).toBe("MCY");
    });

    it("should handle multi-tratta (3 legs) - still only first tratta vehicles", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
        ],
      });

      const vehicles = extractVehiclesFromLinkQuote(linkQuote);

      expect(vehicles).toHaveLength(1);
      expect(vehicles[0].type).toBe("CAR");
    });

    it("should handle single tratta (solo andata)", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [
          { vehicles: [{ type: "CAR", height: "1.8", length: "4.5" }] },
        ],
      });

      const vehicles = extractVehiclesFromLinkQuote(linkQuote);

      expect(vehicles).toHaveLength(1);
    });

    it("should return null when no vehicles", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [{ vehicles: [] }, { vehicles: [] }],
      });

      expect(extractVehiclesFromLinkQuote(linkQuote)).toBeNull();
    });

    it("should return null when tratte have no vehicles key", () => {
      const linkQuote = JSON.stringify({
        result: "quote123",
        tratte: [{}, {}],
      });

      expect(extractVehiclesFromLinkQuote(linkQuote)).toBeNull();
    });
  });

  describe("buildVehiclesForReserve", () => {
    it("should send 1 vehicle once (not duplicated for round-trip)", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5" },
      ];
      const vehicleDetails = [{ regNumber: "AA000BB", fuelType: "BENZINA" }];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        type: "CAR",
        regNumber: "AA000BB",
        fuelType: "BENZINA",
      });
    });

    it("should send 2 vehicles once each", () => {
      const vehiclesFromQuote = [
        { type: "CAR", height: "1.8", length: "4.5" },
        { type: "MCY", height: "1.2", length: "2.0" },
      ];
      const vehicleDetails = [
        { regNumber: "AA000BB", fuelType: "BENZINA" },
        { regNumber: "CC111DD", fuelType: "DIESEL" },
      ];

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails);

      expect(result).toHaveLength(2);
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
    });

    it("should add TRL entry for vehicle with trailer", () => {
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

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails);

      expect(result).toHaveLength(2); // CAR + TRL
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
    });

    it("should return null when no vehicles", () => {
      expect(buildVehiclesForReserve(null, [])).toBeNull();
    });

    it("should handle 2 vehicles + trailer (complex case)", () => {
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

      const result = buildVehiclesForReserve(vehiclesFromQuote, vehicleDetails);

      expect(result).toHaveLength(3); // CAR + TRL + MCY
      expect(result[0]).toEqual({ type: "CAR", regNumber: "AA000BB", fuelType: "BENZINA" });
      expect(result[1]).toEqual({ type: "TRL", regNumber: "TT111RR", fuelType: "BENZINA" });
      expect(result[2]).toEqual({ type: "MCY", regNumber: "CC111DD", fuelType: "DIESEL" });
    });
  });
});
