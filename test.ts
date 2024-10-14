import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface TokenPayload {
  userId: string;
  username: string;
}

export class AuthController {
  createToken(call: { request: { userId: string; username: string } }, callback: (error: any, response: { token: string }) => void) {
    const { userId, username } = call.request;
    const token = jwt.sign({ userId, username } as TokenPayload, JWT_SECRET, { expiresIn: '1h' });
    callback(null, { token });
  }

  validateToken(call: { request: { token: string } }, callback: (error: any, response: { valid: boolean; userId?: string }) => void) {
    const { token } = call.request;
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        callback(null, { valid: false });
      } else {
        const payload = decoded as TokenPayload;
        callback(null, { valid: true, userId: payload.userId });
      }
    });
  }
}