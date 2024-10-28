import { Input } from "@mui/joy";

export const CheckoutPrimoPasseggero = ({ value, onChange }) => {
  return (
    <>
      <h5 className="text-secondary">Intestatario del biglietto</h5>
      <div class="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div class="col ">
          <label for="validationCustom01" class="form-label">
            Nome*
          </label>
          <input
            onChange={(e) =>
              onChange((prev) => ({ ...prev, nome: e.target.value }))
            }
            value={value.nome}
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
            onChange={(e) =>
              onChange((prev) => ({ ...prev, cognome: e.target.value }))
            }
            value={value.cognome}
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
            value={value.cellulare}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, cellulare: e.target.value }))
            }
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
            value={value.email}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, email: e.target.value }))
            }
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
  numeroCampo,
  cognomi,
}) => {
  console.log(nomi);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChangeNomi(numeroCampo, n, newValue); // Passa la tratta, il passeggero e il nuovo valore
  };

  const handleChangeCognome = (e, eta) => {
    const newValue = e.target.value;
    onChangeCognomi(numeroCampo, n, newValue, eta); // Passa la tratta, il passeggero e il nuovo valore
  };
  return (
    <>
      <h5 className="text-secondary">
        {n}° {eta ? "Bambino" : "Passeggero"}
      </h5>
      <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div className="col">
          <input
            onChange={(e) => handleChange(e)}
            type="text"
            className="form-control"
            id={n + "Nome"}
            required
            placeholder="Nome*"
            value={
              Array.isArray(nomi) && nomi[numeroCampo]?.[n]?.value
                ? nomi[numeroCampo][n].value
                : ""
            }
          />
          <div className="valid-feedback">Nome inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Nome</div>
        </div>
        <div className="col">
          <input
            onChange={(e) => handleChangeCognome(e, eta || 13)}
            type="text"
            className="form-control"
            id={n + "Cognome"}
            required
            placeholder="Cognome*"
            value={
              Array.isArray(cognomi) && cognomi[numeroCampo]?.[n]?.value
                ? cognomi[numeroCampo][n].value
                : ""
            }
          />
          <div className="valid-feedback">Cognome inserito correttamente!</div>
          <div className="invalid-feedback">Devi inserire un Cognome</div>
        </div>
        <div class="col col-lg-2">
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
