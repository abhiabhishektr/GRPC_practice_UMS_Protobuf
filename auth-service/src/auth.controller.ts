import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from './env';


interface TokenPayload {
  userId: string;
  username: string;
}

export class AuthController {
  createToken(call: { request: { userId: string; username: string } }, callback: (error: any, response: { token: string }) => void) {
    const { userId, username } = call.request;
    console.log("username: ", username);
    console.log("userId: ", userId);
    const token = jwt.sign({ userId, username } as TokenPayload, JWT_SECRET, { expiresIn: '1h' });
    callback(null, { token });
  }

  validateToken(call: { request: { token: string } }, callback: (error: any, response: { valid: boolean; username?: string }) => void) {
    let { token } = call.request;
    console.log("token: ", token);
    if (token.startsWith('Bearer ')) {
      token = token.slice(7); // Remove 'Bearer ' prefix
  }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        callback(null, { valid: false });
      } else {
        const payload = decoded as TokenPayload;
        console.log("payload: ", payload);
        callback(null, { valid: true, username: payload.username });
      }
    });
  }
}