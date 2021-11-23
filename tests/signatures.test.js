import '../src/setup.js';
import supertest from 'supertest';
import faker from 'faker';
import { v4 as uuid } from 'uuid';
import app from '../src/app.js';
import connection from '../src/database.js';
import createUser from './userFactory.js';
import createSession from './sessionFactory.js';
import createSignature from './signatureFactory.js';

let user = {};
let session = {};
let newSignature = {};
let config = {};

async function prepareDatabase() {
  const boolean = faker.datatype.boolean();
  const week = ['monday', 'wednesday', 'friday'];
  const month = ['day 01', 'day 10', 'day 20'];

  user = await createUser();
  session = await createSession(user);
  config = {
    Authorization: `Bearer ${session.token}`,
  };

  newSignature = {
    name: user.name,
    signatureType: boolean ? 'monthly' : 'weekly',
    deliveryDay: boolean
      ? faker.random.arrayElement(month)
      : faker.random.arrayElement(week),
    tea: faker.datatype.boolean(),
    incense: faker.datatype.boolean(),
    organicProducts: faker.datatype.boolean(),
    address: faker.lorem.words(3),
    cep: faker.datatype
      .number({
        max: 99999999,
        min: 10000000,
      })
      .toString(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
  };
}

async function clearDatabase() {
  await connection.query('DELETE FROM sessions;');
  await connection.query('DELETE FROM addresses;');
  await connection.query('DELETE FROM signatures;');
  await connection.query('DELETE FROM users;');
}

describe('POST /signature', () => {
  beforeEach(async () => {
    await prepareDatabase();
  });

  it('Returns 400 if no token', async () => {
    const result = await supertest(app).post('/signature').send(newSignature);
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid request!' });
  });

  it('Returns 401 if invalid token', async () => {
    config.Authorization = `Bearer ${uuid()}`;
    const result = await supertest(app)
      .post('/signature')
      .set(config)
      .send(newSignature);
    expect(result.status).toEqual(401);
    expect(result.body).toEqual({ message: 'Not logged in!' });
  });

  it('Returns 400 if invalid body', async () => {
    delete newSignature.tea;
    const result = await supertest(app)
      .post('/signature')
      .set(config)
      .send(newSignature);
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid body!' });
  });

  it('Returns 201 for insertion success', async () => {
    const result = await supertest(app)
      .post('/signature')
      .set(config)
      .send(newSignature);
    expect(result.status).toEqual(201);
    expect(result.body).toEqual({ message: 'Created!' });
  });

  afterEach(async () => {
    await clearDatabase();
  });
});

describe('GET /signature', () => {
  beforeEach(async () => {
    await prepareDatabase();
  });

  it('Returns 400 if no token', async () => {
    const result = await supertest(app).get('/signature');
    expect(result.status).toEqual(400);
    expect(result.body).toEqual({ message: 'Invalid request!' });
  });

  it('Returns 401 if invalid token', async () => {
    config.Authorization = `Bearer ${uuid()}`;
    const result = await supertest(app).get('/signature').set(config);
    expect(result.status).toEqual(401);
    expect(result.body).toEqual({ message: 'Not logged in!' });
  });

  it('Returns user signature info if valid token', async () => {
    const signature = await createSignature(user.id);
    const result = await supertest(app).get('/signature').set(config);
    expect(result.status).toEqual(200);

    expect(result.body).toEqual({
      signatureType: signature.is_monthly ? 'monthly' : 'weekly',
      startDate: expect.any(String),
      nextDeliveries: expect.any(Array),
      organicProducts: signature.organic_products,
      incense: signature.incense,
      tea: signature.tea,
    });
  });

  afterEach(async () => {
    await clearDatabase();
  });
});

afterAll(async () => {
  await connection.end();
});
