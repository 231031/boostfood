import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import router from './router/route.js';

const app = express();

import {connect} from './database/conn.js';
// middleware
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

// HTTP Get Request
app.get('/', (req,res) => {
    res.status(201).json('Home Get Request');
})

app.use('/seller', router);

// start server only when have valid connection
connect().then(() => {
    try {
        const port = 8000;
        app.listen(port, () => {
        console.log('listening on port ' + port);
        })

    } catch (error) {
        console.log('Cannot connect to server' + error.message);
    }
}).catch(error => {
    console.log('Invalid database connection: ' + error.message);
})

// start server
