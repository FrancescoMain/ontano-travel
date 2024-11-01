import { useSelector } from "react-redux";
import { getToken, getUserData } from "../utils/auth";

export const useAuth = () => {
  const { loading } = useSelector((state) => state.spinner);
  const token = getToken();
  const userData = getUserData();
  const isWebUser = userData?.authorities?.includes("ROLE_WEB_USER");

  return { loading, token, isWebUser };
};
