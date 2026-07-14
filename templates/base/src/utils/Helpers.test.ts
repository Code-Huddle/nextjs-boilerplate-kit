import { getI18nPath } from './Helpers';

describe('getI18nPath', () => {
  it('keeps the default locale path unchanged', () => {
    expect(getI18nPath('/docs', 'en')).toBe('/docs');
  });

  it('prefixes a non-default locale', () => {
    expect(getI18nPath('/docs', 'fr')).toBe('/fr/docs');
  });
});
