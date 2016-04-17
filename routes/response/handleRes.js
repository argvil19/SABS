module.exports = function(res, code, message, isError) {
    
    /* For handling responses */
    
    return res.status(code).send({
        message:message,
        error:isError
    });
};