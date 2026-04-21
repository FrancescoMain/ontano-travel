import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddonServiceCard } from '../../components/Checkouts/AddonServiceCard';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

const baseAddon = {
  id: 42,
  name: 'travel_insurance',
  title: 'Assicurazione Viaggio',
  description: 'Proteggi il tuo viaggio',
  tooltip: 'Copre cancellazioni',
  price: { price: 5, priceFormatted: '€ 5,00' },
};

describe('AddonServiceCard', () => {
  const defaultProps = {
    addon: baseAddon,
    appliedQty: 0,
    onApply: jest.fn(),
    onRemove: jest.fn(),
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, price badge, tooltip badge and description', () => {
    render(<AddonServiceCard {...defaultProps} />);
    expect(screen.getByText('Assicurazione Viaggio')).toBeInTheDocument();
    expect(screen.getByText(/€ 5,00/)).toBeInTheDocument();
    expect(screen.getByText('Copre cancellazioni')).toBeInTheDocument();
    expect(screen.getByText('Proteggi il tuo viaggio')).toBeInTheDocument();
  });

  it('hides tooltip badge when tooltip is missing', () => {
    const addon = { ...baseAddon, tooltip: '' };
    render(<AddonServiceCard {...defaultProps} addon={addon} />);
    expect(screen.queryByText('Copre cancellazioni')).not.toBeInTheDocument();
  });

  it('calls onApply when increment is clicked', () => {
    render(<AddonServiceCard {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Aumenta quantità'));
    expect(defaultProps.onApply).toHaveBeenCalledWith(baseAddon, 1);
  });

  it('calls onApply with decremented qty when qty > 1', () => {
    render(<AddonServiceCard {...defaultProps} appliedQty={3} />);
    fireEvent.click(screen.getByLabelText('Diminuisci quantità'));
    expect(defaultProps.onApply).toHaveBeenCalledWith(baseAddon, 2);
  });

  it('calls onRemove when decrement brings qty to 0', () => {
    render(<AddonServiceCard {...defaultProps} appliedQty={1} />);
    fireEvent.click(screen.getByLabelText('Diminuisci quantità'));
    expect(defaultProps.onRemove).toHaveBeenCalledWith(baseAddon);
    expect(defaultProps.onApply).not.toHaveBeenCalled();
  });

  it('disables decrement when qty is 0', () => {
    render(<AddonServiceCard {...defaultProps} appliedQty={0} />);
    expect(screen.getByLabelText('Diminuisci quantità')).toBeDisabled();
  });

  it('disables increment when qty reaches max (10)', () => {
    render(<AddonServiceCard {...defaultProps} appliedQty={10} />);
    expect(screen.getByLabelText('Aumenta quantità')).toBeDisabled();
  });

  it('shows selected styling and check label when qty > 0', () => {
    render(<AddonServiceCard {...defaultProps} appliedQty={2} />);
    expect(screen.getByLabelText('Selezionato')).toBeInTheDocument();
  });

  it('disables both buttons when disabled prop is true', () => {
    render(<AddonServiceCard {...defaultProps} appliedQty={2} disabled={true} />);
    expect(screen.getByLabelText('Aumenta quantità')).toBeDisabled();
    expect(screen.getByLabelText('Diminuisci quantità')).toBeDisabled();
  });
});
