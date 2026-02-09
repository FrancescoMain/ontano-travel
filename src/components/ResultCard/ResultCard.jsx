import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import "./ResultCard.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/it"; // Import Italian locale
import "dayjs/locale/en"; // Import English locale
import { useDispatch, useSelector } from "react-redux";
import { SpinnerOnly } from "../Spinner/SpinnerOnly";
import travelmar from "../../assets/travelmar.png";
import snav from "../../assets/snav.png";
import alilauro from "../../assets/Logo-AliLauro.png";
import alilauroGruson from "../../assets/Alilauro Gruson.png";
import Nlg from "../../assets/nlg.png";
import { upsertSelected } from "../../features/viaggio/resultTratta";
import { animateScroll as scroll } from "react-scroll";
import { useFetchPriceData } from "../../_hooks/useFetchPriceData";
import { useFetchAccommodations } from "../../_hooks/useFetchAccommodations";
import {
  formatDate,
  formatTime,
  calculateDuration,
} from "../../utils/dateUtils";
import alicost from "../../assets/alicost.png";
import seremar from "../../assets/seremar.png";
import coastLines from "../../assets/coast-lines.png";
import grimaldi from "../../assets/Logo-Grimaldi-Lines.jpg";
import { AccommodationSelector } from "./AccommodationSelector";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
const gtag = window.gtag || function () {}; // Add this line

export const ResultCard = ({ data, selected, hidden, id, index }) => {
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const [accommodationsLoading, setAccommodationsLoading] = useState(false);
  const [selectedAccommodations, setSelectedAccommodations] = useState([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const language = i18n.language;
  dayjs.locale(language); // Set dayjs locale based on i18n language

  const departureDate = dayjs(data.departure).tz("Europe/Rome"); // Modify this line
  console.log(departureDate);
  const dateDep = formatDate(departureDate, language);
  const timeDep = formatTime(departureDate);
  const arrivalDate = dayjs(data.arrive).tz("Europe/Rome"); // Modify this line
  const dateArr = formatDate(arrivalDate, language);
  const timeArr = formatTime(arrivalDate);
  const { hours, minutes } = calculateDuration(departureDate, arrivalDate);

  const { adulti, bambini, etaBambini, etaAdulti, animali, bagagli } =
    useSelector((state) => state.tratte.dettagli[id]);

  const selectedExt = useSelector((state) => state.resultsTratta.selected);

  // Check if this is a Grimaldi route
  const isGrimaldi = data.company === "Grimaldi";
  const adultiNum = parseInt(adulti, 10) || 1;

  // Calculate passengers that need accommodation spots (excluding infants aged 0-2)
  const infantCount = etaBambini.filter((age) => parseInt(age, 10) <= 2).length;
  const passengersNeedingAccommodation = adultiNum + (etaBambini.length - infantCount);

  // For Grimaldi, check if all adult ages are valid
  const grimaldiAgesValid =
    etaAdulti?.length === adultiNum &&
    etaAdulti.every((age) => age !== "" && parseInt(age, 10) >= 12);

  // Skip fetch for Grimaldi if ages are not valid
  const skipFetch = isGrimaldi && !grimaldiAgesValid;

  const onClick = () => {
    // For Grimaldi, don't allow selection until ages are entered
    if (isGrimaldi && !grimaldiAgesValid) {
      return;
    }
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
      etaAdulti: etaAdulti,
      accommodations: selectedAccommodations,
    };
    dispatch(upsertSelected(dataToDispatch));
    const element = document.getElementById("result-ritorno");

    gtag("event", "add_to_cart", {
      currency: "EUR",
      value: priceData.price,
      items: [
        {
          item_name: `${data.fromPort} - ${data.fromTo}`,
          item_id: `${data.fromPort}_${data.fromTo}`,
          price: priceData.price,
          quantity: 1,
        },
      ],
    });

    if (element) {
      setTimeout(() => {
        scroll.scrollTo(element.offsetTop, {
          duration: 500,
          smooth: true,
        });
      }, 500);
    }
  };

  useFetchPriceData({
    data,
    adulti,
    etaBambini,
    etaAdulti,
    animali,
    bagagli,
    accommodations: selectedAccommodations,
    setLoading,
    setPriceData,
    skipFetch,
  });

  useFetchAccommodations({
    searchResultId: data.result_id,
    isGrimaldi,
    setLoading: setAccommodationsLoading,
    setAccommodations,
  });

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
          etaAdulti: etaAdulti,
          accommodations: selectedAccommodations,
        })
      );
    }
  }, [priceData, selectedAccommodations]);

  return (
    <div
      className={` card-container ${selected ? "selected" : ""} ${
        !hidden ? "my-4 padding " : "hidden"
      } box-result bg-ice-white rounded-2x mt-md-0 collapsable`}
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
                {data.company === "Alicost" && (
                  <img className="img-logo" src={alicost} alt="Alicost" />
                )}
                {data.company === "Nlg" && (
                  <img className="img-logo" src={Nlg} alt="Nlg" />
                )}
                {data.company === "Seremar" && (
                  <img className="img-logo" src={seremar} alt="Seremar" />
                )}
                {data.company === "Coast Lines" && (
                  <img
                    className="img-logo coast-lines"
                    src={coastLines}
                    alt="Coast Lines"
                  />
                )}
                {data.company === "Alilauro Gruson" && (
                  <img
                    className="img-logo"
                    src={alilauroGruson}
                    alt="Alilauro Gruson"
                  />
                )}
                {data.company === "Grimaldi" && (
                  <img
                    className="img-logo"
                    src={grimaldi}
                    alt="Grimaldi"
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
            <div className="col fs-2">
              {isGrimaldi && !grimaldiAgesValid ? (
                <span className="text-muted fs-6">
                  {t("Inserisci età adulti")}
                </span>
              ) : loading ? (
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
      {isGrimaldi && (
        <AccommodationSelector
          accommodations={accommodations}
          selectedAccommodations={selectedAccommodations}
          onSelectionChange={setSelectedAccommodations}
          totalPassengers={passengersNeedingAccommodation}
          loading={accommodationsLoading}
        />
      )}
    </div>
  );
};

// Se necessario, aggiungi una logica per mostrare un loader specifico nel ResultCard
