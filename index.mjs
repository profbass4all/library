import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import bodyParser from 'body-parser';
import { sequelize } from './config/sequelize.mjs';
import Book from './models/books.mjs'
import BookRouter from './Routes/index.mjs'
import rateLimit from 'express-rate-limit';
import swaggerUI from 'swagger-ui-express'
import apidocs from './apidocs.json' assert { type: 'json' };
const app = express()
const port =  process.env.PORT || 3000

async function connect(){
    try {
        await sequelize.authenticate();
        Book.sync();
        console.log('Database connected successfully');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
connect()

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again after a minutes',
    headers: true, 
    handler: (req, res) => {
        res.status(429).json({
            message: 'Too many requests, please try again later.',
            retryAfter: req.rateLimit.resetTime, 
        });
    }
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(limiter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(apidocs));
app.use('/api/v1', BookRouter)

app.get('/', (req, res) => {
    res.send('Hello, World!...Welcome to my library!');
})