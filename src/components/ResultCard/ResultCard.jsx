import React, { useEffect, useState } from "react";
import "./ResultCard.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Typography } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../features/spinner/spinnerSlice";
import {
  setBigliettoAndata,
  setBigliettoRitorno,
} from "../../features/viaggio/viaggioFormSlice";
import { SpinnerOnly } from "../Spinner/SpinnerOnly";
import travelmar from "../../assets/travelmar.png";
import snav from "../../assets/snav.png";
import snavGes from "../../assets/Snav Gescab.jpg";
import alilauro from "../../assets/Logo-AliLauro.png";
import alilauroGruson from "../../assets/Alilauro Gruson.png";

dayjs.extend(customParseFormat);

export const ResultCard = ({
  data,
  selected,
  onClick,
  andata,
  ritorno,
  hidden,
}) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    animali,
    bagagli,
    adulti,
    etaBambini,
    trattaAndata,
    trattaRitorno,
    dataAndata,
    dataRitorno,
  } = useSelector((state) => state.viaggioForm);

  const dispatch = useDispatch();
  console.log(hidden);

  const departureDate = dayjs(data.departure);
  const dateDep = departureDate.format("DD MMM YYYY");
  const timeDep = departureDate.format("HH:mm");
  const arrivalDate = dayjs(data.arrive);
  const dateArr = arrivalDate.format("DD MMM YYYY");
  const timeArr = arrivalDate.format("HH:mm");
  const diffInMilliseconds = arrivalDate.diff(departureDate);

  // Converti la differenza in ore e minuti
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  useEffect(() => {
    // Esegui la chiamata API
    const fetchPriceData = async () => {
      setLoading(true);

      // Costruisci la query string per passengers_age
      const passengersAgeParams = [
        ...Array.from({ length: adulti }, () => 18), // Aggiungi 18 per ogni adulto
        ...etaBambini, // Aggiungi l'età di ogni bambino
      ]
        .map((age) => `passengers_age=${age}`)
        .join("&");

      try {
        const response = await fetch(
          `https://bookingferries-5cc3853ba728.herokuapp.com/api/booking/price/searchresult?search_result_id=${data.result_id}&animals=${animali}&luggages=${bagagli}&${passengersAgeParams}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setPriceData(result);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [data, adulti, etaBambini, animali, bagagli]);

  useEffect(() => {
    const combinedData = { ...data, priceData };

    if (selected && andata) {
      dispatch(setBigliettoAndata(combinedData));
    }
    if (selected && ritorno) {
      dispatch(setBigliettoRitorno(combinedData));
    }
  }, [selected, priceData]);

  return (
    // <div
    //   className={`card-container ${selected ? "selected" : ""} ${
    //     hidden ? "hidden" : ""
    //   }`}
    //   onClick={onClick}
    // >
    //   <div className="card-container__left">
    //     <Typography
    //       color="neutral"
    //       level="body-md"
    //       noWrap={false}
    //       variant="plain"
    //     >
    //       {dateDep}
    //     </Typography>
    //     <Typography color="primary" level="h4" noWrap={false} variant="plain">
    //       {timeDep}
    //     </Typography>
    //     <Typography color="neutral" level="h4" noWrap={false} variant="plain">
    //       {data.fromPort}
    //     </Typography>
    //   </div>
    //   <div className="card-container__center">
    //     {data.company === "Travelmar" && (
    //       <img className="img-logo" src={travelmar} alt="Travelmar" />
    //     )}
    //     {data.company === "Snav" && (
    //       <img className="img-logo" src={snav} alt="Snav" />
    //     )}
    //     {data.company === "Snav Gescab" && (
    //       <img className="img-logo" src={snav} alt="Snav Gescab" />
    //     )}
    //     {data.company === "Alilauro" && (
    //       <img className="img-logo" src={alilauro} alt="Alilauro" />
    //     )}
    //     {data.company === "Alilauro Gruson" && (
    //       <img
    //         className="img-logo"
    //         src={alilauroGruson}
    //         alt="Alilauro Gruson"
    //       />
    //     )}

    //     <Typography
    //       color="neutral"
    //       level="body-sm"
    //       noWrap={false}
    //       variant="plain"
    //       className="card-container__center__text"
    //     >
    //       --------
    //     </Typography>
    //     <Typography
    //       color="neutral"
    //       level="body-md"
    //       noWrap={false}
    //       variant="plain"
    //       className="card-container__center__text"
    //     >
    //       {hours}h {minutes}m
    //     </Typography>
    //   </div>
    //   <div className="card-container__right">
    //     <Typography
    //       color="neutral"
    //       level="body-md"
    //       noWrap={false}
    //       variant="plain"
    //     >
    //       {dateArr}
    //     </Typography>
    //     <Typography color="primary" level="h4" noWrap={false} variant="plain">
    //       {timeArr}
    //     </Typography>
    //     <Typography color="neutral" level="h4" noWrap={false} variant="plain">
    //       {data.fromTo}
    //     </Typography>
    //   </div>
    //   <div className="card-container__right">
    //     <Typography color="primary" level="h2" noWrap={false} variant="plain">
    //       {loading ? (
    //         <SpinnerOnly active={loading} />
    //       ) : priceData?.priceFormatted ? (
    //         priceData?.priceFormatted
    //       ) : (
    //         "-"
    //       )}
    //     </Typography>
    //   </div>
    // </div>
    <div
      className={`card-container ${selected ? "selected" : ""} ${
        hidden ? "hidden" : ""
      } box-result bg-ice-white rounded-2x mt-md-0 my-4 collapsable`}
      onClick={onClick}
    >
      <div className="row align-items-center grid-result">
        <div className="col-lg-8">
          <div className="align-items-start gx-1 gx-lg-3 px-md-3 pt-2 pb-1 row row-cols-3">
            <div className="col text-start">
              <div className="giorno text-uppercase fw-light lh-sm small">
                {dateDep}
              </div>
              <div className="ora fs-2 fs-lg-1  lh-sm">{timeDep}</div>
              <div class="porto h5  lh-sm">{data.fromPort}</div>
            </div>
            <div className="col text-center px-0">
              <div className="linea-logo">
                {data.company === "Travelmar" && (
                  <img className="img-logo" src={travelmar} alt="Travelmar" />
                )}
                {data.company === "Snav" && (
                  <img className="img-logo" src={snav} alt="Snav" />
                )}
                {data.company === "Snav Gescab" && (
                  <img className="img-logo" src={snav} alt="Snav Gescab" />
                )}
                {data.company === "Alilauro" && (
                  <img className="img-logo" src={alilauro} alt="Alilauro" />
                )}
                {data.company === "Alilauro Gruson" && (
                  <img
                    className="img-logo"
                    src={alilauroGruson}
                    alt="Alilauro Gruson"
                  />
                )}
              </div>
              <div className="divider-points">............</div>
              <div className="durata">
                {hours}h {minutes}m
              </div>
            </div>

            <div className="col text-end">
              <div className="giorno text-uppercase fw-light lh-sm small">
                {dateArr}
              </div>
              <div className="ora fs-2 fs-lg-1  lh-sm"> {timeArr}</div>
              <div className="porto h5  lh-sm"> {data.fromTo}</div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 no-pet-mode ">
          <div className="prezzo align-items-center row row-cols-2 row-cols-md-3 p-2 gx-1 gx-lg-3 flex-row-reverse justify-content-center fs-1 fw-bold  ">
            {loading ? (
              <SpinnerOnly active={loading} />
            ) : priceData?.priceFormatted ? (
              priceData?.priceFormatted
            ) : (
              "-"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};