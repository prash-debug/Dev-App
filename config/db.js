const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('err.message');
    console.log('Error connecting to db');
    //Exit the process if the db connection fails..
    process.exit(1);
  }
};
module.exports = connectDB;
