import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export const Success = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="alert alert-success text-center" role="alert">
          <h1>La prenotazione è avvenuta con successo!</h1>
          <p>Riceverai una email a breve.</p>
        </div>
      </div>
      <footer className="text-center mt-5">
        <p>© 2024 Ontano Travel. Tutti i diritti riservati.</p>
      </footer>
    </>
  );
};
