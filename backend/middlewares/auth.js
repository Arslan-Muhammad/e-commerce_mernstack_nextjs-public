const User = require("../models/user");
const JWTSevice = require("../services/JWTService");

const auth = async (req, res, next) => {
   
    try {
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken || !refreshToken) {
            const error = {
                status: 401,
                message: 'unauthorized'
            }
            return next(error);
        }
        

        const id = JWTSevice.verifyAccessToken(accessToken)._id;

        const user = await User.findById({ _id: id });

        req.user = user;

        next();

    } catch (error) {
        return next(error);
    }


}

module.exports = auth;