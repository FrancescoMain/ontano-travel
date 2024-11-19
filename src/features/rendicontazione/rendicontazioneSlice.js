import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { config } from '../../config/config';
import { startLoading, stopLoading } from '../spinner/spinnerSlice';

export const downloadRendicontazione = createAsyncThunk(
  'rendicontazione/downloadRendicontazione',
  async ({ fromDate, toDate }, { dispatch }) => {
    dispatch(startLoading('downloadRendicontazione'));
    const response = await axios.get(`${config.basePath}/api/booking/rendicontazione/download`, {
      params: { from: fromDate, to: toDate },
      headers: {
        'Accept': 'application/octet-stream',
      },
      responseType: 'blob',
      withCredentials: true,
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].split(';')[0].trim().replace(/"/g, '')
      : `rendicontazione_${fromDate}_to_${toDate}.xlsx`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    dispatch(stopLoading('downloadRendicontazione'));
  }
);

const rendicontazioneSlice = createSlice({
  name: 'rendicontazione',
  initialState: {
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadRendicontazione.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(downloadRendicontazione.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(downloadRendicontazione.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default rendicontazioneSlice.reducer;
