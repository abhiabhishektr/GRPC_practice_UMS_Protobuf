// profile-service/src/index.ts
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import { ProfileController } from './profile.controller';

const PROTO_PATH = path.resolve(__dirname, 'profile.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const profileProto: any = grpc.loadPackageDefinition(packageDefinition).profile;

const server = new grpc.Server();
const profileController = new ProfileController();

server.addService(profileProto.ProfileService.service, {
  createProfile: profileController.createProfile,
  getProfile: profileController.getProfile,
  updateProfile: profileController.updateProfile,
});

server.bindAsync('0.0.0.0:50053', grpc.ServerCredentials.createInsecure(), (error, port) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Profile service running on port ${port}`);
  server.start();
});