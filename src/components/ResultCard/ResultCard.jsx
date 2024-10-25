import React, { useEffect, useState } from "react";
import "./ResultCard.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useDispatch, useSelector } from "react-redux";
import { SpinnerOnly } from "../Spinner/SpinnerOnly";
import travelmar from "../../assets/travelmar.png";
import snav from "../../assets/snav.png";
import alilauro from "../../assets/Logo-AliLauro.png";
import alilauroGruson from "../../assets/Alilauro Gruson.png";
import { upsertSelected } from "../../features/viaggio/resultTratta";
import { animateScroll as scroll } from "react-scroll";

dayjs.extend(customParseFormat);

export const ResultCard = ({ data, selected, hidden, id, index }) => {
  const [loading, setLoading] = useState(false);

  const [priceData, setPriceData] = useState(null);
  const dispatch = useDispatch();

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

  const { adulti, bambini, etaBambini, animali, bagagli } = useSelector(
    (state) => state.tratte.dettagli[id]
  );

  const selectedExt = useSelector((state) => state.resultsTratta.selected);

  const onClick = () => {
    const dataToDispatch = {
      id: id,
      prezzo: priceData.price,
      idSelected: index,
      data: data,
      animali: animali,
      bagagli: bagagli,
      adulti: adulti,
      bambini: bambini,
      etaBambini: etaBambini,
    };
    dispatch(upsertSelected(dataToDispatch));
    const element = document.getElementById("result-ritorno");

    if (element) {
      // Aggiungi un timeout per ritardare l'esecuzione dello scroll
      setTimeout(() => {
        scroll.scrollTo(element.offsetTop, {
          duration: 500,
          smooth: true,
        });
      }, 500); // Ritarda di 500 millisecondi (puoi regolare questo valore)
    }
  };

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
          `http://ec2-13-51-37-99.eu-north-1.compute.amazonaws.com/api/booking/price/searchresult?search_result_id=${data.result_id}&animals=${animali}&luggages=${bagagli}&${passengersAgeParams}`
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
    if (selectedExt[id]?.idSelected === index) {
      const existingData = selectedExt[id] || {};
      dispatch(
        upsertSelected({
          ...existingData,
          id,
          prezzo: priceData?.price,
          idSelected: index,
          data,
        })
      );
    }
  }, [priceData]);

  return (
    <div
      className={` card-container ${selected ? "selected" : ""} ${
        !hidden ? "" : "hidden"
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
          <div className="prezzo text-center d-flex flex-column align-items-center row  p-2 gx-1 gx-lg-3  justify-content-center fs-1 fw-bold  ">
            <div className="col">
              {loading ? (
                <SpinnerOnly active={loading} />
              ) : priceData?.priceFormatted ? (
                priceData?.priceFormatted
              ) : (
                "-"
              )}
            </div>
            <div className="fs-6 fw-light lh-sm">
              {parseInt(adulti, 10) + etaBambini.length + " Passeggeri"}
            </div>
            {animali > 0 && (
              <div className="fs-6 fw-light lh-sm">{animali + " Animali"}</div>
            )}
            {bagagli > 0 && (
              <div className="fs-6 fw-light lh-sm">{bagagli + " Bagagli"}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
