// Mock dependencies before importing
jest.mock('../../utils/auth', () => ({
  getAuthHeader: jest.fn(() => ({})),
  handleLogout: jest.fn(),
}));

jest.mock('../../i18n', () => ({
  language: 'it',
}));

import { sendTicketsEmail } from '../../_api/reservations/sendTicketsEmail';

describe('sendTicketsEmail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return data when status is OK', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ status: 'OK', message: 'Email sent' }),
    });

    const result = await sendTicketsEmail('ABC123', 'test@email.com');
    expect(result.status).toBe('OK');
  });

  it('should throw error when status is KO', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({ status: 'KO', message: 'Please retry after' }),
    });

    await expect(sendTicketsEmail('ABC123', 'test@email.com'))
      .rejects
      .toThrow('Please retry after');
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
      await sendTicketsEmail('ABC123', 'test@email.com');
      fail('Should have thrown an error');
    } catch (error) {
      expect(error.apiMessage).toBe('Custom error message');
    }
  });

  it('should throw error when response is not ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(sendTicketsEmail('ABC123', 'test@email.com'))
      .rejects
      .toThrow('Failed to send tickets');
  });
});
