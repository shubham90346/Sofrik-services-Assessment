const config = {
  PORT: process.env.PORT || '3001',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/sofrik',
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3600s',
};

export default config;
