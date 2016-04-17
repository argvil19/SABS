var sendErr = require('./response/handleRes');

module.exports = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    sendErr(res, 403, 'Unauthorized', true);
}