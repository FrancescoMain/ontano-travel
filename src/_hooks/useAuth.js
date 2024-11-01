import { useSelector } from "react-redux";
import { getToken } from "../utils/auth";

export const useAuth = () => {
  const { loading } = useSelector((state) => state.spinner);
  const { data: userData } = useSelector((state) => state.account); // Get user data from Redux
  const token = getToken();
  const isWebUser = userData?.authorities?.includes("ROLE_WEB_USER");

  return { loading, token, isWebUser };
};
