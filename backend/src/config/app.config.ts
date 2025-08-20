
export const AppConfig = {
  env: process.env.APP_ENV ?? 'development',
  locale: (process.env.APP_LOCALE ?? 'sv-SE') as 'sv-SE',
  currency: (process.env.APP_CURRENCY ?? 'SEK') as 'SEK',
  b2bOnly: (process.env.B2B_ONLY ?? 'true') === 'true',
  defaultCountry: (process.env.DEFAULT_COUNTRY ?? 'SE') as 'SE',
} as const;
