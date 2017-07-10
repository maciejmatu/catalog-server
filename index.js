/**
 * @h1 Catalog Project REST Api
 *
 * @desc This is documentation of the REST Api designed for Catalog project.
 */
const express = require('express');
//const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config/main');
const router = require('./router');
const app = express();

/* SERVER */
const server = app.listen(config.port);
console.log(`Server running on port ${server.address().port}.`);

/* DATABASE */
mongoose.connect(config.database);

/* MIDDLEWARE  */
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Enable CORS from client-side
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.clientURL);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

/* ROUTER */
router(app);