import viaggioReducer, {
  upsertDettagli,
  resetDettagli,
} from "../../features/viaggio/findTratta";

describe("findTratta slice - etaAdulti", () => {
  const getInitialState = () => ({
    tratte: [{ id: 0, tratta: {}, trattaFormatted: [] }],
    date: [{ id: 0, date: "", dateFormatted: "" }],
    dettagli: [
      {
        id: 0,
        adulti: 1,
        etaBambini: [],
        etaAdulti: [],
        bambini: 0,
        animali: 0,
        bagagli: 0,
      },
    ],
    multitratta: true,
    nTratte: 0,
  });

  describe("upsertDettagli with etaAdulti", () => {
    it("should add etaAdulti to existing dettagli", () => {
      const initialState = getInitialState();
      const action = upsertDettagli({ id: 0, etaAdulti: [25, 30] });
      const state = viaggioReducer(initialState, action);

      expect(state.dettagli[0].etaAdulti).toEqual([25, 30]);
      expect(state.dettagli[0].adulti).toBe(1); // Other fields preserved
    });

    it("should update etaAdulti without affecting other fields", () => {
      const initialState = getInitialState();
      initialState.dettagli[0].adulti = 2;
      initialState.dettagli[0].animali = 1;

      const action = upsertDettagli({ id: 0, etaAdulti: [45, 42] });
      const state = viaggioReducer(initialState, action);

      expect(state.dettagli[0].etaAdulti).toEqual([45, 42]);
      expect(state.dettagli[0].adulti).toBe(2);
      expect(state.dettagli[0].animali).toBe(1);
    });
  });

  describe("resetDettagli with etaAdulti", () => {
    it("should reset etaAdulti to empty array", () => {
      const initialState = getInitialState();
      initialState.dettagli[0].etaAdulti = [25, 30, 35];
      initialState.dettagli[0].adulti = 3;

      const action = resetDettagli({ id: 0 });
      const state = viaggioReducer(initialState, action);

      expect(state.dettagli[0].etaAdulti).toEqual([]);
      expect(state.dettagli[0].adulti).toBe(1);
    });
  });

  describe("initial state", () => {
    it("should have etaAdulti as empty array in all dettagli", () => {
      const initialState = viaggioReducer(undefined, { type: "@@INIT" });

      initialState.dettagli.forEach((dettaglio) => {
        expect(dettaglio.etaAdulti).toEqual([]);
      });
    });
  });
});
