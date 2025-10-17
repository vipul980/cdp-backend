const express = require('express');
const router = express.Router();
const { validateMerge } = require('../middleware/validation');
const customerService = require('../services/customer');


router.get('/:id', async (req, res) => {
    try {
        const profile = await customerService.getUnifiedProfile(req.params.id)
        if(!profile) {
            res.status(404).json({
                success: false,
                error: 'Customer not found'
            });
        }
        res.json({
            success: true,
            data: profile
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        })
    }
})

router.post('/merge', validateMerge, async(req, res) => {
    try {
        const { primary_customer_id, secondary_customer_id } = req.body
        const result = await customerService.mergeCustomers(primary_customer_id, secondary_customer_id)
        res.json({
            success: true,
            data: result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router