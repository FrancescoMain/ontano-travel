import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEstrattoConto,
  downloadEstrattoConto,
} from "../features/estrattoConto/estrattoContoSlice";
import { FaDownload, FaSortUp, FaSortDown, FaSort } from "react-icons/fa"; // Import sorting icons
import { CircularProgress } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles

const AgencyEstrattoConto = () => {
  const HeaderTableRow = styled(TableRow)({
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    "& .MuiTableCell-root": {
      fontSize: "0.775rem", // Reduce font size
    },
  });
  const { t } = useTranslation(); // Initialize useTranslation
  const dispatch = useDispatch();
  const { data, status, error, totalCount } = useSelector(
    (state) => state.estrattoConto
  );
  const { loadingIds } = useSelector((state) => state.spinner);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [sort, setSort] = useState(""); // Default sort is an empty string

  useEffect(() => {
    dispatch(fetchEstrattoConto({ to_approve: "", page, size, sort }));
  }, [dispatch, page, size, sort]);

  const handleDownload = (id) => {
    dispatch(downloadEstrattoConto(id));
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSizeChange = (event) => {
    setSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (column) => {
    const newSort =
      sort === `${column},asc` ? `${column},desc` : `${column},asc`;
    setSort(newSort);
  };

  const getSortIcon = (column) => {
    if (sort === `${column},asc`) return <FaSortUp />;
    if (sort === `${column},desc`) return <FaSortDown />;
    return <FaSort />; // Default sort icon
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center g-2">
        <div className="col mt-3">
          <h1>{t("Agency Estratto Conto")}</h1>
          {status === "loading" && <p>{t("Loading...")}</p>}
          {status === "failed" && (
            <p>
              {t("Error")}: {error}
            </p>
          )}
          {status === "succeeded" && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <HeaderTableRow>
                    <TableCell onClick={() => handleSort("month")}>
                      {t("Month")} {getSortIcon("month")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("approvalDate")}>
                      {t("Approval Date")} {getSortIcon("approvalDate")}
                    </TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                  </HeaderTableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={index % 2 === 0 ? "row-even" : "row-odd"}
                    >
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{formatDate(item.approvalDate)}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDownload(item.id)}
                          className="btn btn-primary"
                          disabled={loadingIds.includes(item.id)}
                        >
                          {loadingIds.includes(item.id) ? (
                            <CircularProgress size={20} />
                          ) : (
                            <FaDownload />
                          )}
                        </button>
                      </TableCell>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyEstrattoConto;
