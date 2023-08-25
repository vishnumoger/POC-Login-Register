const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var ObjectId = require('mongodb').ObjectId;
const net = require('net');

const { sendResponse, sendError } = require('../helpers/utils');
const { loginSchema, userSignupSchema } = require('../schemas/user.schema');
const User = require('../models/user.model');
const { sign, getUserId } = require('../services/jwt');
const generateAndSaveOtp = require('../services/otpService');
const ChargerBooking = require('../models/chargerbooking.model');
const IoT = require('../models/Iot.model');
const ChargeTransaction = require('../models/chargerTransaction.model');

router.get('/', async (req, res) => {
    res.send("Server started at 4000")
})

/*Agency registration*/
router.post('/registration', async (req, res) => {
    try {
        const { error } = userSignupSchema.validate(req.body);
        if (error) {
          return sendError(res, error.message);
        }
        const userExists = await User.exists({
          username: req.body.username,
        }).exec();
        if (userExists) {
          sendError(res, 'A user with that username already exists');
        } else {
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(req.body.password, salt);
          const user = new User(req.body);
          user.password = passwordHash;
          const SavedData = await user.save();

          return sendResponse(res, { "_id": SavedData._id,  "message": "User registered successfully"});
        }
      } catch (error) {
        sendError(res, error.message);
      }
})

/*Agency login*/
router.post('/login', async (req, res, next) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return sendError(res, error.message);
      }
      const user = await User.findOne({ username: req.body.username }).exec();
      if (!user) {
        return sendError(
          res,
          'User Account does not exists Please check your credentials and try again'
        );
      }
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      
      if (!validPassword) {
        return sendError(res, 'Incorrect password. Please check your password and try again');
      }
      const resp = {
        token: sign({ id: user._id }),
        username: user.username,
        email: user.email,
        role: user.role,
        id: user._id,
      };
      sendResponse(res, resp);
    } catch (error) {
      sendError(res, error.message);
    }
  });

// get Charger Booking details (IsBooked = TRUE)
router.get('/chargerBooking', async (req, res, next) => {
    try {
      const user = getUserId(req.headers.authorization);
      if (user.id) {
        const getAllChargerBooking = await ChargerBooking.find(
          {
          $and: [
            {"isBooked": true},
            {"startTime" : { $gte : new Date() }}
          ]
          },
          {"_id":0, "iotId":1, "startTime":1, "endTime":1, "bookingDuration":1, "isBooked":1}
          ).exec();
        console.log(getAllChargerBooking);

        if (!getAllChargerBooking) {
          return sendError(res, 'No bookings found', 404);
        } else {
          return sendResponse(res, getAllChargerBooking);
        }
      } else {
        sendError(res, 'User not found');
      }
    } catch (error) {
      sendError(res, error.message);
    }
  });


//create Charger Booking
router.post('/chargerBooking', async (req, res, next) => {
    try {
      const user = getUserId(req.headers.authorization);
      if (user.id) {

        const { iotId, userId, bookingDuration } = req.body;

        const startTime = new Date(req.body.startTime)
        const endTime = new Date(req.body.endTime)

        const otpDoc = await generateAndSaveOtp();
        //console.log(otpDoc)

        const newChargerBooking = new ChargerBooking({
            iotId,
            userId,
            startTime, 
            endTime, 
            bookingDuration, 
            isBooked: true,
            uniqueCode: otpDoc,
            isOTPVerified: false
        });

        const savedChargerBooking= await newChargerBooking.save();
        //console.log(savedChargerBooking);
        return sendResponse(res, savedChargerBooking);
        
      } else {
        sendError(res, 'User not found');
      }
    } catch (error) {
      sendError(res, error.message);
    }
  });

  // get all IoT devices
router.get('/getAllIoTDevices', async (req, res, next) => {
  try {
    const user = getUserId(req.headers.authorization);
    if (user.id) {
      const getAllIoT = await IoT.find().exec();
      console.log(getAllIoT);

      if (!getAllIoT) {
        return sendError(res, 'No IoT found', 404);
      } else {
        return sendResponse(res, getAllIoT);
      }
    } else {
      sendError(res, 'User not found');
    }
  } catch (error) {
    sendError(res, error.message);
  }
});

