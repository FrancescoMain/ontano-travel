import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDettaglioAgenzia } from "../features/ricercaAgenzia/dettaglioAgenziaSlice";

export const DashboardAgenzia = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.dettaglioAgenzia); // stato dettagli agenzia
  const uniqueCode = data?.uniqueCode; //codice univoco per l'agenzia
  const basePath =
    process.env.REACT_APP_ENV === "production"
      ? `https://lookerstudio.google.com/embed/reporting/e6da68f4-d055-422f-a97f-4229d716af11/page/7LOFE?params={"filtro_xyz": "${uniqueCode}"}`
      : `https://lookerstudio.google.com/embed/reporting/c7108c0f-746f-4b30-bbf4-69049a55cc99/page/7LOFE?params={"filtro_xyz": "${uniqueCode}"}`;
  React.useEffect(() => {
    dispatch(fetchDettaglioAgenzia());
  }, [dispatch]);

  return (
    <div style={{ width: "100vw", height: "80vh" }}>
      <iframe
        width="100%"
        height="100%"
        src={basePath}
        frameborder="0"
        style={{ border: 0 }}
        allowfullscreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      ></iframe>
    </div>
  );
};
