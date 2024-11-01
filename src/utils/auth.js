export const getUserData = () => {
  return (
    JSON.parse(localStorage.getItem("account_data")) ||
    JSON.parse(sessionStorage.getItem("account_data"))
  );
};

export const getToken = () => {
  return localStorage.getItem("id_token") || sessionStorage.getItem("id_token");
};

export const handleLogout = () => {
  localStorage.removeItem("id_token");
  sessionStorage.removeItem("id_token");
  window.location.href = "/";
};

export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
