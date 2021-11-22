import { v4 as uuid } from 'uuid';
import connection from '../src/database';

export default async function createSession(user) {
  const token = uuid();
  const response = await connection.query(
    'INSERT INTO sessions (id_user, token) VALUES ($1, $2) RETURNING *;',
    [user.id, token]
  );
  return response.rows[0];
}
