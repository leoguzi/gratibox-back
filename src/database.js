import pg from 'pg';

const { Pool } = pg;

let connConfig = {};

if (process.env.NODE_ENV === 'prod') {
  connConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
  connConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
  };
}

const connection = new Pool(connConfig);

export default connection;
