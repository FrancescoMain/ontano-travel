import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const basePath =
  process.env.REACT_APP_ENV === "production"
    ? "https://lookerstudio.google.com/embed/reporting/7a728282-7c83-4914-90b2-44af92ede8a5/page/7LOFE"
    : "https://lookerstudio.google.com/embed/reporting/d2a380de-7276-40aa-b355-6c9d003b7507/page/7LOFE";
export const Dashboard = () => {
  const account = useSelector((state) => state.account.data);
  const navigate = useNavigate();

  useEffect(() => {
    if (!account || !account.authorities.includes("ROLE_WEB_ADMIN")) {
      navigate("/");
    }
  }, [account, navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "92%",
        position: "absolute",
        top: 60,
        left: 0,
      }}
    >
      {/* ...Dashboard content... */}
      <iframe
        width="100%"
        height="100%"
        src={basePath}
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};
