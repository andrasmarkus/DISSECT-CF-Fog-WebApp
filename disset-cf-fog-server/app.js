const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const configRoute = require('./api/routes/configuration.routes');
const authorizationRoute = require('./api/routes/auth.routes');
const userRoute = require('./api/routes/user.routes');
const propertiesRoute = require('./api/routes/porperties.routes');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Access-Token, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/auth', authorizationRoute);
app.use('/user', userRoute);
app.use('/configuration', configRoute);
app.use('/properties', propertiesRoute);

/* Error message when the response not found */
app.use((req, res, next) => {
    const error = new Error('Not found');
    next(error);
});

/* Error message about any other errors */
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message:error.message,
            line: error.stack
        }
    })
});

const db = require("./models");

db.sequelize.sync();

module.exports = app;
