import connection from '../database.js';
import signatureSchema from '../schemas/signatureSchema.js';
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
export { registerSignature };
