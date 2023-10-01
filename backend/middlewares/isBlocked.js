const User = require("../models/user");

const isBlocked = async (req, res, next) => {
    console.log(req.user, 'isblocked-->>');
    try {
        const { email } = req.user;
        if (!email) {
            const error = {
                status: 403,
                message: 'unauthenticated',
            }
            return next(error);
        }

        const userBlocked = await User.findOne({ email: email })
        if (userBlocked.isBlocked === true) {
            const error = {
                status: 403,
                message: 'access denied',
            }
            return next(error);
        }

        next();

    } catch (error) {
        return next(error);
    }
}

module.exports = isBlocked;