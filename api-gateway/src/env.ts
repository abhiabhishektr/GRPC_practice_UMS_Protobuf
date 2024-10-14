import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3500;
export const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'localhost:50051';
export const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'localhost:50052';
export const PROFILE_SERVICE_URL = process.env.PROFILE_SERVICE_URL || 'localhost:50053';
