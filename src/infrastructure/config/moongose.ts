// infrastructure/config/database.ts
import mongoose from 'mongoose';

export async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://mongo:27017/videos');
    console.log('📦 Worker conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando el Worker a MongoDB', error);
    process.exit(1);
  }
}
