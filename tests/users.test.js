import faker from 'faker';
import { v4 as uuid } from 'uuid';
import supertest from 'supertest';
import '../src/setup.js';
import app from '../src/app.js';
import connection from '../src/database.js';
import createUser from './userFactory.js';
import createSession from './sessionFactory.js';

let newUser = {};

async function clearDatabase() {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM users;');
}

describe('POST /register', () => {
  beforeEach(() => {
    newUser = {
      name: faker.name.findName(),
      email: faker.internet.email().toLowerCase(),
      password: '123456',
      passwordConfirm: '123456',
    };
  });

  it('Creates a new user', async () => {
    const result = await supertest(app).post('/register').send(newUser);
    expect(result.status).toEqual(201);
    expect(result.body).toEqual({ message: 'Created!' });

    const insertedUser = await connection.query(
      'SELECT * FROM users WHERE email = $1',
      [newUser.email]
    );
    expect(insertedUser.rows[0]).toEqual({
      id: expect.any(Number),
      name: newUser.name,
      email: newUser.email,
      password: expect.any(String),
    });
  });

  it('Returns 409 if e-mail already used', async () => {
    const user = await createUser();
    newUser.email = user.email;
    const result = await supertest(app).post('/register').send(newUser);
    expect(result.status).toEqual(409);
    expect(result.body).toEqual({ message: 'E-mail already used!' });
  });

  it('Returns 400 if invalid body', async () => {
    delete newUser.name;
    const result = await supertest(app).post('/register').send(newUser);
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid body!' });
  });

  afterEach(async () => {
    await clearDatabase();
  });
});

describe('POST /login', () => {
  beforeEach(async () => {
    newUser = await createUser();
  });

  it('Returns 404 if user not found', async () => {
    const loginData = {
      email: faker.internet.email(),
      password: newUser.password,
    };

    const result = await supertest(app).post('/login').send(loginData);
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({ message: 'E-mail not found!' });
  });

  it('Returns 401 if wrong password', async () => {
    const result = await supertest(app)
      .post('/login')
      .send({ email: newUser.email, password: 'wrongpswd' });

    expect(result.status).toEqual(401);
    expect(result.body).toEqual({ message: 'Invalid password!' });
  });

  it('Returns 200 if logged in sucessfully', async () => {
    const result = await supertest(app)
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    expect(result.status).toEqual(200);
    expect(result.body).toEqual({
      name: newUser.name,
      token: expect.any(String),
    });
  });

  it('Creates a session in the database', async () => {
    await supertest(app)
      .post('/login')
      .send({ email: newUser.email, password: newUser.password });
    const session = await connection.query(
      'SELECT * FROM sessions WHERE id_user = $1;',
      [newUser.id]
    );
    expect(session.rowCount).toEqual(1);
  });

  afterEach(async () => {
    await clearDatabase();
  });
});

/* describe('POST /logout', () => {
  it('Returns 404 session not found', async () => {
    const result = await supertest(app)
      .post('/logout')
      .send({ token: `${uuid()}` });
    expect(result.status).toEqual(404);
    expect(result.body).toEqual({ message: 'Invalid token!' });
  });

  it('Returns 200 if logout was sucessful', async () => {
    const user = await createUser();
    const session = await createSession(user);

    const result = await supertest(app)
      .post('/logout')
      .send({ token: session.token });
    expect(result.status).toEqual(200);
  });

  afterEach(async () => {
    await clearDatabase();
  });
}); */

afterAll(async () => {
  connection.end();
});
