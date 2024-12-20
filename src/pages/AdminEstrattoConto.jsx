import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEstrattoConto,
  approveEstrattoConto,
  downloadEstrattoConto,
} from "../features/estrattoConto/estrattoContoSlice";
import {
  FaCheck,
  FaDownload,
  FaSortUp,
  FaSortDown,
  FaSort,
} from "react-icons/fa"; // Import default sort icon
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CircularProgress } from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { fetchAgenzie } from "../features/ricercaAgenzia/ricercaAgenziaSlice"; // Import fetchAgenzie
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles

const AdminEstrattoConto = () => {
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
  const [toApprove, setToApprove] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);
  const [agencyId, setAgencyId] = useState(""); // Add state for agencyId
  const [agenzie, setAgenzie] = useState([]); // Add state for agenzie
  const [sort, setSort] = useState(""); // Default sort is an empty string

  useEffect(() => {
    dispatch(fetchAgenzie({ page: 0, size: 100 })).then((response) => {
      if (response.payload && response.payload.data) {
        setAgenzie(response.payload.data);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchEstrattoConto({ toApprove, page, size, agencyId, sort })); // Include sort in fetch
  }, [dispatch, toApprove, page, size, agencyId, sort]);

  const handleApprove = async (id) => {
    await dispatch(approveEstrattoConto(id));
    dispatch(fetchEstrattoConto({ toApprove, page, size, agencyId, sort }));
  };

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
          <h1>{t("Visualizza Estratto Conto")}</h1>
          <div className="mb-3 d-flex">
            <select
              value={toApprove}
              onChange={(e) => setToApprove(e.target.value)}
              className="form-select me-2"
            >
              <option value="">{t("Tutti")}</option>
              <option value="true">{t("Da approvare")}</option>
              <option value="false">{t("Approvati")}</option>
            </select>
            <select
              value={agencyId}
              onChange={(e) => setAgencyId(e.target.value)}
              className="form-select me-2"
            >
              <option value="">{t("Select Agency")}</option>
              {agenzie.map((agenzia) => (
                <option key={agenzia.id} value={agenzia.id}>
                  {agenzia.name}
                </option>
              ))}
            </select>
          </div>
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
                    <TableCell>{t("Name Agency")}</TableCell>
                    <TableCell onClick={() => handleSort("periodFrom")}>
                      {t("Month")} {getSortIcon("periodFrom")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("accepted")}>
                      {t("Approved")} {getSortIcon("accepted")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("dateCreated")}>
                      {t("Upload Date")} {getSortIcon("dateCreated")}
                    </TableCell>
                    <TableCell onClick={() => handleSort("dateAccepted")}>
                      {t("Approval Date")} {getSortIcon("dateAccepted")}
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
                      <TableCell>{item.nameAgency}</TableCell>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>
                        {item.approved ? t("Yes") : t("No")}
                      </TableCell>
                      <TableCell>
                        {item.uploadDate ? formatDate(item.uploadDate) : ""}
                      </TableCell>
                      <TableCell>
                        {item.approvalDate ? formatDate(item.approvalDate) : ""}
                      </TableCell>
                      <TableCell>
                        {!item.approved && (
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="btn btn-success me-2"
                            disabled={loadingIds.includes(item.id)}
                          >
                            <FaCheck />
                          </button>
                        )}
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

export default AdminEstrattoConto;
