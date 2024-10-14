import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();


export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 50053;
