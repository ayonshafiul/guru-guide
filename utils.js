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