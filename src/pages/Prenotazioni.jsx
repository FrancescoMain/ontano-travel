import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { fetchAgenzie } from "../features/ricercaAgenzia/ricercaAgenziaSlice";
import { setAccountData } from "../features/account/accountSlice"; // Import setAccountData
import { useTranslation } from "react-i18next"; // Import useTranslation
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa"; // Import sorting icons
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles
import "./Prenotazioni.css"; // Import the CSS file
import { format } from "date-fns"; // Import date-fns for date formatting

const HeaderTableRow = styled(TableRow)({
  backgroundColor: "#f5f5f5",
  fontWeight: "bold",
  "& .MuiTableCell-root": {
    fontSize: "0.775rem", // Reduce font size
  },
});

const formatDate = (dateString) => {
  if (!dateString) return ""; // Return empty string if dateString is null or empty
  const date = new Date(dateString);
  return format(date, "dd-MM-yyyy HH:mm");
};

export const Prenotazioni = () => {
  const { t } = useTranslation(); // Initialize useTranslation
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

  const [agenzie, setAgenzie] = useState([]);

  useEffect(() => {
    dispatch(fetchAgenzie({ page: 0, size: 100 })).then((response) => {
      if (response.payload && response.payload.data) {
        setAgenzie(response.payload.data);
      }
    });
  }, [dispatch]);

  const { reservations, status, error, totalCount, page, size } = useSelector(
    (state) => state.prenotazioni
  );

  const { data: accountData } = useSelector((state) => state.account); // Get account data from state

  const navigate = useNavigate();

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

  const handleRowClick = (reservationCode, guestEmail) => {
    navigate(`/reservation/${reservationCode}?guestEmail=${guestEmail}`);
  };

  const handleSort = (column) => {
    const newSort =
      formData.sort === `${column},asc` ? `${column},desc` : `${column},asc`;
    setFormData({ ...formData, sort: newSort });
    dispatch(searchReservations({ ...formData, sort: newSort, page, size }));
  };

  const getSortIcon = (column) => {
    if (formData.sort === `${column},asc`) return <FaSortUp />;
    if (formData.sort === `${column},desc`) return <FaSortDown />;
    return <FaSort />; // Default sort icon
  };

  return (
    <div className="container mt-4">
      <h1>{t("Prenotazioni")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-2 mb-3">
            <label className="form-label">
              {t("Codice della prenotazione")}:
            </label>
            <input
              type="text"
              name="reservation_code"
              className="form-control"
              value={formData.reservation_code}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">{t("Data di inizio")}:</label>
            <input
              type="date"
              name="from_date"
              className="form-control"
              value={formData.from_date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">{t("Data di fine")}:</label>
            <input
              type="date"
              name="to_date"
              className="form-control"
              value={formData.to_date}
              onChange={handleChange}
            />
          </div>
          {accountData?.authorities.includes("ROLE_WEB_ADMIN") && ( // Check if user has ROLE_WEB_ADMIN
            <div className="col-md-2 mb-3">
              <label className="form-label">{t("Agenzia")}:</label>
              <select
                name="agency_id"
                className="form-control"
                value={formData.agency_id}
                onChange={handleChange}
              >
                <option value="">{t("Select Agency")}</option>
                {agenzie.map((agenzia) => (
                  <option key={agenzia.id} value={agenzia.id}>
                    {agenzia.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="col-md-2 mb-3">
            <label className="form-label">{t("Email dell'ospite")}:</label>
            <input
              type="email"
              name="guest_email"
              className="form-control"
              value={formData.guest_email}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">{t("Nome del contatto")}:</label>
            <input
              type="text"
              name="contact_name"
              className="form-control"
              value={formData.contact_name}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2 mb-3">
            <label className="form-label">{t("Cognome del contatto")}:</label>
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
              {t("Cerca")}
            </button>
          </div>
        </div>
      </form>
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <HeaderTableRow>
              <TableCell onClick={() => handleSort("code")}>
                {t("Codice Prenotazione")} {getSortIcon("code")}
              </TableCell>
              <TableCell onClick={() => handleSort("dateSubmitted")}>
                {t("Data Prenotazione")} {getSortIcon("dateSubmitted")}
              </TableCell>
              <TableCell onClick={() => handleSort("finalPrice")}>
                {t("Prezzo")} {getSortIcon("finalPrice")}
              </TableCell>
              <TableCell onClick={() => handleSort("guestMail")}>
                {t("Email Contatto")} {getSortIcon("guestMail")}
              </TableCell>
              <TableCell onClick={() => handleSort("contactName")}>
                {t("Nome Contatto")} {getSortIcon("contactName")}
              </TableCell>
              <TableCell onClick={() => handleSort("contactSurname")}>
                {t("Cognome Contatto")} {getSortIcon("contactSurname")}
              </TableCell>
              <TableCell>{t("Nome Agenzia")}</TableCell>
            </HeaderTableRow>
          </TableHead>
          <TableBody>
            {status === "loading" && (
              <TableRow>
                <TableCell colSpan={7}>{t("Loading...")}</TableCell>{" "}
                {/* Updated colSpan */}
              </TableRow>
            )}
            {status === "failed" && (
              <TableRow>
                <TableCell colSpan={7}>
                  {t("Error")}: {error}
                </TableCell>{" "}
                {/* Updated colSpan */}
              </TableRow>
            )}
            {reservations.map((reservation, index) => (
              <TableRow
                key={reservation.reservationCode}
                onClick={() =>
                  handleRowClick(
                    reservation.reservationCode,
                    reservation.contact_mail
                  )
                } // Pass guest email
                style={{ cursor: "pointer" }}
                className={index % 2 === 0 ? "row-even" : "row-odd"}
              >
                <TableCell>{reservation.reservationCode}</TableCell>
                <TableCell>
                  {formatDate(reservation.dataReservation)}
                </TableCell>{" "}
                {/* Format date */}
                <TableCell>{reservation.prezzo}</TableCell>
                <TableCell>{reservation.contact_mail}</TableCell>
                <TableCell>{reservation.contact_name}</TableCell>
                <TableCell>{reservation.contact_surname}</TableCell>
                <TableCell>{reservation.name_agency}</TableCell>{" "}
                {/* Added line */}
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
          labelRowsPerPage={<div className="mt-3">{t("Page Size")}</div>}
        />
      </TableContainer>
    </div>
  );
};
