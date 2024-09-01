require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./router/index.cjs');
const app = express();

const PORT = process.env.PORT_PROXY || 3002;
const corsOptions = {
  origin: process.env.CLIENT_HOST,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/proxy/', router);

app.listen(PORT, () => {
  console.log(`PROXY is running http://localhost:${PORT}`);
});
