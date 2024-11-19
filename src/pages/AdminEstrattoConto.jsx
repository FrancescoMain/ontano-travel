import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchEstrattoConto } from '../features/estrattoConto/estrattoContoSlice';

const AdminEstrattoConto = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchEstrattoConto());
  }, [dispatch]);

  return (
    <div>
      <h1>Visualizza Estratto Conto</h1>
      {/* Add your content here */}
    </div>
  );
};

export default AdminEstrattoConto;
