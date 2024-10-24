import React from "react";
import {
  ViaggioDiAndataForm,
  ViaggoiDiRitornoForm,
} from "../FormViaggioComponent";
import { useResult } from "../../_hooks/useResult";
import { ResultCard } from "../ResultCard/ResultCard";
import { Button } from "@mui/joy";
import { useTranslation } from "react-i18next";

export const ResultComponent = () => {
  const {
    results,
    loadingId,
    selected,
    totalPrice,
    multitratta,
    nTratte,
    setNTratte,
  } = useResult();
  const { t } = useTranslation();
  const isHidden = (groupIndex, index) => {
    if (selected.length === 0 || selected[groupIndex]?.data.length === 0)
      return false;
    if (selected[groupIndex]?.idSelected === undefined) return false;
    return selected[groupIndex]?.idSelected !== index;
  };
  return (
    <div className="row justify-content-center">
      <div className="col col-lg-8">
        <ViaggioDiAndataForm resultMode={true} id={0} />
        <div className="mb-3"></div>
        {loadingId === 0 ? (
          <div className="row d-flex justify-content-center">
            <div
              className="spinner-border text-primary align-items-center"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            {!results[0]?.data[0] && <div> No results </div>}
            {results[0]?.data?.map((result, index) => (
              <ResultCard
                key={result.id}
                selected={selected[0]?.idSelected === index}
                data={result}
                id={0}
                index={index}
                hidden={isHidden(0, index)}
              />
            ))}
          </div>
        )}
        {!multitratta && <ViaggoiDiRitornoForm resultMode={true} id={1} />}
        <div className="mb-3"></div>
        {!multitratta && loadingId === 1 ? (
          <div className="row d-flex justify-content-center">
            <div
              className="spinner-border text-primary align-items-center"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            {!results[1]?.data[0] && !multitratta && <div> No results </div>}

            {!multitratta &&
              results[1]?.data?.map((result, index) => (
                <ResultCard
                  key={result.id}
                  selected={selected[1]?.idSelected === index}
                  data={result}
                  id={1}
                  index={index}
                  hidden={isHidden(1, index)}
                />
              ))}
          </div>
        )}
        {multitratta && (
          <div>
            {Array.from(
              { length: nTratte + 1 },
              (_, id) =>
                id !== 0 && (
                  <div>
                    <ViaggioDiAndataForm resultMode={true} id={id} />
                    <div className="mb-3"></div>
                    {loadingId === id ? (
                      <div className="row d-flex justify-content-center">
                        <div
                          className="spinner-border text-primary align-items-center"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {!results[id]?.data[0] && !multitratta && (
                          <div> No results </div>
                        )}

                        {results[id]?.data?.map((result, index) => (
                          <ResultCard
                            key={result.id}
                            selected={selected[id]?.idSelected === index}
                            data={result}
                            id={id}
                            index={index}
                            hidden={isHidden(id, index)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
            )}
            <button
              onClick={() => setNTratte(nTratte + 1)}
              type="button"
              class="ms-3 btn btn-primary"
            >
              {t("+ Aggiungi Rotta")}
            </button>
          </div>
        )}
      </div>

      <div className="marginDiv "></div>
      {selected[0].prezzo || selected[1].prezzo ? (
        <div className="to-checkout">
          <div className="to-checkout-cont">
            <div className="to-checkout-cont__left">
              <div>
                TOTALE BIGLIETTI:
                {" " + totalPrice?.toFixed(2) || ""}€
              </div>
            </div>
            <div className="to-checkout-cont__center">
              <Button
                // onClick={() => handleSubmit()}
                size="lg"
                color="warning"
                variant="solid"
              >
                Avanti
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
