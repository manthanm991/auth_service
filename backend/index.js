const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID', 'RECAPTCHA_SECRET_KEY'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing: ${envVar}`);
    process.exit(1);
  }
});

const connectToMongo = require('./db');
connectToMongo();

const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/',(req, res)=>{ res.send("Auth Backend Service"); })

app.listen(PORT, () => { console.log(`Auth backend service listening on port http://localhost:${PORT}`) });