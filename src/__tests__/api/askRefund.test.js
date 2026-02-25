jest.mock('../../utils/auth', () => ({
  getAuthHeader: jest.fn(() => ({})),
  handleLogout: jest.fn(),
}));

import { askRefund } from '../../_api/reservations/askRefund';
import { handleLogout } from '../../utils/auth';

describe('askRefund', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call fetch with correct parameters', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ status: 'OK' }),
    });

    await askRefund('ABC123', 'test@email.com', 'I want a refund');

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('/api/booking/reservation/askrefund');
    expect(options.method).toBe('POST');
    expect(JSON.parse(options.body)).toEqual({
      reservation_code: 'ABC123',
      email: 'test@email.com',
      message: 'I want a refund',
    });
  });

  it('should return data when status is OK', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ status: 'OK', message: 'Refund requested' }),
    });

    const result = await askRefund('ABC123', 'test@email.com', '');
    expect(result.status).toBe('OK');
  });

  it('should throw error when status is KO', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ status: 'KO', message: 'Refund not allowed' }),
    });

    await expect(askRefund('ABC123', 'test@email.com', ''))
      .rejects
      .toThrow('Refund not allowed');
  });

  it('should include apiMessage property in error when status is KO', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ status: 'KO', message: 'Custom error message' }),
    });

    try {
      await askRefund('ABC123', 'test@email.com', '');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.apiMessage).toBe('Custom error message');
    }
  });

  it('should handle 401 by calling handleLogout and redirecting', async () => {
    delete window.location;
    window.location = { href: '' };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(askRefund('ABC123', 'test@email.com', ''))
      .rejects
      .toThrow('Unauthorized');

    expect(handleLogout).toHaveBeenCalled();
    expect(window.location.href).toBe('/login');
  });

  it('should throw error when response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(askRefund('ABC123', 'test@email.com', ''))
      .rejects
      .toThrow('Failed to request refund');
  });

  it('should handle network errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(askRefund('ABC123', 'test@email.com', ''))
      .rejects
      .toThrow('Network error');
  });
});
