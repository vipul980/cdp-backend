const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    customer_id: {
        type: String,
        required: true,
        index: true
    },
    source: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'crm', 'api']
    },
    event_type: {
        type: String,
        required: true,
        index: true
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    }
}, {
    timestamps: true
})

eventSchema.index({customer_id: 1, timestamp: -1});

module.exports = mongoose.model('Event', eventSchema)