import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';
// import { keys } from '../../../secret/keys.js';

// Use this to let TS node this is a global function signup() which returns a Promise and is resolved with an array of strings
declare global {
  namespace NodeJS {
    interface Global {
      getCookie(id?: string): string[];
    }
  }
}

// Have jest use fake nats-server
jest.mock('../nats-wrapper');

process.env.STRIPE_KEY =
  'sk_test_51GwoZQHoTeqrXIOUylBlw55EVxXmiomGZCkJ24A8WWU4DZUvvxB7N6uYVt4Wj5DK9L8ZhBZfV73gwvGMPjptRy5C00JMU2OYIN';

// A hook function that runs before all the tests starts to be executed.
let mongo: any;
beforeAll(async () => {
  // Resets the fake natsWrapper after every test
  jest.clearAllMocks();

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
global.getCookie = (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // Return a string thats the cookie with the encoded data
  return [`express:sess=${base64}`];
};
