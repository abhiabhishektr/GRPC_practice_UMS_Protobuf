import express from 'express';
import dotenv from 'dotenv';
import { authRoutes } from './gateway.routes';
import { PORT } from './env';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', authRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
