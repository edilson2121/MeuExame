// API Configuration
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

export const API_URL = getApiUrl();

// App Configuration
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MeuExame';
export const APP_DESCRIPTION = 'Plataforma de Educação Online - Moçambique';

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Feature Flags
export const FEATURES = {
  ENABLE_ADMIN_PANEL: true,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_PAGES: true,
  ENABLE_MPESA: true,
  ENABLE_WALLET: true,
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// Timeouts
export const API_TIMEOUT = 30000; // 30 segundos
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'meuexame_auth_token',
  USER_DATA: 'meuexame_user_data',
  INSTITUTION_ID: 'meuexame_institution_id',
  REMEMBER_ME: 'meuexame_remember',
};

// Currencies
export const DEFAULT_CURRENCY = 'MZN'; // Metical
export const CURRENCY_SYMBOLS = {
  MZN: 'MT',
  USD: '$',
  EUR: '€',
};

// Payment Methods
export const PAYMENT_METHODS = {
  MPESA: 'M-Pesa',
  EMOLA: 'e-Mola',
  BANK_TRANSFER: 'Transferência Bancária',
  CASH: 'Dinheiro',
};
