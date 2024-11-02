import React from "react";
import { IoMdPeople } from "react-icons/io";
import { MdLuggage } from "react-icons/md";
import { FaChild, FaDog, FaBaby } from "react-icons/fa";

export const CheckoutTariffe = ({ tariffa, company }) => {
  if (tariffa.category_code === "PSG") {
    // Display the grouped passengers
    return (
      <div>
        <div className="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
          <div className="col-8 d-flex align-items-center gap-2">
            <span>
              {" "}
              <IoMdPeople />
            </span>
            <span>{tariffa.description}</span>
          </div>
          <span className="col-4 text-end">{tariffa.price.priceFormatted}</span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="row bg-aliceblue d-flex justify-content-between align-items-center border-top border-bottom">
          <div className="col-8 d-flex align-items-center gap-2">
            <span>
              {tariffa.category_code === "ADU" && <IoMdPeople />}
              {tariffa.category_code === "CHD" && <FaChild />}
              {tariffa.category_code === "ANI" && <FaDog />}
              {tariffa.category_code === "LUG" && <MdLuggage />}
              {tariffa.category_code === "INF" && <FaBaby />}
            </span>
            <span>
              {tariffa.qty} {tariffa.category_code === "ADU" && "Adulti"}
              {tariffa.category_code === "CHD" && "Bambini"}
              {tariffa.category_code === "ANI" && "Animali"}
              {tariffa.category_code === "LUG" && "Bagagli"}
              {tariffa.category_code === "INF" && "Neonati"}
            </span>
          </div>
          <span className="col-4 text-end">{tariffa.price.priceFormatted}</span>
        </div>
      </div>
    );
  }
};
