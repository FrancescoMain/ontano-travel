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

export const CheckoutPasseggero = ({
  n,
  eta,
  onChangeNomi,
  onChangeCognomi,
  lenght,
  nomi,
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    const updatedNomi = [...nomi];

    // Aggiorna il valore del campo corrente e dei campi successivi
    for (let i = n - 1; i < lenght; i++) {
      updatedNomi[i] = newValue;
    }

    onChangeNomi(updatedNomi);
  };

  return (
    <>
      <h5 className="text-secondary">
        {n}° {eta ? "Bambino" : "Passeggero"}
      </h5>
      <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div className="col">
          <input
            onChange={handleChange}
            type="text"
            className="form-control"
            id={n + "Nome"}
            required
            placeholder="Nome*"
            value={nomi[n - 1] || ""}
          />
          <div className="valid-feedback">Nome inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Nome</div>
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            id={n + "Cognome"}
            required
            placeholder="Cognome*"
          />
          <div className="valid-feedback">Cognome inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Cognome</div>
        </div>
      </div>
    </>
  );
};
