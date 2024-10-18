import { Input } from "@mui/joy";

export const CheckoutPrimoPasseggero = () => {
  return (
    <>
      <h5 className="text-secondary">
        1° Passeggero intestatario del biglietto
      </h5>
      <div class="nomeCognome row justify-content-center align-items-center g-2 mb-2">
        <div class="col">
          <Input placeholder="Nome*" />
        </div>
        <div class="col">
          <Input placeholder="Cognome*" />
        </div>
      </div>
      <div class="nascita row justify-content-center align-items-center g-2 mb-2">
        <div class="col">
          <Input placeholder="Luogo di nascita*" />
        </div>
        <div class="col">
          <Input placeholder="Età*" />
        </div>
      </div>
      <h6 className="text-secondary">Informazioni di contatto</h6>
      <div class="contatto row justify-content-center align-items-center g-2 mb-2">
        <div class="col">
          <Input type="email" placeholder="Email*" />
        </div>
        <div class="col">
          <Input type="phone" placeholder="Numero di telefono*" />
        </div>
      </div>
    </>
  );
};
export const CheckoutPasseggero = ({ n }) => {
  return (
    <>
      <h5 className="text-secondary">{n}° Passeggero</h5>
      <div class="nomeCognome row justify-content-center align-items-center g-2 mb-2">
        <div class="col">
          <Input placeholder="Nome*" />
        </div>
        <div class="col">
          <Input placeholder="Cognome*" />
        </div>
      </div>
      <div class="nascita row justify-content-center align-items-center g-2 mb-2">
        <div class="col">
          <Input placeholder="Luogo di nascita*" />
        </div>
        <div class="col">
          <Input placeholder="Età*" />
        </div>
      </div>
    </>
  );
};
