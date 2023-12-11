// dotenv
require('dotenv').config();

// Winston
const Winston = require("./config/winston");

// Error capture
const Uncaught = require('uncaught');
Uncaught.start();
Uncaught.addListener((err) =>
{
    Winston.error("Uncaught error.", err);
});

// Express
const Express = require('express');
const app = Express();
app.use(Express.json({ limit: '25kb' }));

// Cors
const cors = require('cors');
const corsOptions = {
    exposedHeaders: '*',
};
app.use(cors(corsOptions));

// static 
app.use(Express.static('static'));

// Database
const Context = require('./Context');
const context = new Context();
context.init();

// api routes
app.use('/', require('./route/route'));

// start server
const port = process.env.server_port;
app.listen(port, async () =>
{
    Winston.info(`Server listening on port ${port}`);
});