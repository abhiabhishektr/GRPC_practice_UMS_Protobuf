// docker-compose.yml
version: '3'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "3000:3000"
    environment:
      - AUTH_SERVICE_URL=auth-service:50051
      - USER_SERVICE_URL=user-service:50052
      - PROFILE_SERVICE_URL=profile-service:50053
    depends_on:
      - auth-service
      - user-service
      - profile-service

  auth-service:
    build: ./auth-service
    environment:
      - JWT_SECRET=your-secret-key

  user-service:
    build: ./user-service

  profile-service:
    build: ./profile-service

// README.md
# Microservices Architecture with gRPC and JWT Authentication

This project demonstrates a basic microservices architecture using Node.js, TypeScript, gRPC, and JWT authentication. It consists of three services (Auth, User, and Profile) and an API Gateway.

## Services

1. **Auth Service**: Handles JWT creation and validation.
2. **User Service**: Manages user-related data.
3. **Profile Service**: Provides basic user profile information.
4. **API Gateway**: Routes requests to the respective microservices.

## Setup and Running

1. Install dependencies for each service and the API Gateway:
   ```
   cd auth-service && npm install
   cd ../user-service && npm install
   cd ../profile-service && npm install
   cd ../api-gateway && npm install
   ```

2. Build the TypeScript code for each service and the API Gateway:
   ```
   cd auth-service && npm run build
   cd ../user-service && npm run build
   cd ../profile-service && npm run build
   cd ../api-gateway && npm run build
   ```

3. Start the services using Docker Compose:
   ```
   docker-compose up --build
   ```

4. The API Gateway will be accessible at `http://localhost:3000`.

## API Endpoints

- POST /api/register: Register a new user
- POST /api/login: Login and receive a JWT token
- GET /api/profile: Get user profile (requires JWT token)
- PUT /api/profile: Update user profile (requires JWT token)

## Notes

- This is a basic implementation and should not be used in production without further security measures and optimizations.
- In a real-world scenario, you would use a database instead of in-memory storage for user and profile data.
- Error handling and input validation should be improved for production use.

// .gitignore
node_modules/
dist/
.env
*.log