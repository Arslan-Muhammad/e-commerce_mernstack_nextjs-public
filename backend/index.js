const express = require('express');
const { PORT, NODE_ENV } = require('./config/index');
const db_connection = require('./database/connection');
const router = require('./routes/route');
const errorHandler = require('./middlewares/errorHandler');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors')

// express
const app = express();

// MongoDB Connection
db_connection();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

// Middlewares
// if (NODE_ENV === 'development') {
//     app.use(morgan('dev'));
//     console.log(`Mode: ${NODE_ENV}`);
// }
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser());
app.use(router);
app.use('*', (req, res, next) => {
    const error = {
        status: 404,
        message: `Not Found : ${req.originalUrl}`
    }
    next(error);
});

app.use(errorHandler);

// Connection
app.listen(PORT, () => {
    console.log(`App running in port: ${PORT}`);
})