import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAgenzie,
  setPage,
  setSize,
} from "../features/ricercaAgenzia/ricercaAgenziaSlice";
import { useNavigate } from "react-router-dom";

const useAgenziaTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const agenzie = useSelector((state) => state.ricercaAgenzia.agenzie);
  const status = useSelector((state) => state.ricercaAgenzia.status);
  const error = useSelector((state) => state.ricercaAgenzia.error);
  const totalCount = useSelector((state) => state.ricercaAgenzia.totalCount);
  const page = useSelector((state) => state.ricercaAgenzia.page);
  const size = useSelector((state) => state.ricercaAgenzia.size);
  const loading = useSelector((state) => state.spinner.loading);

  useEffect(() => {
    dispatch(fetchAgenzie({ page, size }));
  }, [dispatch, page, size]);

  const handleRowClick = (row) => {
    navigate(`/agenzia/${row.id}`);
  };

  const handlePageChange = (event, newPage) => {
    dispatch(setPage(newPage));
  };

  const handleSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setSize(newSize));
    dispatch(setPage(0)); // Reset to first page when page size changes
    dispatch(fetchAgenzie({ page: 0, size: newSize })); // Fetch data with updated size
  };

  return {
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
  };
};

export default useAgenziaTable;
