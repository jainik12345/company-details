// // lib/db.js
// import pkg from "pg";
// const { Pool } = pkg;

// let pool;

// if (!process.env.DATABASE_URL) {
//   throw new Error("DATABASE_URL environment variable is not set");
// }

// if (!global._pgPool) {
//   global._pgPool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//   });
// }

// pool = global._pgPool;

// export default pool;

 import pkg from "pg";
const { Pool } = pkg;

if (!global._pgPool) {
  global._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
}

export default global._pgPool;
