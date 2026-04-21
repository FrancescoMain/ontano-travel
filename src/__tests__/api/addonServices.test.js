import { suggestAddons, applyAddon, removeAddon } from '../../_api/reservations/addonServices';

jest.mock('../../i18n', () => ({ __esModule: true, default: { language: 'it' } }));
jest.mock('../../utils/auth', () => ({
  getAuthHeader: () => ({ Authorization: 'Bearer test' }),
  handleLogout: jest.fn(),
}));
jest.mock('../../config/config', () => ({
  config: {
    basePath: 'https://api.test',
    suggestAddons: {
      route: '/api/booking/addon-service/suggest/:reservation_code',
      method: 'GET',
    },
    applyAddon: {
      route: '/api/booking/reservation/:reservation_code/addon',
      method: 'POST',
    },
    removeAddon: {
      route: '/api/booking/reservation/:reservation_code/addon/:addon_id',
      method: 'DELETE',
    },
  },
}));

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('suggestAddons', () => {
  it('calls GET with correct URL and returns JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1 }],
    });

    const result = await suggestAddons('RES123');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/api/booking/addon-service/suggest/RES123?language=it',
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual([{ id: 1 }]);
  });

  it('throws with API error message when response not ok', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ message: 'Boom' }),
    });

    await expect(suggestAddons('RES123')).rejects.toThrow('Boom');
  });
});

describe('applyAddon', () => {
  it('posts body { addonServiceId, qty } and returns JSON', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ code: 'RES123' }),
    });

    const result = await applyAddon('RES123', 5, 2);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/api/booking/reservation/RES123/addon?language=it',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ addonServiceId: 5, qty: 2 }),
      })
    );
    expect(result).toEqual({ code: 'RES123' });
  });

  it('throws on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ message: 'Bad addon' }),
    });

    await expect(applyAddon('RES123', 5, 2)).rejects.toThrow('Bad addon');
  });
});

describe('removeAddon', () => {
  it('calls DELETE with reservation_code and addon_id', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ code: 'RES123' }),
    });

    await removeAddon('RES123', 77);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test/api/booking/reservation/RES123/addon/77?language=it',
      expect.objectContaining({ method: 'DELETE' })
    );
  });
});
