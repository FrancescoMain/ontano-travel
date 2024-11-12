import React from "react";
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

export const RicercaAgenzia = () => {
  const { t } = useTranslation();
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
  } = useAgenziaTable();

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center g-2">
        <div className="col mt-3">
          <h1>{t("Ricerca Agenzia")}</h1>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("Name")}</TableCell>
                  <TableCell>{t("Abilita Pagamento Estratto Conto")}</TableCell>
                  <TableCell>{t("Abilita Pagamento Pay By Link")}</TableCell>
                  <TableCell>{t("Attivo")}</TableCell>
                  <TableCell>{t("Percentual Commissione")}</TableCell>
                  <TableCell>{t("Diritti Di Prenotazione")}</TableCell>
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
