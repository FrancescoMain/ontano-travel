import { useTranslation } from "react-i18next";
import { RequestExtraFields } from "../RequestExtraFields";

export const CheckoutPrimoPasseggero = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <>
      <h5 className="text-secondary">Intestatario del biglietto</h5>
      <div class="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div class="col ">
          <input
            placeholder={t("Nome")}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, nome: e.target.value }))
            }
            value={value.nome}
            type="text"
            class="form-control"
            id="validationCustom01"
            required
          />
        </div>
        <div class="col ">
          <input
            placeholder={t("Cognome")}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, cognome: e.target.value }))
            }
            value={value.cognome}
            type="text"
            class="form-control"
            id="validationCustom02"
            required
          />
        </div>
      </div>

      <div class="contatto row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row ">
        <div class="col col-lg-5 ">
          <input
            placeholder={t("Telefono")}
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
        </div>
        <div class="col ">
          <input
            placeholder={t("Email")}
            value={value.email}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, email: e.target.value }))
            }
            type="email"
            class="form-control"
            id="validationCustom05"
            required
          />
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
  required,
  extraFields,
  dateDiNascita,
  luoghiDiNascita,
  nazionalità,
  tipiDiDocumento,
  numeriDiDocumento,
  generi,
  disabilità,
  onChangeLuoghiDiNascita,
  onChangeGeneri,
  onChangeTipiDiDocumento,
  onChangeNumeriDiDocumento,
  onChangeDisabilità,
  onChangeDateDiNascita,
  onChangeNazionalità,
}) => {
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
        {n}° {eta != null ? "Bambino" + " " + eta + " anni" : "Passeggero"}
      </h5>
      <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
        <div className="col">
          <input
            onChange={(e) => handleChange(e)}
            type="text"
            className="form-control"
            id={n + "Nome"}
            required={!required}
            placeholder="Nome*"
            value={
              Array.isArray(nomi) && nomi[numeroCampo]?.[n]?.value
                ? nomi[numeroCampo][n].value
                : ""
            }
          />
        </div>
        <div className="col">
          <input
            onChange={(e) => handleChangeCognome(e, eta == null ? 13 : eta)}
            type="text"
            className="form-control"
            id={n + "Cognome"}
            required={!required}
            placeholder="Cognome*"
            value={
              Array.isArray(cognomi) && cognomi[numeroCampo]?.[n]?.value
                ? cognomi[numeroCampo][n].value
                : ""
            }
          />
        </div>

        {/* <div class="col col-lg-2">
          <input
            type="text"
            class="form-control"
            id={n + "Eta"}
            value={eta != null ? eta : "12+"}
          />
        </div> */}
      </div>
      <RequestExtraFields
        isTrue={extraFields}
        dateDiNascita={dateDiNascita}
        onChangeDateDiNascita={onChangeDateDiNascita}
        luoghiDiNascita={luoghiDiNascita}
        onChangeLuoghiDiNascita={onChangeLuoghiDiNascita}
        nazionalità={nazionalità}
        tipiDiDocumento={tipiDiDocumento}
        numeriDiDocumento={numeriDiDocumento}
        disabilità={disabilità}
        generi={generi}
        onChangeGeneri={onChangeGeneri}
        onChangeTipiDiDocumento={onChangeTipiDiDocumento}
        onChangeNumeriDiDocumento={onChangeNumeriDiDocumento}
        onChangeDisabilità={onChangeDisabilità}
        onChangeNazionalità={onChangeNazionalità}
        numeroCampo={numeroCampo}
        n={n}
        eta={eta}
      />
    </>
  );
};
