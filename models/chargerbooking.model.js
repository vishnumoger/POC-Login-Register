const { Schema, model } = require('mongoose');

const chargerbookingSchema = new Schema(
  {
    iotId: { type: Schema.Types.ObjectId, ref: 'IOT' },
    chargerId: { type: Schema.Types.ObjectId, ref: 'Charger' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },
    bookingDuration: { type: Number, required: true },
    isBooked: { type: Boolean, required: true },
    uniqueCode: { type: String, required: true }
  },
  { timestamps: true, versionKey: false }
);

const ChargerBooking = model('chargerBooking', chargerbookingSchema);

module.exports = ChargerBooking;
