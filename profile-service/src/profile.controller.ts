// profile-service/src/profile.controller.ts
import * as grpc from '@grpc/grpc-js';

interface Profile {
  userId: string;
  username: string;
  email: string;
  bio: string;
}

const profiles: { [key: string]: Profile } = {};
console.log("profiles: ", profiles);

export class ProfileController {
  createProfile(call: { request: { userId: string; username: string; email: string } }, callback: grpc.sendUnaryData<Profile>) {
    const { userId, username, email } = call.request;
    const newProfile: Profile = { userId, username, email, bio: '' };
    profiles[username] = newProfile;
    console.log('New profile created:', newProfile);
    callback(null, newProfile);
  }

  getProfile(call: { request: { username: string } }, callback: grpc.sendUnaryData<Profile>) {
    const { username } = call.request;
    console.log("userId: ", username);
    console.log("profiles: ", profiles);
    const profile = profiles[username];
    if (profile) {
      callback(null, profile);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Profile not found'
      });
    }
  }

  updateProfile(call: { request: { username: string; bio: string } }, callback: grpc.sendUnaryData<Profile>) {
    const { username , bio } = call.request;
    console.log("bio: ", bio);
    console.log("username: ", username);
    const profile = profiles[username];
    if (profile) {
      profile.bio = bio;
      callback(null, profile);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Profile not found'
      });
    }
  }
}