const Joi = require("joi");

const commenValidatorSchema = Joi.object({
    comment: Joi.string().regex(/^[a-zA-Z0-9 :,().'"]{1,500}$/)
})

module.exports.createSuccessObject = (msg) => {
    return {
        success: true,
        message: msg
    }
}

module.exports.createErrorObject = (msg) =>{
    return {
        success: false,
        message: msg
    }
}

module.exports.validateComment = (cmnt) => {
    return commenValidatorSchema.validate({
        comment: cmnt
    })
}