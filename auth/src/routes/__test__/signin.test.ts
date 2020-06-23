import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '12345'
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  // 1) Signup an account to get doc in the mongo memory server
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  // 2) Sigin with incorrect password
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'pas'
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  // 1) Signup an account to get doc in the mongo memory server
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  // 2) Sigin with correct password
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);

  // Check the response header for Set-Cookie
  expect(response.get('Set-Cookie')).toBeDefined();
});
