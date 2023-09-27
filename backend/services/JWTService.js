const jwt = require('jsonwebtoken');
const Token = require('../models/token');
const SECRET_ACCESS_TOKEN = "mrzahidfaiz";
const SECRET_REFRESH_TOKEN = "mrzahidfaiz123";

class JWTSevice {
    static signAccessToken(payload) {
        return jwt.sign(payload, SECRET_ACCESS_TOKEN, { expiresIn: '30m' })
    }
    static signRefreshToken(payload) {
        return jwt.sign(payload, SECRET_REFRESH_TOKEN, { expiresIn: '60m' })
    }
    static verifyAccessToken(token) {
        return jwt.verify(token, SECRET_ACCESS_TOKEN)
    }
    static verifyRefreshToken(token) {
        return jwt.verify(token, SECRET_REFRESH_TOKEN)
    }
    static async storeRefreshToken(userId, token) {
        try {
            await Token.create({ userId, token });
        } catch (error) {
            console.error(error, 'Token Store Error');
        }
    }
    static async updateRefreshToken(userId, token) {
        try {
            await Token.updateOne({ _id: userId }, { token: token }, { upsert: true });
        } catch (error) {
            console.error(error, 'Token update Error');
        }
    }
    static async deleteRefreshToken(token) {
        try {
            await Token.deleteOne({token: token});
        } catch (error) {
            console.error(error, 'Token delete Error');
        }
    }
}

module.exports = JWTSevice;