import { v4 as uuidv4 } from 'uuid';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

interface User {
  userId: string;
  username: string;
  email: string;
  password: string;
}

type UserWithoutPassword = Omit<User, 'password'>;

const users: { [key: string]: User } = {};

const PROFILE_PROTO_PATH = path.resolve(__dirname, '../../profile-service/src/profile.proto');
const profilePackageDefinition = protoLoader.loadSync(PROFILE_PROTO_PATH);
const profileProto: any = grpc.loadPackageDefinition(profilePackageDefinition).profile;

// Create a gRPC client for the Profile Service
const profileClient = new profileProto.ProfileService('localhost:50053', grpc.credentials.createInsecure());


export class UserController {
  createUser(call: { request: { username: string; email: string; password: string } }, callback: grpc.sendUnaryData<UserWithoutPassword>) {
    const { username, email, password } = call.request;
    const userId = uuidv4();
    const newUser: User = { userId, username, email, password };
    console.log("newUser: ", newUser);
    users[username] = newUser;
       profileClient.createProfile({ userId, username, email }, (err: any, response: any) => {
      if (err) {
        console.error('Error creating profile:', err);
        callback({
          code: grpc.status.INTERNAL,
          details: 'Error creating user profile'
        });
        return;
      }
      console.log('Profile created:', response);
    const { password: _, ...userWithoutPassword } = newUser;
    callback(null, userWithoutPassword);
  });
  }

  getUser(call: { request: { username: string } }, callback: grpc.sendUnaryData<UserWithoutPassword>) {
    const { username } = call.request;
    console.log("username: ", username);
    const user = users[username];
    console.log("users: ", users);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      callback(null, userWithoutPassword);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'User not found'
      });
    }
  }
}