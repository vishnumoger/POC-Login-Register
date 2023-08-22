const { Schema, model } = require('mongoose');

const chargerbookingSchema = new Schema(
  {
    iotId: { type: Schema.Types.ObjectId, ref: 'IOT' },
    chargerId: { type: Schema.Types.ObjectId, ref: 'Charger' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    isBooked: { type: Boolean, required: true },
  },
  { timestamps: true, versionKey: false }
);

const ChargerBooking = model('chargerBooking', chargerbookingSchema);

module.exports = ChargerBooking;
