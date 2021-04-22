module.exports = (req, res, next) =>{
    if(req.userRole != "admin"){
        const error = new Error('You are not allowed to enter this route.');
        error.statusCode = 403;
        throw error;
    }
    next();
}