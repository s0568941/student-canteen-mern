const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserDataSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    type: String,
    default: null, // 'alles', 'vegetarisch', 'vegan'
  },
  preferencesSettings: {
    type: String,
    default: null, // 'kennzeichnen', 'ausblenden'
  },
  canteen: {
    type: Number, // stores the ID of the canteen
    default: null, // by default, no dishes are shown: until mensa is chosen
  },
  role: {
    type: String,
    default: null, // 'student', 'arbeitnehmer', 'keine auswahl', (if null then setup needed)
  },
  favoriteMeals: {
    type: Array, // stores ID of the meal
    default: [], // array containing meals as objects
  },
  mealRating: {
    type: String,
    default: null, // serialized array of objects
  },
  pushNotificationsEnabled: {
    type: Boolean,
    default: false,
  },
  // these are the different push notification options (shorthand: "Notif");
  morningUpdateNotif: {
    type: Boolean,
    default: false,
  },
  newsNotif: {
    type: Boolean,
    default: false,
  },
  specialOfferNotif: {
    type: Boolean,
    default: false,
  },
});

module.exports = UserData = mongoose.model('userData', UserDataSchema);
