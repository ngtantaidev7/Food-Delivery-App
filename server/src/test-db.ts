import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in server/.env');
  process.exit(1);
}

console.log('Connecting to MongoDB Atlas...');

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 8000 })
  .then(() => {
    console.log('✅ KẾT NỐI MONGODB ATLAS THÀNH CÔNG!');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ KẾT NỐI THẤT BẠI:', err.message);
    process.exit(1);
  });
