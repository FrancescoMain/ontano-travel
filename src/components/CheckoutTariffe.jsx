import React from "react";
import { useTranslation } from "react-i18next";
import { IoMdPeople } from "react-icons/io";
import { MdLuggage, MdHelpOutline, MdDirectionsBike } from "react-icons/md";
import {
  FaChild,
  FaDog,
  FaBaby,
  FaCar,
  FaMotorcycle,
  FaShuttleVan,
  FaBus,
  FaTrailer,
  FaBed,
} from "react-icons/fa";

// Mapping categoryCode -> icon
const CATEGORY_ICONS = {
  // Passeggeri
  PSG: <IoMdPeople />,
  ADU: <IoMdPeople />,
  SEN: <IoMdPeople />,
  YUG: <IoMdPeople />,
  CHD: <FaChild />,
  BBY: <FaBaby />,
  INF: <FaBaby />,
  ANI: <FaDog />,
  LUG: <MdLuggage />,
  // Veicoli
  VEH: <FaCar />,
  CAR: <FaCar />,
  VEI: <FaShuttleVan />,
  CMPMINIBUS: <FaBus />,
  MCY: <FaMotorcycle />,
  BCY: <MdDirectionsBike />,
  TRL: <FaTrailer />,
  // Sistemazioni
  DS: <FaBed />,
  A2: <FaBed />,
  A4: <FaBed />,
  A4D: <FaBed />,
  AB4: <FaBed />,
  L2: <FaBed />,
};

// Mapping categoryCode -> translation key (Italian)
const CATEGORY_LABELS = {
  // Passeggeri
  ADU: "Adulti",
  SEN: "Senior",
  YUG: "Giovani",
  CHD: "Bambini",
  BBY: "Neonati",
  INF: "Neonati",
  ANI: "Animali",
  LUG: "Bagagli",
  // Veicoli
  VEH: "Veicoli",
  CAR: "Automobile",
  VEI: "Furgone",
  CMPMINIBUS: "Camper/Minibus",
  MCY: "Moto/Scooter",
  BCY: "Bicicletta/Surf",
  TRL: "Rimorchio",
  // Sistemazioni
  DS: "Passaggio Ponte",
  A2: "Cabina 2 posti",
  A4: "Cabina 4 posti",
  A4D: "Cabina 4 posti disabili",
  AB4: "Cabina 4 posti con bagno",
  L2: "Letto 2 posti",
};

export const CheckoutTariffe = ({ tariffa, company }) => {
  const { t } = useTranslation();
  const code = tariffa.category_code;
  const icon = CATEGORY_ICONS[code] || <MdHelpOutline />;
  const labelKey = CATEGORY_LABELS[code];
  const label = labelKey ? t(labelKey) : code; // Fallback: mostra il categoryCode

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
