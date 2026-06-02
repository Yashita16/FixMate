import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;
console.log(process.env.MONGODB_URI);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}).catch((err) => {
  console.error('❌ DB connection failed:', err.message);
  process.exit(1);
});
