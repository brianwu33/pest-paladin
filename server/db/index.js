// setup connection with PostgresSQL database using the pg library
const { Pool } = requires("pg");

// use environment variables for credentials
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDB,
    password: process.env.PGPASS,
    port: process.env.PGPORT,
});

module.exports = {
    query: (text, params) => pool.query(text,params),
};