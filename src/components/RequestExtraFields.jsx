import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaWheelchair } from "react-icons/fa";

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

export const RequestExtraFields = (isTrue) => {
  const [startDate, setStartDate] = useState();

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (isTrue) {
    return (
      <>
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className=" col">
            <DatePicker
              required={true}
              dateFormat="dd/MM/yyyy"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<CustomInput value={formatDate(startDate)} />}
            />
          </div>

          <div className="col">
            <select required={true} className="form-control text-muted ">
              <option value="">Sesso*</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
          </div>
        </div>
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className="col-lg-8 col">
            <input
              //   onChange={(e) => handleChangeCognome(e, eta || 13)}
              type="text"
              className="form-control"
              //   id={n + "Cognome"}
              required={true}
              placeholder="Luogo di nascita*"
            />
          </div>
          <div className="col">
            <select className="form-control text-muted " required={true}>
              <option value="">Nazionalità*</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
          </div>
        </div>
        <div className="nomeCognome row justify-content-center align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className="col">
            <select className="form-control text-muted " required={true}>
              <option value="">Tipo di documento*</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
          </div>
          <div className="col">
            <input
              //   onChange={(e) => handleChangeCognome(e, eta || 13)}
              type="text"
              className="form-control"
              //   id={n + "Cognome"}
              required={true}
              placeholder="Numero documento*"
            />
          </div>
        </div>
        <div className="nomeCognome row  align-items-center g-2 mb-2 flex-column flex-lg-row">
          <div className="col-lg-2 col d-flex align-items-center">
            <FaWheelchair className="ms-2" /> {/* Icon added */}
            <input
              type="checkbox" // Changed to checkbox
              className="ms-2"
              defaultChecked={false} // Checkbox with default value false
            />
          </div>
        </div>
      </>
    );
  }
};
