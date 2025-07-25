
module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //save the redirect url based on user navigation
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create or edit listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}