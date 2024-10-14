import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 50051;
