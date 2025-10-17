const { pgPool } = require('../config/database')

const eventService = require('./event');

class customerService {
    async getCustomerById(customerId) {
        const client = await pgPool.connect();
        try {
            const result = await client.query(
                'SELECT * FROM customers WHERE id = $1 AND is_merged = FALSE',
                [customerId]
            );
            return result.rows[0]
        } finally {
            client.release()
        }
    }

    async getUnifiedProfile(customerId) {
        const customer = await this.getCustomerById(customerId);
        if(!customer) return null

        const events = await eventService.getCustomerEvents(customerId);
        const eventStats = this.calculateEventStats(events);

        const profile = {
            customer: {
                id: customer.id,
                name: customer.name,
                email: customer.email,
                created_at: customer.created_at,
                updated_at: customer.updated_at
            },
            event_summary: eventStats,
            recent_events: events.slice(0, 10)
        };
        return profile
    }

    calculateEventStats(events) {
        const stats = {
            total_events: events.length,
            event_types: {},
            sources: {},
            first_event: events.length > 0 ? events[events.length - 1].timestamp : null,
            last_event: events.length > 0 ? events[0].timestamp : null
        };

        events.forEach(event => {
            stats.event_types[event.event_type] = (stats.event_types[event.event_type] || 0) + 1;
            stats.sources[event.source] = (stats.sources[event.source] || 0) + 1;
        });

        return stats;
    }

    async mergeCustomers(primaryId, secondaryId){
        const client = await pgPool.connect();

        try {
            await client.query('BEGIN');

            const primary = await this.getCustomerById(primaryId);
            const secondary = await this.getCustomerById(secondaryId);

            if(!primary) throw new Error(`Primary customer ${primaryId} not found`)
            if(!secondary) throw new Error(`Primary customer ${primaryId} not found`)

            await client.query(
                'UPDATE customers SET is_merged = TRUE, merged_into = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [primaryId, secondaryId]
            );

            const mergeData = {
                name: primary.name || secondary.name,
                email: primary.email || secondary.email
            }

            await client.query(
                'UPDATE customers SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
                [mergeData.name, mergeData.email, primaryId]
            )

            await client.query('COMMIT');

            await eventService.updateCustomerIdForEvents(secondaryId, primaryId);

            return {
                primary_customer_id: primaryId,
                secondary_customer_id: secondaryId,
                message: `Customers merged succesfully`
            }
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release()
        }
    }

    async createCustomer(customerData){
        const client = await pgPool.connect();
        try {
            const result = await client.query(
                'INSERT INTO customers (id, name, email) VALUES ($1, $2, $3) RETURNING *',
                [customerData.id, customerData.name, customerData.email]
            )

            return result.rows[0];
        } finally {
            client.release();
        }
    }
}

module.exports = new customerService();
