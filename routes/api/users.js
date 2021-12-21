const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // encrypting / hashing passwords

// User Model
const User = require('../../models/UserData');

// checks if session exists
const checkAuthenticated = req => {
  return req.session.user !== undefined;
};

/**
 * GET route api/users/authStatus
 * Checks after refresh of page whether session exists
 * Enables single sign on
 */
router.get('/authStatus', (req, res) => {
  const isAuthenticated = checkAuthenticated(req);
  return res.json({ authenticated: isAuthenticated, user: req.session.user });
});

/**
 * DELETE route api/users/logOut
 * Logs user out and destroys session
 */
router.delete('/logOut', (req, res) => {
  const isAuthenticated = checkAuthenticated(req);
  if (isAuthenticated) {
    req.session.destroy();
    return res.json({ success: true });
  }
  return res.json({ success: false });
});

/**
 * POST route api/users/login
 * Login by checking if user exists in DB
 */
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.find({ username }).then(users => {
    if (users.length === 0) return res.json({ success: false });
    try {
      users.forEach(async user => {
        if (user.username === username) {
          const passwordMatches = await bcrypt.compare(password, user.password);
          if (passwordMatches) {
            fetchedUser = {
              preferences: user.preferences,
              preferencesSettings: user.preferencesSettings,
              canteen: user.canteen,
              role: user.role,
              favoriteMeals: user.favoriteMeals,
              mealRating: user.mealRating,
              pushNotificationsEnabled: user.pushNotificationsEnabled,
              morningUpdateNotif: user.morningUpdateNotif,
              newsNotif: user.newsNotif,
              specialOfferNotif: user.specialOfferNotif,
              _id: user._id,
              username: user.username,
            };
            req.session.user = fetchedUser;
            return res.json({ success: true, user: fetchedUser });
          } else {
            return res.json({ success: false });
          }
        }
      });
    } catch (error) {
      return res.json({ success: false, error });
    }
  });
});

/**
 * POST route api/users/register
 * Create a user via registration page
 */
router.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confPassword = req.body.confPassword;

  // check field length
  if (
    !(username && password && confPassword) ||
    username.length < 3 ||
    password.length < 5 ||
    confPassword.length < 5
  ) {
    const requiredFields = [username, password, confPassword].map(
      (field, indx) => {
        if (indx === 0 && (!field || field.length < 3 || field.length > 20)) {
          return 'Username';
        } else if (
          indx === 1 &&
          (!field || field.length < 5 || field.length > 50)
        ) {
          return 'Passwort';
        } else if (
          indx === 2 &&
          (!field || field.length < 5 || field.length > 50)
        ) {
          return 'Passwort bestätigen';
        }
      }
    );
    return res.json({ success: false, requiredFields });
  } else if (password !== confPassword) {
    return res.json({
      success: false,
      validPasswords: false,
      msg: 'Die Passwörter stimmen nicht überein.',
    });
  } else {
    // check if user already exists:
    User.find({ username }).then(async users => {
      const usernameAvailable = users.length === 0;
      if (usernameAvailable) {
        try {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
          });

          newUser.save().then(user =>
            res.json({
              success: true,
              user: { id: user._id, username: user.username },
            })
          );
        } catch (error) {
          return res.json({
            success: false,
            msg: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
            error,
          });
        }
      } else {
        return res.json({
          success: false,
          msg: 'Username ist bereits registriert.',
          userExists: true,
        });
      }
    });
  }
});

/**
 * POST route api/users/settings
 * Change Settings of a user via setup or lifestyle page
 */
router.post('/update', async (req, res) => {
  const user = req.body.updatedUser;

  User.findByIdAndUpdate(user._id, user, { new: true }, function (err, user) {
    if (err) {
      console.log('error updating user ', err);
      res.status(500).send({
        success: false,
        msg: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
        err,
      });
    } else {
      updatedUser = {
        preferences: user.preferences,
        preferencesSettings: user.preferencesSettings,
        canteen: user.canteen,
        role: user.role,
        favoriteMeals: user.favoriteMeals,
        mealRating: user.mealRating,
        pushNotificationsEnabled: user.pushNotificationsEnabled,
        morningUpdateNotif: user.morningUpdateNotif,
        newsNotif: user.newsNotif,
        specialOfferNotif: user.specialOfferNotif,
        _id: user._id,
        username: user.username,
      };
      req.session.user = updatedUser;
      res.send({ success: true, user: updatedUser });
    }
  });
});

module.exports = router;
