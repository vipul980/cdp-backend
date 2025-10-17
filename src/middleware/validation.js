const Joi = require('joi');

const eventSchema = Joi.object({
    source: Joi.string().valid('web', 'mobile', 'crm', 'api'),
    customer_id: Joi.string().min(1).max(100).required(),
    event_type: Joi.string().min(1).max(100).required(),
    data: Joi.object().required(),
    timestamp: Joi.date().iso().required()
})

const validateError = (schema, req) => {
    const { error } = schema.validate(req.body);
    if(error){
        return res.status(400).json({ error: error.details[0].message })
    }
}

const validateEvent = (req, res, next) => {
    validateError(eventSchema, req)
    next()
}

const mergeSchema = Joi.object({
    primary_customer_id: Joi.string().required(),
    secondary_customer_id: Joi.string().required()
})

const validateMerge = (req, res, next) => {
    validateError(mergeSchema, req)
    if(req.body.primary_customer_id === req.body.secondary_customer_id){
        return res.status(400).json({ error: 'Cannot merge a customer with itself'})
    }
    next();
}


module.exports = {
    validateEvent, validateMerge
}