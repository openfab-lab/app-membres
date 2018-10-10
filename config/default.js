const h24 = 24 * 60 * 60 * 1000; // 24h

module.exports = {
  app: {
    port: process.env.APP_PORT,
    endpoint: process.env.APP_ENDPOINT
  },
  pg: {
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    db: process.env.PG_DB
  },
  security: {
    hashSalt: process.env.SECURITY_HASH_SALT,
    secret: process.env.SECURITY_SECRET,
    sessionLifeTime: parseInt(process.env.SECURITY_SESSION_LIFE_TIME) || h24
  },
  email: {
    apiKey: process.env.EMAIL_API_KEY,
    domain: process.env.EMAIL_DOMAIN,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
    host: process.env.EMAIL_HOST || 'api.mailgun.net'
  },
  vatlayer: {
    key: process.env.VATLAYER_KEY
  }
};
