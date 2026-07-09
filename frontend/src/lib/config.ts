// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// App Configuration
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'MeuExame';
export const APP_DESCRIPTION = 'Plataforma de Educação Online - Moçambique';

// Feature Flags
export const FEATURES = {
  ENABLE_ADMIN_PANEL: true,
  ENABLE_SUBSCRIPTIONS: true,
  ENABLE_PAGES: true,
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
};

// Currencies
export const DEFAULT_CURRENCY = 'MZN'; // Metical
export const CURRENCY_SYMBOLS = {
  MZN: 'MT',
  USD: '$',
  EUR: '€',
};
