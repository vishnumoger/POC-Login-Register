const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const { sendResponse, sendError } = require('../helpers/utils');
const { loginSchema, userSignupSchema } = require('../schemas/user.schema');
const User = require('../models/user.model');
const { sign, getUserId } = require('../services/jwt');
const ChargerBooking = require('../models/chargerbooking.model');

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
      const user = await User.findOne({ name: req.body.username }).exec();
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

// get Charger Booking details
router.get('/chargerBooking', async (req, res, next) => {
    try {
      const user = getUserId(req.headers.authorization);
      if (user.id) {
        const getAllChargerBooking = await ChargerBooking.find().exec();
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


// Send Charger Booking details
router.post('/chargerBooking', async (req, res, next) => {
    try {
      const user = getUserId(req.headers.authorization);
      if (user.id) {

        const { iotId, chargerId, userId, userName, startTime, endTime, isBooked } = req.body;

        const bookingDate = new Date(req.body.bookingDate)

        const newChargerBooking = new ChargerBooking({
            iotId,
            chargerId,
            userId,
            userName, bookingDate, startTime, endTime, isBooked
        });

        const savedChargerBooking= await newChargerBooking.save();
        console.log(savedChargerBooking);
        return sendResponse(res, savedChargerBooking);
        
      } else {
        sendError(res, 'User not found');
      }
    } catch (error) {
      sendError(res, error.message);
    }
  });

module.exports = router;