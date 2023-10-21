const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { SALT_NO, BASE_URL } = require("../config/index");
const JWTService = require("../services/JWTService");
const Joi = require("joi");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../services/sendEmail");
const resetPassword = require("../models/resetPassword");


const PASSWORDPATTREN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const mongodbIdPattern = /^[0-9a-fA-F]{24}$/;

const authController = {

    // @desc Create new User account
    // @route /api/register
    // @access public
    async register(req, res, next) {
        const userRegisterSchema = Joi.object({
            firstName: Joi.string().max(25),
            lastName: Joi.string().max(25),
            email: Joi.string().email().required(),
            phone: Joi.number(), // .min(11).max(13).required(), // error
            password: Joi.string().pattern(PASSWORDPATTREN).message('Password must be at least Captical, lower and a number').required(),
            confirmPassword: Joi.ref('password')
        })

        const { error } = userRegisterSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        try {
            const { firstName, lastName, email, phone, password } = req.body;

            const emailInUse = await User.exists({ email });
            if (emailInUse) {
                const error = {
                    status: 409,
                    message: 'Email already in use'
                }
                return next(error);
            }

            const phoneInUse = await User.exists({ phone });
            if (phoneInUse) {
                const error = {
                    status: 409,
                    message: 'Number already in use'
                }
                return next(error);
            }

            const hashedPassword = await bcrypt.hash(password, Number(SALT_NO));

            const user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            })

            const accessToken = JWTService.signAccessToken({ _id: user._id })
            const refreshToken = JWTService.signRefreshToken({ _id: user._id })

            await JWTService.storeRefreshToken(user._id, refreshToken);

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });

            res.status(201).send({ user: user, auth: true, message: 'User register successfully' })
        } catch (error) {
            return next(error)
        }
    },

    // @desc user Login Controller
    // @route /api/login
    // @access public
    async login(req, res, next) {
        const userLoginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        })

        const { error } = userLoginSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                const error = {
                    status: 401,
                    message: 'Invalid email address'
                }
                return next(error);
            }
            if (user.isBlocked === true) {
                const error = {
                    status: 401,
                    message: 'Access Denied User is Blocked'
                }

                return next(error);
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                const error = {
                    status: 401,
                    message: 'invalid credentials'
                }
                return next(error);
            }

            const accessToken = JWTService.signAccessToken({ _id: user._id });
            const refreshToken = JWTService.signRefreshToken({ _id: user._id });

            await JWTService.updateRefreshToken(user._id, refreshToken)

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });

            res.status(200).json({ user: user, auth: true, message: 'User Loggedin successfully' })
        } catch (error) {
            return next(error);
        }

    },

    // @desc user admin-login Controller
    // @route /api/admin-login
    // @access private
    async adminLogin(req, res, next) {
        try {
            const { email, password } = req.body;

            const adminUser = await User.findOne({ email: email });
            if (adminUser.isBlocked === true) {
                const error = {
                    status: 401,
                    message: 'User is Blocked by Admin'
                }

                return next(error);
            }
            if (adminUser.role !== 'admin') {
                const error = {
                    status: 401,
                    message: 'unauthorized',
                }
                return next(error);
            }

            const match = await bcrypt.compare(password, adminUser.password);
            if (!match) {
                const error = {
                    status: 401,
                    message: 'password not match'
                }
                return next(error);
            }

            const accessToken = JWTService.signAccessToken({ _id: adminUser._id });
            const refreshToken = JWTService.signRefreshToken({ _id: adminUser._id });

            await JWTService.updateRefreshToken(adminUser._id, refreshToken);

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });


            res.status(200).json({ user: adminUser, auth: true, message: 'Successfully login' })

        } catch (error) {
            return next(error);
        }
    },

    // @desc user logout Controller
    // @route /api/logout
    // @access private
    async logout(req, res, next) {

        try {
            const { refreshToken } = req.cookies;

            await JWTService.deleteRefreshToken(refreshToken);

            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            res.status(200).json({ user: null, auth: false });
        } catch (error) {
            return next(error);
        }
    },

    // @desc user Login Controller
    // @route /api/refresh
    // @access private
    async refresh(req, res, next) {
        try {
            const orginialRefreshToken = req.cookies.refreshToken;

            // verify that the refresh token is valid
            const id = await JWTService.verifyRefreshToken(orginialRefreshToken)._id;
            if (!id) {
                const error = {
                    status: 401,
                    message: 'unauthorized'
                }
                return next(error);
            }
            // match (verified token) orginial refresh token with database token
            const match = Token.findOne({
                _id: id,
                token: orginialRefreshToken
            })
            if (!match) {
                const error = {
                    status: 401,
                    message: 'unauthorized'
                }
                return next(error);
            }

            // generate new tokens
            const accessToken = JWTService.signAccessToken({ _id: id });
            const refreshToken = JWTService.signRefreshToken({ _id: id });

            // update token
            await JWTService.updateRefreshToken(id, refreshToken);

            res.cookie("accessToken", accessToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
            });

            const user = await User.findById({ _id: id });

            if (user.isBlocked === true) {
                const error = {
                    status: 401,
                    message: 'User Blocked'
                }
                return next(error);
            }

            return res.status(200).json({ user: user, auth: true });

        } catch (error) {
            return next(error);
        }
    },

    // @desc Reset Password
    // @route /api/forget-pssword-token
    // @access public
    async forgetPasswordToken(req, res, next) {

        const forgetPasswordSchema = Joi.object({
            email: Joi.string().email().required()
        })
        const error = forgetPasswordSchema.validate(req.body).error;

        if (error) {
            return next(error);
        }

        const { email } = req.body;

        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                const error = {
                    status: 404,
                    message: 'invalid email'
                }
                return next(error);
            }
            const alreadyHaveToken = await resetPassword.findOne({ userId: user._id });
            if (alreadyHaveToken) {
                await resetPassword.deleteOne();
            }

            // generate token for reset password
            const token = crypto.randomBytes(32).toString('hex');
            const passwordResetToken = crypto.createHash('sha256').update(token).digest("hex");

            const passwordResetExpires = Date.now() + 5 * 60 * 1000;

            const resetURL = `http://localhost:3000/resetPassword?token=${passwordResetToken}&id=${user._id}`;

            await resetPassword.create({ passwordResetToken, passwordResetExpires, userId: user._id });

            const data = {
                to: user.email,
                text: `Hey ${user.firstName}`,
                subject: `Password Reset Request`,
                htm: resetURL
            }

            sendEmail(data);

            res.status(200).json({ message: 'request for password reset successful' })

        } catch (error) {
            return next(error);
        }
    },

    // @desc Reset Password
    // @route /api/reset-password
    // @access private
    async resetPassword(req, res, next) {
        const changePasswordSchema = Joi.object({
            password: Joi.string().pattern(PASSWORDPATTREN).message('Password must be at least Captical, lower and a number').required(),
            confirmPassword: Joi.ref('password')
        })

        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const { token, id } = req.query;
            const { password } = req.body;

            const user = await User.findOne({ _id: id });
            if (!user) {
                const error = {
                    status: 401,
                    message: 'unauthorized',
                }
                return next(error);
            }

            const verifedToken = await resetPassword.findOne({
                passwordResetToken: token,
                passwordResetExpires: { $gt: Date.now() }
            })
            if (!verifedToken) {
                const error = {
                    status: 409,
                    message: "Invalid token or expired"
                }
                return next(error);
            }

            const hashedPassword = await bcrypt.hash(password, Number(SALT_NO));

            await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });

            await resetPassword.findOneAndDelete({ userId: id });

            res.status(200).json({ message: 'Password reset successfully' })

        } catch (error) {
            return next(error);
        }

    },


    // @desc block
    // @route /api/user/block/:id
    // @access private
    async blockUser(req, res, next) {
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = getByIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        try {
            const { id } = req.params;

            await User.findByIdAndUpdate(id, {
                isBlocked: true
            }, {
                new: true
            });

            res.status(200).send({ message: 'user successfully blocked' })

        } catch (error) {
            return next(error);
        }
    },

    // @desc Unblock
    // @route /api/user/unblock/:id
    // @access private
    async unblockUser(req, res, next) {
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = getByIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        try {
            const { id } = req.params;

            await User.findByIdAndUpdate(id, {
                isBlocked: false
            },
                {
                    new: true
                });

            res.status(200).send({ message: 'user successfully unblocked' })

        } catch (error) {
            return next(error);
        }

    },

    // @desc change User Password
    // @route /api/users/change-password
    // @access private
    async changePassword(req, res, next) {
        const changePasswordSchema = Joi.object({
            oldPassword: Joi.string().required(),
            password: Joi.string().pattern(PASSWORDPATTREN).message('Password must be at least Captical, lower and a number').required(),
            confirmPassword: Joi.ref('password')
        })

        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const { _id } = req.user;
            const { oldPassword, password } = req.body;

            const user = await User.findById({ _id: _id });

            if (!user) {
                const error = {
                    status: 401,
                    message: 'unauthorized',
                }
                return next(error);
            }

            const comparePassword = await bcrypt.compare(oldPassword, user.password);

            if (comparePassword) {

                const hashPassword = await bcrypt.hash(password, Number(SALT_NO));

                await User.findByIdAndUpdate(_id, { password: hashPassword });

                res.status(200).json({ message: 'Password changed' })
            } else {
                const error = {
                    status: 401,
                    message: 'invalid password'
                }
                return next(error);
            }

        } catch (error) {
            return next(error);
        }
    },

    // @desc Get All Users with Information
    // @route /api/users/all
    // @access private
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find({}).sort({ $natural: -1 });
            if (!users) {
                const error = {
                    status: 404,
                    message: 'User not found'
                }
                return next(error);
            }
            res.status(200).json({ user: users });
        } catch (error) {
            return next(error);
        }
    },

    // @desc Get Users by Id's with Information
    // @route /api/users/all
    // @access private
    async getUserById(req, res, next) {
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongodbIdPattern).required(),
        });

        const { error } = getByIdSchema.validate(req.params);

        if (error) {
            return next(error);
        }

        try {
            const id = req.params.id;
            const user = await User.findById(id);
            if (!user) {
                const error = {
                    status: 404,
                    message: 'User not found'
                }
                return next(error);
            }
            res.status(200).send({ user: user });
        } catch (error) {
            return next(error);
        }
    },


}

module.exports = authController;