//for otp verification
router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;
  try {
    const verifyOtp = await ChargerBooking.findOne({
      otp,
      isOTPVerified: false,
    });
    console.log(verifyOtp)

    if (!verifyOtp) {
      return sendError(res, 'Invalid OTP');
    }
    verifyOtp.isOTPVerified = true;
    await verifyOtp.save();
    return sendResponse(res, 'OTP verified successfully');
  } catch (error) {
    sendError(res, error.message);
  }
});

//startCharging
router.post('/startCharging', async (req, res) => {
  const { bookingId } = req.body;
  try {
    const BookingIdObject = ObjectId(bookingId);

    const getTransactionDetails = await ChargeTransaction.findOne({
      bookingId: BookingIdObject,
      chargingStatus: "success"
    });

    if (getTransactionDetails) {
      return sendResponse(res, { "transaction_id": getTransactionDetails._id, "chargingStatus": getTransactionDetails.chargingStatus,  "message": "Charging already Started"});
    }
    const getBookingDetails = await ChargerBooking.findOne({
      _id: bookingId,
      isOTPVerified: true,
    });
    console.log(getBookingDetails)

    if (!getBookingDetails) {
      return sendError(res, 'Booking not found');
    }
      const newChargeTransaction = new ChargeTransaction({
        bookingId,
        iotId: getBookingDetails.iotId,
        userId: getBookingDetails.userId,
        startTime: getBookingDetails.startTime,
        endTime: getBookingDetails.endTime,
        bookingDuration: getBookingDetails.bookingDuration,
        chargingStatus: "success"
    });

    const savedChargeTransaction= await newChargeTransaction.save();

    return sendResponse(res, { "transaction_id": savedChargeTransaction._id, "chargingStatus": savedChargeTransaction.chargingStatus,  "message": "Charger started successfully"});
  } catch (error) {
    sendError(res, error.message);
  }
});

router.get('/startCharging/CHARGEON', async (req, res) => {
  try {
    console.log('CHARGEON')
    const server = net.createServer(socket => {

      const remoteAddress = socket.remoteAddress;
      const remotePort = socket.remotePort
    
      console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);
    
      socket.write('REQ_IoTID:');
    
      let iotId;
    
      socket.on('data', data => {
    
        const input = data.toString().trim();
        console.log(input);
    
        if (input.includes("IOTID")) {
            const iotidPattern = /IOTID:(\d{5})/;
            const matches = input.match(iotidPattern);
            if (matches) {
                const iotId = parseInt(matches[1]);
                console.log(`Received IoT ID: ${iotId}`);
                socket.write('CHARGERON');
            }
        }
      });
    
      socket.on('end', () => {
        console.log(`IoT device ${iotId} disconnected`);
      });
    
      socket.on('error', err => {
        console.log(`Error with IoT device ${iotId}: ${err.message}`);
      });
    });
    res.send("CHARGE ON")
  } catch (error) {
    sendError(res, error.message);
  }
})

router.get('/startCharging/CHARGEOFF', async (req, res) => {
  try {
    console.log('CHARGEOFF')
    const server = net.createServer(socket => {

      const remoteAddress = socket.remoteAddress;
      const remotePort = socket.remotePort
    
      console.log(`IoT device connected: ${remoteAddress}:${remotePort}`);
    
      socket.write('REQ_IoTID:');
    
      let iotId;
    
      socket.on('data', data => {
    
        const input = data.toString().trim();
        console.log(input);
    
        if (input.includes("IOTID")) {
            const iotidPattern = /IOTID:(\d{5})/;
            const matches = input.match(iotidPattern);
            if (matches) {
                const iotId = parseInt(matches[1]);
                console.log(`Received IoT ID: ${iotId}`);
                socket.write('CHARGEROFF');
            }
        }
      });
    
      socket.on('end', () => {
        console.log(`IoT device ${iotId} disconnected`);
      });
    
      socket.on('error', err => {
        console.log(`Error with IoT device ${iotId}: ${err.message}`);
      });
    });
    res.send("CHARGE OFF")
  } catch (error) {
    sendError(res, error.message);
  }
})

module.exports = router;