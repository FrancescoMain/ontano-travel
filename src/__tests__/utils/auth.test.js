// Mock axios before importing auth module
jest.mock('axios');

// Mock the store
jest.mock('../../app/store', () => ({
  store: {
    getState: jest.fn(() => ({ account: { data: null } })),
    dispatch: jest.fn(),
  },
}));

// Mock i18n
jest.mock('../../i18n', () => ({
  language: 'it',
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

import { getToken, getAuthHeader } from '../../utils/auth';

describe('auth utils', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('id_token', 'test-token-local');
      expect(getToken()).toBe('test-token-local');
    });

    it('should return token from sessionStorage if not in localStorage', () => {
      sessionStorage.setItem('id_token', 'test-token-session');
      expect(getToken()).toBe('test-token-session');
    });

    it('should prefer localStorage over sessionStorage', () => {
      localStorage.setItem('id_token', 'local-token');
      sessionStorage.setItem('id_token', 'session-token');
      expect(getToken()).toBe('local-token');
    });

    it('should return null if no token exists', () => {
      expect(getToken()).toBeNull();
    });
  });

  describe('getAuthHeader', () => {
    it('should return Authorization header with Bearer token', () => {
      localStorage.setItem('id_token', 'my-jwt-token');
      const header = getAuthHeader();
      expect(header).toEqual({ Authorization: 'Bearer my-jwt-token' });
    });

    it('should return empty object if no token exists', () => {
      const header = getAuthHeader();
      expect(header).toEqual({});
    });
  });
});
