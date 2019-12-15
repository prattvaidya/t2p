const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: 'mongodb://pratt268:pratt268@ds233278.mlab.com:33278/t2p',
  email_service: 'gmail',
  email_username: 'abc@gmail.com',
  email_pwd: '123test'
};

export default config;
