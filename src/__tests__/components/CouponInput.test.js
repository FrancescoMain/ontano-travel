import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CouponInput } from '../../components/CouponInput';

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock coupon API
jest.mock('../../_api/reservations/coupon', () => ({
  applyCoupon: jest.fn(),
  removeCoupon: jest.fn(),
}));

const { applyCoupon, removeCoupon } = require('../../_api/reservations/coupon');

describe('CouponInput', () => {
  const defaultProps = {
    reservationCode: 'RES123',
    couponCode: null,
    onCouponApplied: jest.fn(),
    onCouponRemoved: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render input and apply button when no coupon is applied', () => {
    render(<CouponInput {...defaultProps} />);
    expect(screen.getByPlaceholderText('Codice coupon')).toBeInTheDocument();
    expect(screen.getByText('Applica')).toBeInTheDocument();
  });

  it('should render applied state with remove button when coupon is active', () => {
    render(<CouponInput {...defaultProps} couponCode="SAVE10" />);
    expect(screen.getByText(/SAVE10/)).toBeInTheDocument();
    expect(screen.getByText('Rimuovi coupon')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Codice coupon')).not.toBeInTheDocument();
  });

  it('should call applyCoupon and onCouponApplied on success', async () => {
    const updatedReservation = { couponCode: 'SAVE10', priceToPay: { price: 90 } };
    applyCoupon.mockResolvedValue(updatedReservation);

    render(<CouponInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Codice coupon');
    fireEvent.change(input, { target: { value: 'SAVE10' } });
    fireEvent.click(screen.getByText('Applica'));

    await waitFor(() => {
      expect(applyCoupon).toHaveBeenCalledWith('RES123', 'SAVE10');
      expect(defaultProps.onCouponApplied).toHaveBeenCalledWith(updatedReservation);
    });
  });

  it('should show error message on apply failure', async () => {
    applyCoupon.mockRejectedValue(new Error('Invalid'));

    render(<CouponInput {...defaultProps} />);

    const input = screen.getByPlaceholderText('Codice coupon');
    fireEvent.change(input, { target: { value: 'BADCODE' } });
    fireEvent.click(screen.getByText('Applica'));

    await waitFor(() => {
      expect(screen.getByText('Coupon non valido')).toBeInTheDocument();
    });
  });

  it('should call removeCoupon and onCouponRemoved on success', async () => {
    const updatedReservation = { couponCode: null, priceToPay: { price: 100 } };
    removeCoupon.mockResolvedValue(updatedReservation);

    render(<CouponInput {...defaultProps} couponCode="SAVE10" />);
    fireEvent.click(screen.getByText('Rimuovi coupon'));

    await waitFor(() => {
      expect(removeCoupon).toHaveBeenCalledWith('RES123');
      expect(defaultProps.onCouponRemoved).toHaveBeenCalledWith(updatedReservation);
    });
  });

  it('should disable apply button when input is empty', () => {
    render(<CouponInput {...defaultProps} />);
    const button = screen.getByText('Applica');
    expect(button).toBeDisabled();
  });
});
