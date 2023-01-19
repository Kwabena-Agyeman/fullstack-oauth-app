require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

//Routes
const authRoutes = require('./routes/auth');
const refreshTokenRoutes = require('./routes/refreshToken');

// Utils
const { MongoConnect } = require('./utils/connectDB');

const app = express();

// CORS OPTIONS
const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(',')
  : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },

  credentials: true,
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('combined'));

// Routes
app.get('/', function (req, res) {
  res.send({ status: 'success' });
});

app.use('/api', authRoutes);
app.use('/api/refreshToken', refreshTokenRoutes);

//Start the server in port 8081

const startServer = async () => {
  await MongoConnect();
  const server = app.listen(process.env.PORT || 8081, function () {
    const port = server.address().port;

    console.log('Server is running on port:', port);
  });
};

startServer();
