require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;
const SALT_NO = process.env.SALT_NO;
const NODE_ENV = process.env.NODE_ENV;
const GMAIL_ID = process.env.GMAIL_ID;
const GP = process.env.GP;
const BASE_URL = process.env.BASE_URL;
const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;

module.exports = { PORT, MONGODB_URL, SALT_NO, NODE_ENV, GMAIL_ID, GP, BASE_URL, CLOUD_NAME, API_KEY, API_SECRET };