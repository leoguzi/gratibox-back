import faker from 'faker';
import connection from '../src/database';

export default async function createEntry(userId) {
  const boolean = faker.datatype.boolean();
  const week = ['monday', 'wednesday', 'friday'];
  const month = ['day 01', 'day 10', 'day 20'];
  let newSignature = {
    userId,
    isMonthly: boolean,
    isWeekly: !boolean,
    deliveryDay: boolean
      ? faker.random.arrayElement(month)
      : faker.random.arrayElement(week),
    startDate: new Date(),
    tea: faker.datatype.boolean(),
    incense: faker.datatype.boolean(),
    organicProducts: faker.datatype.boolean(),
  };

  const signature = await connection.query(
    `INSERT INTO signatures (
      id_user,
      is_monthly,
      is_weekly,
      delivery_day,
      start_date,
      tea,
      incense,
      organic_products ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
    [
      newSignature.userId,
      newSignature.isMonthly,
      newSignature.isWeekly,
      newSignature.deliveryDay,
      newSignature.startDate,
      newSignature.tea,
      newSignature.incense,
      newSignature.organicProducts,
    ]
  );

  let address = {
    idSignature: signature.rows[0].id,
    street: faker.lorem.words(5),
    zipCode: faker.datatype
      .number({
        max: 99999999,
        min: 10000000,
      })
      .toString(),
    city: faker.address.city(),
    state: faker.address.stateAbbr(),
    fullName: faker.name.findName(),
  };

  await connection.query(
    `INSERT INTO addresses (
    id_signature,
    street,
    zip_code,
    city,
    state,
    full_name) 
  VALUES ($1, $2, $3, $4, $5, $6);`,
    [
      address.idSignature,
      address.street,
      address.zipCode,
      address.city,
      address.state,
      address.fullName,
    ]
  );

  [newSignature] = signature.rows;

  return newSignature;
}
