export const IS_PROD = !(
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
);

export const IS_DEV = process.env.NODE_ENV === 'development';

export const URL = IS_DEV ? 'http://localhost:5000' : 'https://dungyzonapi.onrender.com';
