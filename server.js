const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// push notifications
const webpush = require('web-push');
// schedule push notifications
const schedule = require('node-schedule');

// routes
const users = require('./routes/api/users');

const app = express();

// add express session middleware:
app.use(
  session({
    secret: 'gruppe3',
    saveUninitialized: false,
    resave: false,
  })
);

// use the json middleware for HTTP requests; to access data from request body:
app.use(express.json());

app.use(cors());

// Keys for push notifications
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;
const email = process.env.PUSH_EMAIL;
webpush.setVapidDetails(email, publicVapidKey, privateVapidKey);

// DB Config
const dbURI = process.env.MONGO_URI;

// Connect to Mongo DB
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to Mongo DB'))
  .catch(err => console.log(err));

// define static properties for images
app.use(express.static(__dirname + '/public/images'));

// Use express routes
app.use('/api/users', users);

// normal push notifications for demo ("Welcome back")
app.post('/subscribe', (req, res) => {
  const subscription = req.body;

  res.status(201).json({ success: true });

  const payload = JSON.stringify({
    title: 'Willkommen zurück zu Waiter',
    url: 'http://localhost:3000',
  });

  webpush
    .sendNotification(subscription, payload)
    .catch(err => console.log('Error sending the push notification: ', err));
});

// push notifications for every (weekday) morning
app.post('/subscribeMorning', (req, res) => {
  const subscription = req.body;

  res.status(201).json({ success: true });

  // Send notification for every weekday, 8:00 a.m.
  schedule.scheduleJob('0 8 * * 1-5', () => {
    // Data for push notification
    const payload = JSON.stringify({
      title: 'Neue Woche - neue Mahlzeiten',
      url: 'http://localhost:3000',
    });

    webpush
      .sendNotification(subscription, payload)
      .catch(err => console.log('Error sending the push notification: ', err));
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
