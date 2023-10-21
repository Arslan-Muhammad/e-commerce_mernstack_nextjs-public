const User = require("../models/user");

const isAdmin = async (req, res, next) => {
    
    try {
        const {email} = req.user;
        if(!email) {
            const error = {
              status: 401,
              message: 'unauthenticated',  
            }
            return next(error);
        }

        const admin = await User.findOne({ email: email})
        if(admin.role !== 'admin') {
            const error = {
                status: 401,
                message: 'access denied', 
            }
            return next(error);
        }

        next();

    } catch (error) {
        return next(error);
    }
}

module.exports = isAdmin;