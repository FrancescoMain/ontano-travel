import axios from "axios";
import { config } from "../config/config";
import { getAuthHeader, handleLogout } from "../utils/auth"; // Import handleLogout

export const fetchReservation = async (bookingCode, email) => {
  try {
    const response = await axios.get(
      `${config.basePath}${config.fetchReservation.route.replace(
        ":bookingCode",
        bookingCode
      )}`,
      {
        params: { email: decodeURIComponent(email) },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw error;
    }
  }
};

export const fetchReservationByCode = async (reservationCode) => {
  try {
    const response = await axios.get(
      `${config.basePath}${config.fetchReservationLogged.route.replace(
        ":bookingCode",
        reservationCode
      )}`,
      {
        headers: {
          ...getAuthHeader(),
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw error;
    }
  }
};

export const sendRefundRequest = async (routeId, body) => {
  try {
    const response = await axios.post(
      `${config.basePath}/api/booking/ticket/${routeId}/cancel`,
      body,
      {
        headers: {
          ...getAuthHeader(),
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      handleLogout();
      window.location.href = "/login"; // Redirect to login
    }
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw error;
    }
  }
};
