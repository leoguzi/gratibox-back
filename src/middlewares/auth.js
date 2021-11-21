import connection from '../database.js';
async function validateSession(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Not logged in!' });
  }
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    const result = await connection.query(
      'SELECT * FROM sessions WHERE token = $1;',
      [token]
    );
    if (result.rowCount === 0) {
      return res.status(401).send({ message: 'Not logged in!' });
    }
    req.userId = result.rows[0].id_user;
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}
export default validateSession;
