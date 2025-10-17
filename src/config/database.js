require('dotenv').config({ path: require('path').join(__dirname, '../../.env')});
const { Pool } = require('pg')
const mongoose = require('mongoose')

//PostgreSQL connection
const pgPool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30000
})

console.log("PROCESS ENV", process.env.MONGO_URI)

pgPool.on('connect', () => {
    console.log(' PostgreSQL connected');
})

pgPool.on('error', (err) => {
    console.error('PotgreSQL error:', err);
})

// MongoDB connection
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected")
    } catch (err) {
        console.error('MongoDB connection error: ', err)
        process.exit(1);
    }
}

const initPostgresScehma = async () => {
    const client = await pgPool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS customers (
            id VARCHAR(100) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_merged BOOLEAN DEFAULT FALSE,
            merged_into VARCHAR(100) REFERENCES customers(id)
           );

           CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
           CREATE INDEX IF NOT EXISTS idx_customers_mergedinto ON customers(merged_into); 
        `);
        console.log('PostgreSQL schema created')
    } catch (err) {
        console.error('PostgreSQL schema initialization failed: ', err)
    } finally {
        client.release()
    }
}

module.exports = {
    pgPool,
    connectMongoDB,
    initPostgresScehma
}
