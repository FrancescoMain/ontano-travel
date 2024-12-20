import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useTranslation } from "react-i18next";
import useAgenziaTable from "../_hooks/useAgenziaTable";
import { FaSortUp, FaSortDown, FaSort } from "react-icons/fa"; // Import sorting icons
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles

export const RicercaAgenzia = () => {
  const HeaderTableRow = styled(TableRow)({
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    "& .MuiTableCell-root": {
      fontSize: "0.775rem", // Reduce font size
    },
  });
  const { t } = useTranslation();
  const [searchName, setSearchName] = useState("");
  const [sort, setSort] = useState(""); // Add sort state
  const {
    agenzie,
    status,
    error,
    totalCount,
    page,
    size,
    loading,
    handleRowClick,
    handlePageChange,
    handleSizeChange,
    handleSearch,
  } = useAgenziaTable();

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleSearchClick = () => {
    handleSearch(searchName, sort); // Pass sort parameter
  };

  const getSortIcon = (column) => {
    if (sort === `${column},asc`) return <FaSortUp />;
    if (sort === `${column},desc`) return <FaSortDown />;
    return <FaSort />; // Default sort icon
  };

  const handleSort = (column) => {
    const newSort =
      sort === `${column},asc` ? `${column},desc` : `${column},asc`;
    setSort(newSort);
    handleSearch(searchName, newSort);
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center g-2">
        <div className="col mt-3">
          <h1>{t("Ricerca Agenzia")}</h1>
          <div className="mb-3 d-flex">
            <input
              type="text"
              value={searchName}
              onChange={handleSearchChange}
              placeholder={t("Search by name")}
              className="form-control me-2"
            />
            <button onClick={handleSearchClick} className="btn btn-primary">
              {t("Search")}
            </button>
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <HeaderTableRow>
                  <TableCell onClick={() => handleSort("name")}>
                    {t("Name")} {getSortIcon("name")}
                  </TableCell>
                  <TableCell
                    onClick={() => handleSort("enabledSubmitWithoutPayment")}
                  >
                    {t("Abilita Pagamento Estratto Conto")}{" "}
                    {getSortIcon("enabledSubmitWithoutPayment")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("enabledPaybylink")}>
                    {t("Abilita Pagamento Pay By Link")}{" "}
                    {getSortIcon("enabledPaybylink")}
                  </TableCell>
                  <TableCell>{t("Attivo")}</TableCell>
                  <TableCell>{t("Percentual Commissione")} </TableCell>
                  <TableCell>{t("Diritti Di Prenotazione")} </TableCell>
                </HeaderTableRow>
              </TableHead>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={6}>{t("Loading...")}</TableCell>
                  </TableRow>
                )}
                {status === "failed" && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {t("Error")}: {error}
                    </TableCell>
                  </TableRow>
                )}
                {agenzie.map((row, index) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: "pointer" }}
                    className={index % 2 === 0 ? "row-even" : "row-odd"}
                  >
                    <TableCell>{row.name}</TableCell>
                    <TableCell
                      style={{
                        color: row.abilitaPagamentoEstrattoConto
                          ? "green"
                          : "red",
                      }}
                    >
                      {row.abilitaPagamentoEstrattoConto ? t("Yes") : t("No")}
                    </TableCell>
                    <TableCell
                      style={{
                        color: row.abilitaPagamentoPayByLink ? "green" : "red",
                      }}
                    >
                      {row.abilitaPagamentoPayByLink ? t("Yes") : t("No")}
                    </TableCell>
                    <TableCell style={{ color: row.attivo ? "green" : "red" }}>
                      {row.attivo ? t("Yes") : t("No")}
                    </TableCell>
                    <TableCell>{row.percentualCommissione}</TableCell>
                    <TableCell>{row.dirittiDiPrenotazione}</TableCell>
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
      </div>
    </div>
  );
};
