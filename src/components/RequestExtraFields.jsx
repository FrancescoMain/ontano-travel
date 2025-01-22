import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWheelchair } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchNationalities } from "../features/nationalities/nationalitiesSlice";
import { fetchDocumentTypes } from "../features/documentTypes/documentTypesSlice";
import "./RequestExtraFields.css"; // Import the CSS file

export const RequestExtraFields = ({
  isTrue,
  dateDiNascita,
  onChangeDateDiNascita,
  numeroCampo,
  luoghiDiNascita,
  onChangeLuoghiDiNascita,
  nazionalità,
  tipiDiDocumento,
  numeriDiDocumento,
  disabilità,
  onChangeTipiDiDocumento,
  onChangeNumeriDiDocumento,
  onChangeDisabilità,
  onChangeNazionalità,
  generi,
  onChangeGeneri,
  n,
  eta,
}) => {
  const [startDate, setStartDate] = useState();
  const [isDateValid, setIsDateValid] = useState(true);
  const dispatch = useDispatch();
  const nationalities = useSelector(
    (state) => state.nationalities.nationalities
  );
  const documentTypes = useSelector(
    (state) => state.documentTypes.documentTypes
  );

  useEffect(() => {
    if (isTrue) {
      dispatch(fetchNationalities());
      dispatch(fetchDocumentTypes());
    }
  }, [isTrue, dispatch]);

  const calculateDateRange = (age) => {
    const today = new Date();
    const minDate = new Date(today.setFullYear(today.getFullYear() - age - 1));
    const maxDate = new Date(today.setFullYear(today.getFullYear() + 1));
    return {
      min: minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    };
  };

  const dateRange =
    eta !== null && eta !== undefined
      ? calculateDateRange(eta)
      : { min: calculateDateRange(100).min, max: calculateDateRange(13).max };

  const handleChangeDDN = (e) => {
    const newValue = e.target.value;
    onChangeDateDiNascita(numeroCampo, n, newValue);
    if (eta !== null && eta !== undefined) {
      const birthDate = new Date(newValue);
      const today = new Date();
      const ageDiff = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();
      const calculatedAge =
        ageDiff - (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? 1 : 0);
      setIsDateValid(calculatedAge === eta);
    }
  };

  const handleChangeLuogoDiNascita = (e) => {
    const newValue = e.target.value;
    onChangeLuoghiDiNascita(numeroCampo, n, newValue);
  };

  const handleChangeTipiDiDocumento = (e) => {
    const newValue = e.target.value;
    onChangeTipiDiDocumento(numeroCampo, n, newValue);
  };

  const handleChangeNumeriDiDocumento = (e) => {
    const newValue = e.target.value;
    onChangeNumeriDiDocumento(numeroCampo, n, newValue);
  };

  const handleChangeDisabilità = (e) => {
    const newValue = e.target.checked;
    onChangeDisabilità(numeroCampo, n, newValue);
  };
  const handleChangeNazionalità = (e) => {
    const newValue = e.target.value;
    onChangeNazionalità(numeroCampo, n, newValue);
  };

  const handleChangeGeneri = (e) => {
    const newValue = e.target.value;
    onChangeGeneri(numeroCampo, n, newValue);
  };

  const handleSubmit = (e) => {
    if (!isDateValid) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (isTrue) {
    return (
      <form lang="it" onSubmit={handleSubmit} noValidate>
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className=" col">
            <input
              id={n + "dataDiNascita"}
              className={`form-control`}
              required
              onChange={(e) => handleChangeDDN(e)}
              value={
                Array.isArray(dateDiNascita) &&
                dateDiNascita[numeroCampo]?.[n]?.value
                  ? dateDiNascita[numeroCampo][n].value
                  : ""
              }
              min={dateRange.min}
              max={dateRange.max}
              title={`La data deve essere compresa tra ${dateRange.min} e ${dateRange.max}`}
              placeholder="Data di nascita*"
              type="text"
              onfocus="(this.type='date')"
              onClick={(e) => (e.target.type = "date")}
              onblur="(this.type='text')"
            />
          </div>

          <div className="col">
            <select
              id={n + "genere"}
              onChange={(e) => handleChangeGeneri(e)}
              value={
                Array.isArray(generi) && generi[numeroCampo]?.[n]?.value
                  ? generi[numeroCampo][n].value
                  : ""
              }
              required={true}
              className="form-control text-muted selectBorder"
            >
              <option value="">Sesso*</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
          </div>
        </div>
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className="col-lg-8 col">
            <input
              id={n + "luogoDiNascita"}
              onChange={(e) => handleChangeLuogoDiNascita(e)}
              value={
                Array.isArray(luoghiDiNascita) &&
                luoghiDiNascita[numeroCampo]?.[n]?.value
                  ? luoghiDiNascita[numeroCampo][n].value
                  : ""
              }
              type="text"
              className="form-control"
              required={true}
              placeholder="Luogo di nascita*"
            />
          </div>
          <div className="col">
            <select
              id={n + "nazionalità"}
              onChange={(e) => handleChangeNazionalità(e)}
              value={
                Array.isArray(nazionalità) &&
                nazionalità[numeroCampo]?.[n]?.value
                  ? nazionalità[numeroCampo][n].value
                  : ""
              }
              className="form-control text-muted selectBorder"
              required={true}
            >
              <option value="">Nazionalità*</option>
              {nationalities?.items?.map((nationality) => (
                <option
                  key={nationality.nation_code}
                  value={nationality.nation_code}
                >
                  {nationality.description}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className="col">
            <select
              id={n + "tipoDocumento"}
              onChange={(e) => handleChangeTipiDiDocumento(e)}
              value={
                Array.isArray(tipiDiDocumento) &&
                tipiDiDocumento[numeroCampo]?.[n]?.value
                  ? tipiDiDocumento[numeroCampo][n].value
                  : ""
              }
              className="form-control text-muted selectBorder"
              required={true}
            >
              <option value="">Tipo di documento*</option>
              {documentTypes?.items?.map((documentType) => (
                <option
                  key={documentType.documentTypeCode}
                  value={documentType.documentTypeCode}
                >
                  {documentType.description}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              id={n + "numeroDocumento"}
              onChange={(e) => handleChangeNumeriDiDocumento(e)}
              value={
                Array.isArray(numeriDiDocumento) &&
                numeriDiDocumento[numeroCampo]?.[n]?.value
                  ? numeriDiDocumento[numeroCampo][n].value
                  : ""
              }
              type="text"
              className="form-control"
              required={true}
              placeholder="Numero documento*"
            />
          </div>
        </div>
        <div className="nomeCognome row  align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className="col-lg-2 col d-flex align-items-center">
            <FaWheelchair className="ms-2" />
            <input
              id={n + "disabilità"}
              onChange={(e) => handleChangeDisabilità(e)}
              checked={
                Array.isArray(disabilità) && disabilità[numeroCampo]?.[n]?.value
                  ? disabilità[numeroCampo][n].value
                  : false
              }
              type="checkbox"
              className="ms-2"
            />
          </div>
        </div>
      </form>
    );
  }

  return null;
};
