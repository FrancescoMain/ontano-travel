import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getAuthHeader } from '../../utils/auth';
import { config } from '../../config/config';
import { startLoading, stopLoading } from '../spinner/spinnerSlice';

export const fetchEstrattoConto = createAsyncThunk(
  'estrattoConto/fetchEstrattoConto',
  async ({ toApprove, page, size }, { dispatch }) => {
    dispatch(startLoading('fetchEstrattoConto'));
    const response = await axios.get(`${config.basePath}${config.fetchEstrattoConto.route}`, {
      headers: getAuthHeader(),
      params: { toApprove, page, size },
    });
    dispatch(stopLoading('fetchEstrattoConto'));
    return {
      data: response.data,
      totalCount: parseInt(response.headers['x-total-count'], 10),
    };
  }
);

export const approveEstrattoConto = createAsyncThunk(
  'estrattoConto/approveEstrattoConto',
  async (id, { dispatch }) => {
    dispatch(startLoading(id));
    const response = await axios.post(`${config.basePath}${config.approveEstrattoConto.route}/${id}/approve`, {}, {
      headers: getAuthHeader(),
    });
    dispatch(stopLoading(id));
    return response.data;
  }
);

export const downloadEstrattoConto = createAsyncThunk(
  'estrattoConto/downloadEstrattoConto',
  async (id, { dispatch }) => {
    dispatch(startLoading(id));
    const response = await axios.get(`${config.basePath}/api/booking/estrattoconto/get?id=${id}`, {
      headers: {
        ...getAuthHeader(),
        'Accept': 'application/octet-stream',
      },
      responseType: 'blob',
      withCredentials: true,
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '')
      : `estratto_conto_${id}.pdf`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    dispatch(stopLoading(id));
  }
);

const estrattoContoSlice = createSlice({
  name: 'estrattoConto',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
    page: 0,
    size: 20,
    totalCount: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEstrattoConto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEstrattoConto.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload.data;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchEstrattoConto.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(approveEstrattoConto.fulfilled, (state, action) => {
        const index = state.data.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index].approved = true;
        }
      });
  },
});

export default estrattoContoSlice.reducer;
