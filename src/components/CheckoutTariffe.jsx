import React from "react";
import { IoMdPeople } from "react-icons/io";
import { MdLuggage, MdHelpOutline } from "react-icons/md";
import { FaChild, FaDog, FaBaby } from "react-icons/fa";

// Mapping categoryCode -> icon
const CATEGORY_ICONS = {
  PSG: <IoMdPeople />,
  ADU: <IoMdPeople />,
  SEN: <IoMdPeople />,
  YUG: <IoMdPeople />,
  CHD: <FaChild />,
  BBY: <FaBaby />,
  INF: <FaBaby />,
  ANI: <FaDog />,
  LUG: <MdLuggage />,
};

// Mapping categoryCode -> label
const CATEGORY_LABELS = {
  ADU: "Adulti",
  SEN: "Senior",
  YUG: "Giovani",
  CHD: "Bambini",
  BBY: "Neonati",
  INF: "Infant",
  ANI: "Animali",
  LUG: "Bagagli",
};

export const CheckoutTariffe = ({ tariffa, company }) => {
  const code = tariffa.category_code;
  const icon = CATEGORY_ICONS[code] || <MdHelpOutline />;
  const label = CATEGORY_LABELS[code] || code; // Fallback: mostra il categoryCode

  if (code === "PSG") {
    // Display the grouped passengers
    return (
      <div>
        <div className="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
          <div className="col-8 d-flex align-items-center gap-2">
            <span>{icon}</span>
            <span>{tariffa.description}</span>
          </div>
          <span className="col-4 text-end">{tariffa.price.priceFormatted}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className=" bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
          <div className="col-8 d-flex align-items-center gap-2">
            <span>{icon}</span>
            <span>
              {tariffa.qty} {label}
            </span>
          </div>
          <span className="col-4 text-end">{tariffa.price.priceFormatted}</span>
        </div>
      </div>
    );
  }
};
