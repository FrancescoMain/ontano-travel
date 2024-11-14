import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import {
  searchReservations,
  setPage,
  setSize,
} from "../features/reservation/prenotazioniSlice";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

export const Prenotazioni = () => {
  const [formData, setFormData] = useState({
    reservation_code: "",
    from_date: "",
    to_date: "",
    agency_id: "",
    guest_email: "",
    contact_name: "",
    contact_surname: "",
    sort: "",
  });

  const dispatch = useDispatch();
  const { reservations, status, error, totalCount, page, size } = useSelector(
    (state) => state.prenotazioni
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(searchReservations({ ...formData, page, size }));
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
    dispatch(searchReservations({ ...formData, page: newPage, size }));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setSize(newSize));
    dispatch(searchReservations({ ...formData, page, size: newSize }));
  };

  return (
    <div className="container mt-4">
      <h1>Prenotazioni</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-2 mb-3">
            <label className="form-label">Codice della prenotazione:</label>
            <input
              type="text"
              name="reservation_code"
              className="form-control"
              value={formData.reservation_code}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Data di inizio:</label>
            <input
              type="date"
              name="from_date"
              className="form-control"
              value={formData.from_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Data di fine:</label>
            <input
              type="date"
              name="to_date"
              className="form-control"
              value={formData.to_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">ID dell'agenzia:</label>
            <input
              type="number"
              name="agency_id"
              className="form-control"
              value={formData.agency_id}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Email dell'ospite:</label>
            <input
              type="email"
              name="guest_email"
              className="form-control"
              value={formData.guest_email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Nome del contatto:</label>
            <input
              type="text"
              name="contact_name"
              className="form-control"
              value={formData.contact_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">Cognome del contatto:</label>
            <input
              type="text"
              name="contact_surname"
              className="form-control"
              value={formData.contact_surname}
              onChange={handleChange}
            />
          </div>
          <input
            type="hidden"
            name="page"
            value={page}
            onChange={handleChange}
          />
          <input
            type="hidden"
            name="size"
            value={size}
            onChange={handleChange}
          />
          <input
            type="hidden"
            name="sort"
            value={formData.sort}
            onChange={handleChange}
          />
          <div className="col-md-2 mb-3 align-self-end">
            <button type="submit" className="btn btn-primary">
              Cerca
            </button>
          </div>
        </div>
      </form>
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Codice Prenotazione</TableCell>
              <TableCell>Data Prenotazione</TableCell>
              <TableCell>Prezzo</TableCell>
              <TableCell>Email Contatto</TableCell>
              <TableCell>Nome Contatto</TableCell>
              <TableCell>Cognome Contatto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === "loading" && (
              <TableRow>
                <TableCell colSpan={6}>Loading...</TableCell>
              </TableRow>
            )}
            {status === "failed" && (
              <TableRow>
                <TableCell colSpan={6}>Error: {error}</TableCell>
              </TableRow>
            )}
            {reservations.map((reservation) => (
              <TableRow key={reservation.reservationCode}>
                <TableCell>{reservation.reservationCode}</TableCell>
                <TableCell>{reservation.dataReservation}</TableCell>
                <TableCell>{reservation.prezzo}</TableCell>
                <TableCell>{reservation.contact_mail}</TableCell>
                <TableCell>{reservation.contact_name}</TableCell>
                <TableCell>{reservation.contact_surname}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[1, 5, 10, 20]}
          component="div"
          count={totalCount}
          rowsPerPage={size}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleSizeChange}
          labelRowsPerPage={<div className="mt-3">Page Size</div>}
        />
      </TableContainer>
    </div>
  );
};
