const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const connectToMongo = require('./db');
connectToMongo();

const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/',(req, res)=>{
    res.send("Auth Backend Service");
})

app.listen(PORT, () => {
    console.log(`Auth backend service listening on port http://localhost:${PORT}`)
});