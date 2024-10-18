import * as React from "react";
import Stepper from "@mui/joy/Stepper";
import Step from "@mui/joy/Step";
import StepButton from "@mui/joy/StepButton";
import StepIndicator from "@mui/joy/StepIndicator";
import Check from "@mui/icons-material/Check";
import "./index.css";

const steps = ["PARTENZE", "DATI E PAGAMENTO"];

export default function ButtonStepper({ step }) {
  const [activeStep, setActiveStep] = React.useState(step || 0);
  return (
    <div className="stepper-container">
      <Stepper sx={{ width: "60%" }}>
        {steps.map((step, index) => (
          <Step
            key={step}
            indicator={
              <StepIndicator
                variant={activeStep <= index ? "soft" : "solid"}
                color={activeStep < index ? "neutral" : "primary"}
              >
                {activeStep <= index ? index + 1 : <Check />}
              </StepIndicator>
            }
            sx={[
              activeStep > index &&
                index !== 2 && { "&::after": { bgcolor: "primary.solidBg" } },
            ]}
          >
            <StepButton onClick={() => setActiveStep(index)}>{step}</StepButton>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
