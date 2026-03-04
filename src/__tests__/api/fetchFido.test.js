jest.mock('../../utils/auth', () => ({
  getAuthHeader: jest.fn(() => ({ Authorization: 'Bearer test-token' })),
  handleLogout: jest.fn(),
}));

import { fetchFido } from '../../_api/agency/fetchFido';
import { getAuthHeader, handleLogout } from '../../utils/auth';

describe('fetchFido', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAuthHeader.mockReturnValue({ Authorization: 'Bearer test-token' });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should call fetch with correct URL and headers', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => 350.0,
    });

    await fetchFido();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain('/agency/fido');
    expect(options.method).toBe('GET');
    expect(options.headers.Authorization).toBe('Bearer test-token');
  });

  it('should return the fido value from JSON response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => 350.0,
    });

    const result = await fetchFido();
    expect(result).toBe(350.0);
  });

  it('should return null on network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await fetchFido();
    expect(result).toBeNull();
  });

  it('should handle 401 by calling handleLogout', async () => {
    // Mock window.location
    delete window.location;
    window.location = { href: '' };

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const result = await fetchFido();
    expect(handleLogout).toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('should handle text response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => '500.50',
    });

    const result = await fetchFido();
    expect(result).toBe(500.50);
  });

  it('should return null for empty text response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'text/plain' },
      text: async () => '',
    });

    const result = await fetchFido();
    expect(result).toBeNull();
  });
});
