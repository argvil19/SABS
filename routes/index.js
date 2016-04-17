var entriesRoutes = require('./entries/routes');
var userRoutes = require('./users/routes');
var handleRes = require('./response/handleRes');
var restrictedRoutes = require('./restricted/restrict');


module.exports = function(app, passport) {
    
    userRoutes(app, passport);
    
    entriesRoutes(app);
    
    restrictedRoutes(app);
    
};