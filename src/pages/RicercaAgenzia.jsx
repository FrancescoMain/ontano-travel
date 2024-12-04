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
import { FaSortUp, FaSortDown } from "react-icons/fa"; // Import sorting icons

export const RicercaAgenzia = () => {
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
    return null;
  };

  const handleSort = (column) => {
    const newSort = sort === `${column},asc` ? `${column},desc` : `${column},asc`;
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
                <TableRow>
                  <TableCell onClick={() => handleSort("name")}>
                    {t("Name")} {getSortIcon("name")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("abilitaPagamentoEstrattoConto")}>
                    {t("Abilita Pagamento Estratto Conto")} {getSortIcon("abilitaPagamentoEstrattoConto")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("abilitaPagamentoPayByLink")}>
                    {t("Abilita Pagamento Pay By Link")} {getSortIcon("abilitaPagamentoPayByLink")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("attivo")}>
                    {t("Attivo")} {getSortIcon("attivo")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("percentualCommissione")}>
                    {t("Percentual Commissione")} {getSortIcon("percentualCommissione")}
                  </TableCell>
                  <TableCell onClick={() => handleSort("dirittiDiPrenotazione")}>
                    {t("Diritti Di Prenotazione")} {getSortIcon("dirittiDiPrenotazione")}
                  </TableCell>
                </TableRow>
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
                {agenzie.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row)}
                    style={{ cursor: "pointer" }}
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
