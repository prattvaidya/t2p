const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "YOUR_secret_key",
  mongoUri: "mongodb+srv://"+process.env.UPASS+"@t2p.iljc9.mongodb.net/t2p?retryWrites=true&w=majority",

  email_service: 'gmail',
  email_username: 'abc@gmail.com',
  email_pwd: '123test'
};

export default config;
