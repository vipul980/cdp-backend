const Event = require('../models/Event');

class EventSerice {
    async ingestEvent(eventData) {
        try {
            console.log("in EVENT")
            const event = new Event(eventData);
            await event.save();
            return event;
        } catch (err) {
            throw new Error('Event ingestion Failed: ', err.message)
        }
    }

    async getCustomerEvents(customerId, limit = 50){
        try {
            const events = await Event.find({ customer_id: customerId })
                .sort({ timestamp: -1 })
                .limit(limit)

            return events
        } catch (err) {
            throw new Error('Failed to fetch customer events ', err.message)
        }
    }

    async updateCustomerIdForEvents(oldId, newId){
        try {
            const result = await Event.updateMany(
                { customer_id: oldId },
                { $set: { customer_id: newId }}
            );

            return result.modifiedCount;
        } catch (err) {
            throw new Error('Failed to update events ', err.message)
        }
    }
}

module.exports = new EventSerice();