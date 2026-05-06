import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Pagamento } from '../../components/Pagamento';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
  initReactI18next: { type: '3rdParty', init: () => {} },
}));

describe('Pagamento', () => {
  const defaultProps = {
    methods: ['CREDIT_CARD', 'PAY_BY_LINK', 'EXTERNAL_PAYMENT'],
    checked: 'CREDIT_CARD',
    onChange: jest.fn(),
    email: '',
    setEmail: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all payment methods', () => {
    render(<Pagamento {...defaultProps} />);
    expect(screen.getByLabelText(/Carta di Credito/)).toBeInTheDocument();
    expect(screen.getByLabelText(/PaybyLink/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Estratto Conto/)).toBeInTheDocument();
  });

  it('should not show fido when fido is null', () => {
    render(<Pagamento {...defaultProps} fido={null} total={100} />);
    expect(screen.queryByText(/importo disponibile/)).not.toBeInTheDocument();
  });

  it('should not show fido when fido is undefined', () => {
    render(<Pagamento {...defaultProps} fido={undefined} total={100} />);
    expect(screen.queryByText(/importo disponibile/)).not.toBeInTheDocument();
  });

  it('should show fido amount when fido is provided', () => {
    render(<Pagamento {...defaultProps} fido={350} total={100} />);
    expect(screen.getByText(/importo disponibile/)).toBeInTheDocument();
    expect(screen.getByText(/350,00/)).toBeInTheDocument();
  });

  it('should not disable EXTERNAL_PAYMENT when fido >= total', () => {
    render(<Pagamento {...defaultProps} fido={350} total={100} />);
    const radio = screen.getByLabelText(/Estratto Conto/);
    expect(radio).not.toBeDisabled();
  });

  it('should disable EXTERNAL_PAYMENT when fido < total', () => {
    render(<Pagamento {...defaultProps} fido={50} total={100} />);
    const radio = screen.getByLabelText(/Estratto Conto/);
    expect(radio).toBeDisabled();
  });

  it('should show danger text when fido is insufficient', () => {
    const { container } = render(<Pagamento {...defaultProps} fido={50} total={100} />);
    const dangerSpan = container.querySelector('.text-danger');
    expect(dangerSpan).toBeInTheDocument();
  });

  it('should show success text when fido is sufficient', () => {
    const { container } = render(<Pagamento {...defaultProps} fido={350} total={100} />);
    const successSpan = container.querySelector('.text-success');
    expect(successSpan).toBeInTheDocument();
  });

  it('should not disable CREDIT_CARD or PAY_BY_LINK regardless of fido', () => {
    render(<Pagamento {...defaultProps} fido={50} total={100} />);
    const creditCard = screen.getByLabelText(/Carta di Credito/);
    const payByLink = screen.getByLabelText(/PaybyLink/);
    expect(creditCard).not.toBeDisabled();
    expect(payByLink).not.toBeDisabled();
  });

  it('should call onChange when selecting a payment method', () => {
    render(<Pagamento {...defaultProps} />);
    fireEvent.click(screen.getByLabelText(/PaybyLink/));
    expect(defaultProps.onChange).toHaveBeenCalledWith('PAY_BY_LINK');
  });
});
