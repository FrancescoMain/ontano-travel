import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDettaglioAgenzia,
  updateDettaglioAgenzia,
} from "../features/ricercaAgenzia/dettaglioAgenziaSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "../components/Spinner/Spinner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const DettaglioAgenzia = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, status, error } = useSelector(
    (state) => state.dettaglioAgenzia
  );
  const [formData, setFormData] = useState({
    attivo: true,
    dirittiDiPrenotazione: 0,
    percentualCommissione: 0,
    abilitaPagamentoEstrattoConto: true,
    abilitaPagamentoPayByLink: true,
  });

  useEffect(() => {
    dispatch(fetchDettaglioAgenzia(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (data) {
      setFormData({
        attivo: data.attivo,
        dirittiDiPrenotazione: data.dirittiDiPrenotazione || null,
        percentualCommissione: data.percentualCommissione || null,
        abilitaPagamentoEstrattoConto:
          data.abilitaPagamentoEstrattoConto || false,
        abilitaPagamentoPayByLink: data.abilitaPagamentoPayByLink || false,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : type === "select-one"
          ? value === "true"
          : type === "number"
          ? parseFloat(value)
          : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(updateDettaglioAgenzia({ id, data: formData }))
      .unwrap()
      .then(() => {
        toast.success("Update successful!");
        navigate("/ricerca-agenzia");
      })
      .catch(() => {
        toast.error("Update failed!");
      });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center g-2">
        <form className="col-lg-6" onSubmit={handleSubmit}>
          <h2>Dettaglio Agenzia</h2>
          {!data && <Spinner active={true} />}
          {data && (
            <>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.name}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Ragione Sociale</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.ragSoc || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Partita IVA</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.parIva || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={data.address || ""}
                  readOnly
                  style={{ backgroundColor: "#e9ecef" }}
                />
              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.city || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">CAP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.cap || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Province</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.prov || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Nationality</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.nationality || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Telephone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.telephone || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={data.email || ""}
                    readOnly
                    style={{ backgroundColor: "#e9ecef" }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Attivo</label>
                  <select
                    className="form-select"
                    name="attivo"
                    value={formData.attivo}
                    onChange={handleChange}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Percentuale Commissione</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    name="percentualCommissione"
                    value={formData.percentualCommissione}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Diritti Di Prenotazione</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    name="dirittiDiPrenotazione"
                    value={formData.dirittiDiPrenotazione}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Abilita Pagamento Estratto Conto
                  </label>
                  <select
                    className="form-select"
                    name="abilitaPagamentoEstrattoConto"
                    value={formData.abilitaPagamentoEstrattoConto}
                    onChange={handleChange}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Abilita Pagamento Pay By Link
                  </label>
                  <select
                    className="form-select"
                    name="abilitaPagamentoPayByLink"
                    value={formData.abilitaPagamentoPayByLink}
                    onChange={handleChange}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
