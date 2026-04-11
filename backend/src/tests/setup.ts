import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

export default async function globalSetup() {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.PORT = '5001'; // avoid clashing with a running dev server
  process.env.JWT_SECRET = 'test-secret-do-not-use-in-production';
  process.env.FRONTEND_URL = 'http://localhost:3000';
  // store the instance reference so teardown can stop it
  (globalThis as Record<string, unknown>).__MONGOD__ = mongod;
}
