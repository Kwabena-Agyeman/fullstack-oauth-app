const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_DB_CONNECTION_STRING;

const MongoConnect = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected!!');
  } catch (error) {
    console.log('Failed to connect to MongoDB', error);
  }
};

const MongoDisconnect = async () => {
  await mongoose.disconnect();
};

module.exports = {
  MongoConnect,
  MongoDisconnect,
};
