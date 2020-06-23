import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

// Use this to let TS node this is a global function signup() which returns a Promise and is resolved with an array of strings
declare global {
  namespace NodeJS {
    interface Global {
      getCookie(): Promise<string[]>;
    }
  }
}

// A hook function that runs before all the tests starts to be executed.
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  // Create a memory server
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Runs before each test
beforeEach(async () => {
  // Get all the collections that exist in the db
  const collections = await mongoose.connection.db.collections();

  // Loop over the collections and delete all the data inside
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// Globally scoped function only available in the testing environment
global.getCookie = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);

  // Supertest doesnt handle cookies i.e it doesn't send the cookie with our request so need to manually retrieve cookie
  const cookie = response.get('Set-Cookie');

  return cookie;
};
