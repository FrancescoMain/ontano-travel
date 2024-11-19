import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEstrattoConto, downloadEstrattoConto } from '../features/estrattoConto/estrattoContoSlice';
import { FaDownload } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

const AgencyEstrattoConto = () => {
  const dispatch = useDispatch();
  const { data, status, error, totalCount } = useSelector((state) => state.estrattoConto);
  const { loadingIds } = useSelector((state) => state.spinner);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(fetchEstrattoConto({ toApprove: '', page, size }));
  }, [dispatch, page, size]);

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
          <h1>Agency Estratto Conto</h1>
          {status === 'loading' && <p>Loading...</p>}
          {status === 'failed' && <p>Error: {error}</p>}
          {status === 'succeeded' && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name Agency</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Approved</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Approval Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nameAgency}</TableCell>
                      <TableCell>{item.month}</TableCell>
                      <TableCell>{item.approved ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{formatDate(item.uploadDate)}</TableCell>
                      <TableCell>{formatDate(item.approvalDate)}</TableCell>
                      <TableCell>
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
                labelRowsPerPage={<div className="mt-3">Page Size</div>}
              />
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyEstrattoConto;
