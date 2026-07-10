const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
  JWT_SECRET = 'super-strong-secret-key',
  AUTH_ACCESS_TOKEN_EXPIRY = '10m',
  AUTH_REFRESH_TOKEN_EXPIRY = '7d',
  ORIGIN_ALLOW = 'http://localhost:5173',
} = process.env;

export {
  PORT,
  DB_ADDRESS,
  JWT_SECRET,
  AUTH_ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_EXPIRY,
  ORIGIN_ALLOW,
};