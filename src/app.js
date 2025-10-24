require('dotenv').config();
const express = require('express');
const { connectMongoDB, initPostgresScehma } = require('./config/database');

const eventsRouter = require('./routes/event');
const customerRouter = require('./routes/customer');

const app = express();

app.use(express.json());

//test
app.use('/events', eventsRouter);
app.use('/customers', customerRouter);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectMongoDB();
        await initPostgresScehma();
        
        app.listen(PORT, () => {
            console.log(`CDP server running on port ${PORT}`)
        })
    } catch (err) {
        console.error('Failed to start the server')
        process.exit(1)
    }
};

startServer()