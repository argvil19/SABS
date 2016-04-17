var handleRes = require('../response/handleRes');

module.exports = function(app, passport) {
    
    /* Handling login requests */
    
    app.post('/login', passport.authenticate('local-login'), function(req, res) {
        return res.send(req.user);
    });
    
    /* Handling signup requests */
    
    app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
        return res.send(req.user);
    });
    
    app.get('/isAuth', function(req, res) {
        if (req.isAuthenticated())
            return res.send(req.user);
        return handleRes(res, 403, 'Unauthorized', true);
    });
    
    app.get('/logout', function(req, res) {
        if (req.isAuthenticated()) {
            req.logout();
            return handleRes(res, 200, 'logged out', false);
        }
        return handleRes(res, 403, 'Unauthorized', true);
    });
    
};