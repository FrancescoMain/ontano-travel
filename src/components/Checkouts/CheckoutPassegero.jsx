import { Input } from "@mui/joy";

export const CheckoutPrimoPasseggero = () => {
  return (
    <>
      <h5 className="text-secondary">Intestatario del biglietto</h5>
      <div class="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div class="col ">
          <label for="validationCustom01" class="form-label">
            Nome*
          </label>
          <input
            type="text"
            class="form-control"
            id="validationCustom01"
            required
          />
          <div class="valid-feedback">Nome inserito correttamente!</div>
          <div className="invalid-feedback">Inserire Nome</div>
        </div>
        <div class="col ">
          <label for="validationCustom02" class="form-label">
            Cognome*
          </label>
          <input
            type="text"
            class="form-control"
            id="validationCustom02"
            required
          />
          <div class="valid-feedback">Cognome inserito correttamente!</div>
          <div className="invalid-feedback">Inserire Cognome</div>
        </div>
      </div>

      <h6 className="text-secondary">Informazioni di contatto</h6>
      <div class="contatto row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row ">
        <div class="col col-lg-5 ">
          <label for="validationCustom06" class="form-label">
            Cellulare*
          </label>
          <input
            type="text"
            class="form-control"
            id="validationCustom06"
            required
            minLength={9}
          />
          <div class="valid-feedback">Cellulare inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Cellulare</div>
        </div>
        <div class="col ">
          <label for="validationCustom05" class="form-label">
            Email*
          </label>
          <input
            type="email"
            class="form-control"
            id="validationCustom05"
            required
          />
          <div class="valid-feedback">Email inserita correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Email</div>
        </div>
      </div>
    </>
  );
};
export const CheckoutPasseggero = ({ n, eta }) => {
  return (
    <>
      <h5 className="text-secondary">
        {n}° {eta ? "Bambino" : "Passeggero"}
      </h5>
      <div class="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div class="col ">
          <label for={n + "Nome"} class="form-label">
            Nome*
          </label>
          <input type="text" class="form-control" id={n + "Nome"} required />
          <div class="valid-feedback">Nome inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Nome</div>
        </div>
        <div class="col ">
          <label for={n + "Cognome"} class="form-label">
            Cognome*
          </label>
          <input type="text" class="form-control" id={n + "Cognome"} required />
          <div class="valid-feedback">Cognome inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Cognome</div>
        </div>
        <div class="col col-lg-2">
          <label for={n + "Eta"} class="form-label">
            Eta*
          </label>
          <input
            type="text"
            class="form-control"
            id={n + "Eta"}
            value={eta || "13+"}
          />
          <div class="valid-feedback">ok!</div>
          <div className="invalid-feedback">Devi inserire un Eta</div>
        </div>
      </div>
    </>
  );
};
