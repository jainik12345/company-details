// import mysql from "mysql2/promise";

// let pool;

// if (!globalThis.__pool) {
//   globalThis.__pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: Number(process.env.DB_PORT) || 3306,
//     waitForConnections: true,
//     connectionLimit: 10,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// }

// pool = globalThis.__pool;

// export default pool;

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export default pool;
