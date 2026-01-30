import spinnerReducer, { startLoading, stopLoading } from '../../features/spinner/spinnerSlice';

describe('spinnerSlice', () => {
  const initialState = {
    loadingIds: [],
  };

  describe('startLoading', () => {
    it('should add a loading ID to the array', () => {
      const action = startLoading('fetch-users');
      const state = spinnerReducer(initialState, action);

      expect(state.loadingIds).toContain('fetch-users');
      expect(state.loadingIds).toHaveLength(1);
    });

    it('should handle multiple loading IDs', () => {
      let state = spinnerReducer(initialState, startLoading('fetch-users'));
      state = spinnerReducer(state, startLoading('fetch-routes'));

      expect(state.loadingIds).toContain('fetch-users');
      expect(state.loadingIds).toContain('fetch-routes');
      expect(state.loadingIds).toHaveLength(2);
    });
  });

  describe('stopLoading', () => {
    it('should remove a loading ID from the array', () => {
      const stateWithLoading = {
        loadingIds: ['fetch-users', 'fetch-routes'],
      };
      const action = stopLoading('fetch-users');
      const state = spinnerReducer(stateWithLoading, action);

      expect(state.loadingIds).not.toContain('fetch-users');
      expect(state.loadingIds).toContain('fetch-routes');
      expect(state.loadingIds).toHaveLength(1);
    });

    it('should not modify state if ID does not exist', () => {
      const stateWithLoading = {
        loadingIds: ['fetch-users'],
      };
      const action = stopLoading('non-existent');
      const state = spinnerReducer(stateWithLoading, action);

      expect(state.loadingIds).toEqual(['fetch-users']);
    });
  });
});
