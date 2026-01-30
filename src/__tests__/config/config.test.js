import { axerveScriptDev, axerveScriptProd } from '../../config/basePath';

describe('Axerve configuration', () => {
  it('should have correct sandbox URL', () => {
    expect(axerveScriptDev).toBe('https://sandbox.gestpay.net/pagam/javascript/axerve.js');
  });

  it('should have correct production URL', () => {
    expect(axerveScriptProd).toBe('https://ecomm.sella.it/pagam/javascript/axerve.js');
  });

  it('should have different URLs for dev and prod', () => {
    expect(axerveScriptDev).not.toBe(axerveScriptProd);
  });
});
