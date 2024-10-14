import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { AuthController } from './auth.controller';

const PROTO_PATH = path.resolve(__dirname, 'auth.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const authProto: any = grpc.loadPackageDefinition(packageDefinition).auth;

const server = new grpc.Server();
const authController = new AuthController();

server.addService(authProto.AuthService.service, {
  createToken: authController.createToken,
  validateToken: authController.validateToken,
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Auth service running on port ${port}`);
  server.start();
});
