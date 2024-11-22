import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEstrattoConto, approveEstrattoConto, downloadEstrattoConto } from '../features/estrattoConto/estrattoContoSlice';
import { FaCheck, FaDownload } from 'react-icons/fa';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CircularProgress } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { useTranslation } from "react-i18next"; // Import useTranslation

const AdminEstrattoConto = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const dispatch = useDispatch();
  const { data, status, error, totalCount } = useSelector((state) => state.estrattoConto);
  const { loadingIds } = useSelector((state) => state.spinner);
  const [toApprove, setToApprove] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(fetchEstrattoConto({ toApprove, page, size }));
  }, [dispatch, toApprove, page, size]);

  const handleApprove = async (id) => {
    await dispatch(approveEstrattoConto(id));
    dispatch(fetchEstrattoConto({ toApprove, page, size }));
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

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
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
          </div>
          {status === 'loading' && <p>{t("Loading...")}</p>}
          {status === 'failed' && <p>{t("Error")}: {error}</p>}
          {status === 'succeeded' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("Name Agency")}</TableCell>
                    <TableCell>{t("Month")}</TableCell>
                    <TableCell>{t("Approved")}</TableCell>
                    <TableCell>{t("Upload Date")}</TableCell>
                    <TableCell>{t("Approval Date")}</TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nameAgency}</TableCell>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{item.approved ? t("Yes") : t("No")}</TableCell>
                      <TableCell>{formatDate(item.uploadDate)}</TableCell>
                      <TableCell>{formatDate(item.approvalDate)}</TableCell>
                      <TableCell>
                        {!item.approved && (
                          <button onClick={() => handleApprove(item.id)} className="btn btn-success me-2" disabled={loadingIds.includes(item.id)}>
                            <FaCheck />
                          </button>
                        )}
                        <button onClick={() => handleDownload(item.id)} className="btn btn-primary" disabled={loadingIds.includes(item.id)}>
                          {loadingIds.includes(item.id) ? <CircularProgress size={20} /> : <FaDownload />}
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
