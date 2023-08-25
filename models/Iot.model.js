const { Schema, model } = require('mongoose');

const IoTSchema = new Schema(
  {
    iotId: { type: Number },
  }
);

const IoT = model('iot', IoTSchema);

module.exports = IoT;
