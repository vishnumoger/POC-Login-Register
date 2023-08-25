const { Schema, model } = require('mongoose');

const chargerTransactionSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'chargerBooking' },
    iotId: { type: Schema.Types.Number, ref: 'IOT' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    bookingDuration : { type: Number, required: true },
    chargingStatus: { type: String, required: true}
  },
  { timestamps: true, versionKey: false }
);

const ChargerTransaction = model('chargerTransaction', chargerTransactionSchema);

module.exports = ChargerTransaction;
