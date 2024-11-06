import axios from "axios";
import { config } from "../config/config";

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
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    } else {
      throw error;
    }
  }
};
