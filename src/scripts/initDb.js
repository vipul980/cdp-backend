require('dotenv').config()

const { pgPool, connectMongoDB, initPostgresScehma } = require('../config/database')
const customerService = require('../services/customer')

const initDatabase = async () => {
    console.log('Initializing database with sample data')

    try {

        await connectMongoDB();

        await initPostgresScehma();

        const customers = [
            {
                id: 'C001', name: 'Test1', email: 'test1@gmail.com'
            },
            {
                id: 'C002', name: 'Test2', email: 'test2@gmail.com'
            },
            {
                id: 'C003', name: 'Test3', email: 'test3@gmail.com'
            }
        ]

        for (const customer of customers){
            try {
                await customerService.createCustomer(customer);
                console.log(`customer created ${customer.id}`)
            } catch (err) {
                console.log(err)
            }
        }
        console.log('DB init complete')
    } catch (err) {
        process.exit(1)
    }
}

initDatabase()
