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

const AdminEstrattoConto = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.estrattoConto);
  const { loadingIds } = useSelector((state) => state.spinner);
  const [toApprove, setToApprove] = useState('');

  useEffect(() => {
    dispatch(fetchEstrattoConto({ toApprove }));
  }, [dispatch, toApprove]);

  const handleApprove = async (id) => {
    await dispatch(approveEstrattoConto(id));
    dispatch(fetchEstrattoConto({ toApprove }));
  };

  const handleDownload = (id) => {
    dispatch(downloadEstrattoConto(id));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center g-2">
        <div className="col mt-3">
          <h1>Visualizza Estratto Conto</h1>
          <div className="mb-3 d-flex">
            <select
              value={toApprove}
              onChange={(e) => setToApprove(e.target.value)}
              className="form-select me-2"
            >
              <option value="">Tutti</option>
              <option value="true">Da approvare</option>
              <option value="false">Approvati</option>
            </select>
          </div>
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
                        {!item.approved && (
                          <button onClick={() => handleApprove(item.id)} className="btn btn-success me-2" disabled={loadingIds.includes(item.id)}>
                            <FaCheck />
                          </button>
                        )}
                        <button onClick={() => handleDownload(item.id)} className="btn btn-primary" disabled={loadingIds.includes(item.id)}>
                          <FaDownload />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEstrattoConto;
