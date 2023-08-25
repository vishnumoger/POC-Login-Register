const { Schema, model } = require('mongoose');

const chargerbookingSchema = new Schema(
  {
    iotId: { type: Schema.Types.Number, ref: 'IOT' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    bookingDuration: { type: Number, required: true },
    isBooked: { type: Boolean, required: true },
    uniqueCode: { type: String, required: true },
    isOTPVerified: { type: Boolean, required: true }
  },
  { timestamps: true, versionKey: false }
);

const ChargerBooking = model('chargerBooking', chargerbookingSchema);

module.exports = ChargerBooking;
