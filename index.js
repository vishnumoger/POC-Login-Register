const config = require('./config/development.json');
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(config.db.url + '/' + config.db.name, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error: ', err);
  });
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to', config.env);
  });

const app = express();
app.use(cors())
app.use(express.json());

const routes = require('./routes/index');

app.use('/api', routes)

app.listen(config.port, () => {
    console.log(`Server Started at ${config.port}`)
})