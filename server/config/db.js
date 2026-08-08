const mysql = require('mysql');
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_CONNECTION_LIMIT,
} = require('./config');

const pool = mysql.createPool({
  connectionLimit: DB_CONNECTION_LIMIT || 10,
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  multipleStatements: false,
});

pool.on('error', (err) => {
  console.error('MySQL pool error:', err.message);
});

const connectWithRetry = () => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('MySQL connection failed:', err.message);
      setTimeout(connectWithRetry, 5000);
      return;
    }
    if (connection) connection.release();
    console.log('Connected to MySQL database');
  });
};

connectWithRetry();

const query = (sql, params = []) =>
  new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

const getConnection = () =>
  new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) return reject(err);
      resolve(connection);
    });
  });

const withTransaction = async (work) => {
  const connection = await getConnection();
  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const result = await work(connection);

    await new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    connection.release();
    return result;
  } catch (err) {
    await new Promise((resolve) => {
      connection.rollback(() => resolve());
    });
    connection.release();
    throw err;
  }
};

module.exports = { query, pool, getConnection, withTransaction };
