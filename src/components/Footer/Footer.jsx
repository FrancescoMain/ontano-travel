import React from "react";
import "./Footer.css";
import { BsTelephoneFill } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";

export const Footer = () => {
  return (
    <footer>
      <div
        className="row p-4 justify-content-lg-around justify-content-center flex-direction-column flex-direction-lg-row "
        style={{
          padding: "1rem",
          background: "aliceblue",
        }}
      >
        <div className="col-md-1 d-none d-lg-block md-lg-0">
          <img
            src="https://www.quickferries.com/wp-content/uploads/2018/12/Logo-QuickFerries.png"
            alt="QuickFerries"
          />
        </div>
        <div className="d-flex col-lg-3 text-lg-start align-items-lg-start align-items-center flex-column">
          <h4>Contatti</h4>
          <p>
            <strong>
              <BsTelephoneFill />
            </strong>
            <a className="ms-2" href="tel:+390815800340">
              +39 081.580 03 40
            </a>
          </p>
          <p>
            <strong>
              <IoLogoWhatsapp />
            </strong>
            <a
              className="ms-2"
              href="https://api.whatsapp.com/send?phone=3311830265"
            >
              +39 331.183 02 65
            </a>
          </p>
          <p>
            <strong>Email: </strong>
            <a href="mailto:info@quickferries.com">info@quickferries.com</a>
          </p>
        </div>
      </div>
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          color: "white",
          background: "#282154",
        }}
      >
        Copyright © 2024 QuickFerries By ONTANO SRL Largo Angioino Snc, 80133
        Naples (NA) Italy - VAT number 06723760630
      </div>
    </footer>
  );
};
