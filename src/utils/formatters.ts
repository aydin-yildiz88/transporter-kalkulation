/**
 * Zahlenformatierung für EUR, %, KM, Liter, etc.
 */

export const formatters = {
  // EUR - Deutsche Formatierung
  currency: (value: number, decimals = 2) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  // Dezimalzahl
  decimal: (value: number, decimals = 2) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  // Prozent
  percent: (value: number, decimals = 2) => {
    return `${value.toFixed(decimals)} %`;
  },

  // Kilometer
  kilometers: (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)} km`;
  },

  // Liter
  liters: (value: number, decimals = 2) => {
    return `${value.toFixed(decimals)} L`;
  },

  // Tonnen
  tonnes: (value: number, decimals = 2) => {
    return `${value.toFixed(decimals)} t`;
  },

  // Stunden
  hours: (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)} h`;
  },

  // Tage
  days: (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)} Tage`;
  },

  // Jahr
  year: (value: number) => {
    return `${Math.round(value)}`;
  },

  // Allgemeine Zahl
  number: (value: number, decimals = 0) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },
};

/**
 * Inverse Formatierung - String zu Number
 */
export const parsers = {
  currency: (value: string): number => {
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.'));
  },

  number: (value: string): number => {
    return parseFloat(value.replace(',', '.'));
  },

  percent: (value: string): number => {
    return parseFloat(value.replace('%', '').trim());
  },
};
