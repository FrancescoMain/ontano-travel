import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CheckoutTratta } from "../../components/CheckoutTratta";

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: "it" },
  }),
}));

const baseRoute = {
  company: "CapitanMorgan",
  from: "Napoli Beverello",
  to: "Gita con bagno",
  departure: "2026-07-25T09:55:00+02:00",
  arrive: "2026-07-25T11:25:00+02:00",
  tariffs: [],
  priceFinal: { price: 30, priceFormatted: "€ 30,00" },
};

describe("CheckoutTratta - loghi compagnie", () => {
  it("mostra il logo Capitan Morgan quando la compagnia è CapitanMorgan", () => {
    render(<CheckoutTratta route={baseRoute} />);
    const logo = screen.getByAltText("Capitan Morgan");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveClass("img-logo");
    expect(logo.getAttribute("src")).toContain("capitan-morgan");
  });

  it("non mostra il logo Capitan Morgan per altre compagnie", () => {
    render(
      <CheckoutTratta route={{ ...baseRoute, company: "Alilauro" }} />
    );
    expect(screen.queryByAltText("Capitan Morgan")).not.toBeInTheDocument();
    expect(screen.getByAltText("Alilauro")).toBeInTheDocument();
  });

  it("mostra porti di partenza e arrivo della tratta", () => {
    render(<CheckoutTratta route={baseRoute} />);
    expect(screen.getByText("Napoli Beverello")).toBeInTheDocument();
    expect(screen.getByText("Gita con bagno")).toBeInTheDocument();
  });
});
