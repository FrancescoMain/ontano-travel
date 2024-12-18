import React from "react";
import "./Footer.css";
import { BsTelephoneFill } from "react-icons/bs";
import { IoLogoWhatsapp } from "react-icons/io";

export const Footer = () => {
  return (
    <footer>
      <div
        className="d-flex justify-content-center flex-column  align-items-center"
        style={{
          textAlign: "center",
          padding: "1rem",
          color: "black",
          background: "aliceblue",
        }}
      >
        <div className="d-flex col text-lg-start gap-md-5 align-items-center align-items-center flex-column flex-md-row">
          <p>
            <strong>
              <BsTelephoneFill />
            </strong>
            <a
              style={{
                color: "black",
              }}
              className="ms-2"
              href="tel:+390815800340"
            >
              +39 081.580 03 40
            </a>
          </p>
          <p>
            <strong>
              <IoLogoWhatsapp />
            </strong>
            <a
              style={{
                color: "black",
              }}
              className="ms-2"
              href="https://api.whatsapp.com/send?phone=3311830265"
            >
              +39 331.183 02 65
            </a>
          </p>
          <p>
            <strong>Email: </strong>
            <a
              style={{
                color: "black",
              }}
              href="mailto:info@quickferries.com"
            >
              info@quickferries.com
            </a>
          </p>
        </div>
        Copyright © 2024 QuickFerries By ONTANO SRL Largo Angioino Snc, 80133
        Naples (NA) Italy - VAT number 06723760630
      </div>
    </footer>
  );
};
