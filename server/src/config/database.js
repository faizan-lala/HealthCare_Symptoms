const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.jvz7u.mongodb.net/healthcare_symptoms', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;