const express = require('express');
const router = express.Router();
const { validateEvent } = require('../middleware/validation');
const eventService = require('../services/event')


router.post('/ingest', validateEvent, async (req, res) => {
    try {
        console.log("ingest event")
        const event = await eventService.ingestEvent(req.body);
        res.status(201).json({
            success: true,
            message: 'Event ingested successfully',
            event_id: event._id
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;