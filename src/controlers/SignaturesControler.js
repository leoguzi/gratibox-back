import connection from '../database.js';
import signatureSchema from '../schemas/signatureSchema.js';
import { format } from 'date-fns';

async function registerSignature(req, res) {
  if (signatureSchema.validate(req.body).error) {
    return res.status(400).send({ message: 'Invalid body!' });
  }
  try {
    const { deliveryDay, tea, incense, organicProducts } = req.body;
    const startDate = new Date();
    let isMonthly = false;
    let isWeekly = false;
    if (req.body.signatureType === 'monthly') {
      isMonthly = true;
    } else {
      isWeekly = true;
    }
    const signature = await connection.query(
      `INSERT INTO signatures (
            is_monthly,
            id_user,
            delivery_day,
            start_date,
            is_weekly,
            tea,
            incense,
            organic_products)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;`,
      [
        isMonthly,
        req.idUser,
        deliveryDay,
        startDate,
        isWeekly,
        tea,
        incense,
        organicProducts,
      ]
    );
    const { address, cep, city, state, name } = req.body;
    await connection.query(
      `
      INSERT INTO addresses (
          id_signature,
          street,
          zip_code,
          city,
          state,
          full_name) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
      [signature.rows[0].id, address, cep, city, state, name]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function getSignature(req, res) {
  try {
    const signature = await connection.query(
      `SELECT * FROM signatures WHERE id_user = $1`,
      [req.idUser]
    );

    let signatureInfo = {};

    if (signature.rowCount > 0) {
      const {
        is_monthly,
        is_weekly,
        delivery_day,
        start_date,
        organic_products,
        incense,
        tea,
      } = signature.rows[0];

      const nextDeliveries = calcNextDeliveries(
        is_monthly,
        is_weekly,
        delivery_day
      );
      signatureInfo = {
        signatureType: is_monthly ? 'monthly' : 'weekly',
        startDate: format(start_date, 'dd/MM/yyyy'),
        nextDeliveries: nextDeliveries,
        organicProducts: organic_products,
        incense,
        tea,
      };
    }

    return res.status(200).send(signatureInfo);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

function calcNextDeliveries(is_monthly, is_weekly, deliveryDay) {
  const nextDeliveries = [];
  let today = new Date();
  if (is_monthly) {
    deliveryDay = Number((deliveryDay = deliveryDay.replace('day ', '')));
    while (nextDeliveries.length < 3) {
      if (today.getDate() === deliveryDay) {
        if (today.getDay() === 6) {
          today = new Date(today.setDate(today.getDate() + 2));
        }
        if (today.getDay() === 0) {
          today = new Date(today.setDate(today.getDate() + 1));
        }
        nextDeliveries.push(format(today, 'dd/MM/yyyy'));
        today = new Date(today.setDate(today.getDate() + 1));
      } else {
        today = new Date(today.setDate(today.getDate() + 1));
      }
    }
  }
  if (is_weekly) {
    if (deliveryDay === 'monday') {
      deliveryDay = 1;
    }
    if (deliveryDay === 'wednesday') {
      deliveryDay = 3;
    }
    if (deliveryDay === 'friday') {
      deliveryDay = 5;
    }
    while (nextDeliveries.length < 3) {
      if (today.getDay() === deliveryDay) {
        nextDeliveries.push(format(today, 'dd/MM/yyyy'));
        today = new Date(today.setDate(today.getDate() + 1));
      } else {
        today = new Date(today.setDate(today.getDate() + 1));
      }
    }
  }
  return nextDeliveries;
}
export { registerSignature, getSignature };
