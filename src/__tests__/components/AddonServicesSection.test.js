import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddonServicesSection } from '../../components/Checkouts/AddonServicesSection';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn() },
}));

jest.mock('../../_api/reservations/addonServices', () => ({
  suggestAddons: jest.fn(),
  applyAddon: jest.fn(),
  removeAddon: jest.fn(),
}));

const { suggestAddons, applyAddon, removeAddon } = require('../../_api/reservations/addonServices');

const mkAddon = (id, name, title, priority = 0) => ({
  id,
  name,
  title,
  description: `Desc ${title}`,
  tooltip: `Tag ${title}`,
  price: { price: 5, priceFormatted: '€ 5,00' },
  priority,
});

describe('AddonServicesSection', () => {
  const defaultProps = {
    reservationCode: 'RES123',
    appliedAddons: [],
    onReservationUpdated: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing until reservationCode is provided', () => {
    const { container } = render(
      <AddonServicesSection {...defaultProps} reservationCode={null} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('fetches suggestions and renders cards sorted by priority', async () => {
    suggestAddons.mockResolvedValue([
      mkAddon(1, 'insurance', 'Assicurazione', 2),
      mkAddon(2, 'transfer', 'Transfer', 1),
    ]);

    render(<AddonServicesSection {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Assicurazione')).toBeInTheDocument();
      expect(screen.getByText('Transfer')).toBeInTheDocument();
    });

    expect(suggestAddons).toHaveBeenCalledWith('RES123');
    expect(screen.getByText('Arricchisci il tuo viaggio')).toBeInTheDocument();
    expect(screen.getByText('NOVITÀ')).toBeInTheDocument();
  });

  it('renders empty (no section) if API returns no addons', async () => {
    suggestAddons.mockResolvedValue([]);
    const { container } = render(<AddonServicesSection {...defaultProps} />);
    await waitFor(() => {
      expect(container.querySelector('.addon-section')).not.toBeInTheDocument();
    });
  });

  it('applies an addon and calls onReservationUpdated', async () => {
    suggestAddons.mockResolvedValue([mkAddon(1, 'insurance', 'Assicurazione')]);
    const updated = { code: 'RES123', addonServices: [{ id: 77, addonServiceId: 1, qty: 1 }] };
    applyAddon.mockResolvedValue(updated);

    render(<AddonServicesSection {...defaultProps} />);

    await waitFor(() => screen.getByText('Assicurazione'));

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Aumenta quantità'));
    });

    await waitFor(() => {
      expect(applyAddon).toHaveBeenCalledWith('RES123', 1, 1);
      expect(defaultProps.onReservationUpdated).toHaveBeenCalledWith(updated);
    });
  });

  it('removes an addon when qty goes to 0', async () => {
    suggestAddons.mockResolvedValue([mkAddon(1, 'insurance', 'Assicurazione')]);
    const updated = { code: 'RES123', addonServices: [] };
    removeAddon.mockResolvedValue(updated);

    render(
      <AddonServicesSection
        {...defaultProps}
        appliedAddons={[{ id: 77, addonServiceId: 1, qty: 1, title: 'Assicurazione' }]}
      />
    );

    await waitFor(() => screen.getByText('Assicurazione'));

    await act(async () => {
      fireEvent.click(screen.getByLabelText('Diminuisci quantità'));
    });

    await waitFor(() => {
      expect(removeAddon).toHaveBeenCalledWith('RES123', 77);
      expect(defaultProps.onReservationUpdated).toHaveBeenCalledWith(updated);
    });
  });

  it('handles API wrapper shape { items: [...] }', async () => {
    suggestAddons.mockResolvedValue({ items: [mkAddon(1, 'insurance', 'Assicurazione')] });
    render(<AddonServicesSection {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Assicurazione')).toBeInTheDocument();
    });
  });
});
