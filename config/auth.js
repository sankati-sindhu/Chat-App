module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated) {
            return next();
        }
        else{
            console.log("not logged");
            res.redirect('/users/login');
        }

    }
}