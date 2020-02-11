const mongoose = require('mongoose');

const connectDB = async () => {
  const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };
  try {
    await mongoose.connect(process.env.MONGO_URI, option);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
