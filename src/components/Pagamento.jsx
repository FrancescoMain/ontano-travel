import React from "react";

export const Pagamento = ({ methods, checked, onChange, email, setEmail }) => {
  return (
    <div className="col-lg-12  col bg-passeggeri rounded mt-3 mb-3 p-4">
      <h2 className="text-primary">Metodo di pagamento</h2>

      {methods.map((method) => (
        <div className="form-check" key={method}>
          <input
            className="form-check-input"
            type="radio"
            name="flexRadioDefault"
            id={`flexRadioDefault-${method}`}
            checked={checked === method}
            onChange={() => onChange(method)}
          />
          <label
            className="form-check-label"
            htmlFor={`flexRadioDefault-${method}`}
          >
            {method === "CREDIT_CARD" && "Carta di Credito"}
            {method === "PAY_BY_LINK" && "PaybyLink"}
            {method === "EXTERNAL_PAYMENT" && "Estratto Conto"}
          </label>
        </div>
      ))}

      {checked === "PAY_BY_LINK" && (
        <div className="mt-3">
          <label htmlFor="payByLinkEmail" className="form-label">
            A quale email inviare il link
          </label>
          <input
            type="email"
            className="form-control"
            id="payByLinkEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
