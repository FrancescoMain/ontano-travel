import { getAddonTheme, MAX_ADDON_QTY } from '../../utils/addonServiceConfig';

describe('getAddonTheme', () => {
  it('returns insurance theme for exact match', () => {
    const theme = getAddonTheme('insurance');
    expect(theme.icon).toBe('🛡️');
    expect(theme.unit).toBe('pers');
  });

  it('is case-insensitive and normalizes hyphens/spaces', () => {
    expect(getAddonTheme('Travel Insurance').icon).toBe('🛡️');
    expect(getAddonTheme('travel-insurance').icon).toBe('🛡️');
  });

  it('returns scooter theme with day unit', () => {
    const theme = getAddonTheme('scooter_rental');
    expect(theme.icon).toBe('🛵');
    expect(theme.unit).toBe('day');
  });

  it('falls back to default theme for unknown names', () => {
    const theme = getAddonTheme('completely-unknown-service');
    expect(theme.icon).toBe('🎁');
    expect(theme.unit).toBe('pers');
  });

  it('handles null/undefined name gracefully', () => {
    expect(getAddonTheme(null).icon).toBe('🎁');
    expect(getAddonTheme(undefined).icon).toBe('🎁');
    expect(getAddonTheme('').icon).toBe('🎁');
  });

  it('partial match finds theme', () => {
    const theme = getAddonTheme('priority');
    expect(theme.icon).toBe('⭐');
  });
});

describe('MAX_ADDON_QTY', () => {
  it('is exported as 10', () => {
    expect(MAX_ADDON_QTY).toBe(10);
  });
});
