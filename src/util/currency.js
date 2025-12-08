/**
 * Currency conversion and multi-currency support utilities
 */

// Mock exchange rates - in a real application, these would come from an API
const MOCK_EXCHANGE_RATES = {
  'USD': 1,
  'EUR': 0.85,
  'GBP': 0.73,
  'JPY': 110.0,
  'CAD': 1.25,
  'AUD': 1.35,
  'CHF': 0.92,
  'CNY': 6.45,
  'INR': 73.5,
  'BRL': 5.25
};

// Supported currencies
export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' }
];

/**
 * Convert amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The source currency code
 * @param {string} toCurrency - The target currency code
 * @returns {number} The converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // In a real application, you would fetch current exchange rates from an API
  const fromRate = MOCK_EXCHANGE_RATES[fromCurrency] || 1;
  const toRate = MOCK_EXCHANGE_RATES[toCurrency] || 1;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;
  
  return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
};

/**
 * Format currency amount with proper symbol and localization
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code
 * @returns {string} The formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'USD') => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  if (!currency) return `$${amount.toFixed(2)}`;
  
  // Format based on currency conventions
  switch (currencyCode) {
    case 'JPY':
      return `${currency.symbol}${amount.toFixed(0)}`;
    case 'EUR':
    case 'GBP':
    case 'CAD':
    case 'AUD':
    case 'CHF':
    case 'CNY':
    case 'INR':
    case 'BRL':
      return `${currency.symbol}${amount.toFixed(2)}`;
    default:
      return `${currency.symbol}${amount.toFixed(2)}`;
  }
};

/**
 * Get exchange rates from an external API (mock implementation)
 * In a real application, this would call a service like Fixer.io or Open Exchange Rates
 */
export const getExchangeRates = async () => {
  // Mock implementation - in reality, this would fetch from an API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_EXCHANGE_RATES);
    }, 500);
  });
};

export default {
  convertCurrency,
  formatCurrency,
  getExchangeRates,
  SUPPORTED_CURRENCIES
};