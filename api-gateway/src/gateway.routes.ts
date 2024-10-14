import express from 'express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { AUTH_SERVICE_URL, PROFILE_SERVICE_URL, USER_SERVICE_URL } from './env';

const router = express.Router();

// Load service proto files
const authProtoPath = path.resolve(__dirname, '../../auth-service/src/auth.proto');
const userProtoPath = path.resolve(__dirname, '../../user-service/src/user.proto');
const profileProtoPath = path.resolve(__dirname, '../../profile-service/src/profile.proto');

const authPackageDefinition = protoLoader.loadSync(authProtoPath);
const userPackageDefinition = protoLoader.loadSync(userProtoPath);
const profilePackageDefinition = protoLoader.loadSync(profileProtoPath);

const authProto: any = grpc.loadPackageDefinition(authPackageDefinition).auth;
const userProto: any = grpc.loadPackageDefinition(userPackageDefinition).user;
const profileProto: any = grpc.loadPackageDefinition(profilePackageDefinition).profile;

// Create gRPC clients
const authClient = new authProto.AuthService(AUTH_SERVICE_URL, grpc.credentials.createInsecure());
const userClient = new userProto.UserService(USER_SERVICE_URL, grpc.credentials.createInsecure());
const profileClient = new profileProto.ProfileService(PROFILE_SERVICE_URL, grpc.credentials.createInsecure());

// Middleware to validate JWT token
const validateToken = (req: any, res: any, next: any) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  authClient.validateToken({ token }, (err: any, response: any) => {
    if (err || !response.valid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.username = response.username;
    console.log("response.username: ", response.username);
    next();
  });
};

// Routes
router.post('/register', (req, res) => {
  userClient.createUser(req.body, (err: any, response: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

router.post('/login', (req, res) => {
  // In a real-world scenario, you'd first validate the user's credentials
  // For simplicity, we're just creating a token here
  authClient.createToken(req.body, (err: any, response: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

router.get('/getUser', validateToken, (req: any, res: any) => {
  const username = req.username;  // The userId should be set by the validateToken middleware
  console.log("username: ", username);

  if (!username) {
    return res.status(400).json({ error: 'Missing user username' });
  }

  userClient.getUser({ username }, (err: any, response: any) => {
    if (err) {
      // Handle gRPC error with appropriate status
      const statusCode = err.code === grpc.status.NOT_FOUND ? 404 : 500;
      return res.status(statusCode).json({ error: err.details || 'Internal server error' });
    }

    // Send successful response
    res.json(response);
  });
});


router.get('/profile', validateToken, (req: any, res) => {
  profileClient.getProfile({ username : req.username  }, (err: any, response: any) => {
    console.log("req.userId: ", req.userId);
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

router.put('/profile', validateToken, (req: any, res) => {
  const updateRequest = { username: req.username, ...req.body };
  profileClient.updateProfile(updateRequest, (err: any, response: any) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
});
});


export const authRoutes = router;