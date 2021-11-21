import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import connection from '../database.js';
import userSchema from '../schemas/userSchema.js';

async function registerUser(req, res) {
  if (userSchema.validate(req.body).error) {
    return res.status(400).send({ message: 'Invalid body!' });
  }
  const { name, email } = req.body;

  try {
    const user = await connection.query('SELECT * FROM users WHERE email=$1;', [
      email,
    ]);
    if (user.rowCount > 0) {
      return res.status(409).send({ message: 'E-mail already used!' });
    }

    const encriptedPassword = bcrypt.hashSync(req.body.password, 10);

    await connection.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3);',
      [name, email.toLowerCase(), encriptedPassword]
    );
    return res.status(201).send({ message: 'Created!' });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function logIn(req, res) {
  const { email, password } = req.body;
  try {
    let user = await connection.query('SELECT * FROM users WHERE email = $1;', [
      email,
    ]);
    if (user.rowCount === 0) {
      return res.status(404).send({ message: 'E-mail not found!' });
    }
    [user] = user.rows;

    if (bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await connection.query(
        'INSERT INTO sessions (id_user, token) VALUES ($1, $2);',
        [user.id, token]
      );
      const signature = await connection.query(
        `SELECT * FROM signatures WHERE id_user = $1`,
        [user.id]
      );
      const userInfo = {
        name: user.name,
        token,
        signatureInfo: {},
      };
      if (signature.rowCount > 0) {
        const userInfo = {
          ...userInfo,
          signatureInfo: {
            ...signature.rows[0],
          },
        };
      }

      return res.status(200).send(userInfo);
    }
    return res.status(401).send({ message: 'Invalid password!' });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

async function logOut(req, res) {
  const { token } = req.body;
  try {
    const response = await connection.query(
      'DELETE FROM sessions WHERE token = $1;',
      [token]
    );
    if (response.rowCount === 0) {
      return res.status(404).send({ message: 'Invalid token!' });
    }
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export { registerUser, logIn, logOut };
