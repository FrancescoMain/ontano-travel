import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWheelchair } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchNationalities } from "../features/nationalities/nationalitiesSlice";
import { fetchDocumentTypes } from "../features/documentTypes/documentTypesSlice";

const CustomInput = ({ value, onClick }) => (
  <input
    className="form-control"
    placeholder="Data di nascita*"
    value={value}
    onClick={onClick}
    readOnly
    required={true}
  />
);

export const RequestExtraFields = ({ isTrue }) => {
  const [startDate, setStartDate] = useState();
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

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isTrue) {
    return (
      <div lang="it">
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className=" col">
            <input type="date" className="form-control" required />
          </div>

          <div className="col">
            <select
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
              type="text"
              className="form-control"
              required={true}
              placeholder="Luogo di nascita*"
            />
          </div>
          <div className="col">
            <select
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
            <input type="checkbox" className="ms-2" defaultChecked={false} />
          </div>
        </div>
      </div>
    );
  }

  return null;
};
