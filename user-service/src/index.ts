import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { UserController } from './user.controller';

const PROTO_PATH = path.resolve(__dirname, 'user.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const userProto: any = grpc.loadPackageDefinition(packageDefinition).user;

const server = new grpc.Server();
const userController = new UserController();

server.addService(userProto.UserService.service, {
  createUser: userController.createUser,
  getUser: userController.getUser,
});

server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(`User service running on port ${port}`);
  server.start();
});