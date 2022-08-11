const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => {
    return {
        type: 'string',
        base: joi.string(),
        messages: {
            'string.escapeHTML': 'hehe try to hack again'
        },
        rules: {
            escapeHTML: {
                validate(value, helpers) {
                    const cleanText = sanitizeHtml(value)
                    if (cleanText === value) {
                        return value
                    }
                    return helpers.error('string.escapeHTML', {
                        value
                    })
                }
            }
        }
    }
}

const Joi = BaseJoi.extend(extension)

const campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .required().escapeHTML(),

        // image: Joi.string()
        //     .required(),

        price: Joi.number()
            .required()
            .min(0),

        description: Joi.string()
            .required().escapeHTML(),

        location: Joi.string()
            .required().escapeHTML()
    }).required(),
    deleteImgs: Joi.array().items(Joi.string())
})

const reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string()
            .required().escapeHTML(),
        rating: Joi.number()
            .required()
            .min(1)
            .max(5)
    }).required()
})

module.exports.campgroundSchema = campgroundSchema
module.exports.reviewSchema = reviewSchema