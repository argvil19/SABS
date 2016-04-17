var handleRes = require('../response/handleRes');

module.exports = function(app) {
    
    app.get('/templates/adm_templates/*', function(req, res, next) {
        if (req.isAuthenticated() && req.user.userLevel === 2) {
            return next();
        }
        return handleRes(res, 403, 'Unauthorized', true);
    });
    
};