const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
    (process.env.IP || "localhost") +
    ":" +
    (process.env.MONGO_PORT || "27017") +
    "/points_db",

  email_service: 'gmail',
  email_username: 'abc@gmail.com',
  email_pwd: '123test'
};

export default config;
