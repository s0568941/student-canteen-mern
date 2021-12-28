# student-canteen-mern

student-canteen-mern created by GitHub Classroom (Group project at HTW Berlin)

## Run Server Locally

- Open the terminal
- Navigate into the project root:
  - `cd mensa-app-gruppe3`
  - `npm install` (installs server dependencies)
- Navigate into the client directory
  - `cd client`
  - `npm install` (installs client dependencies)
- Navigate back to the root directory:
  - `cd ..`
  - `npm run dev` to start client and server concurrently
- Set environment variables:
  - `MONGO_URI` - URI to MongoDB
  - `PUBLIC_VAPID_KEY` - Public vapid key to enable push notifications
  - `PUBLIC_VAPID_KEY` - Private vapid key to enable push notifications
  - `PUSH_EMAIL` - Email address for push notifications

## View it on Heroku

Go to: https://student-canteen.herokuapp.com/

## Sources

- Image / icon on `LoginComponent.js` and `RegisterComponent.js`:<br> https://www.clipartmax.com/middle/m2i8m2K9K9d3N4G6_how-to-change-your-account-password-password-icon-png-green/ <br>
- `LoginComponent.js` and `RegisterComponent.js` design: <br> https://bootsnipp.com/snippets/dldxB <br>
- Distance calculation in MensaWahl.js <br> https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates <br>
- Image of a coffee mug: <br> https://www.google.de/url?sa=i&url=https%3A%2F%2Ffreesvg.org%2Fcoffee-cup-silhouette&psig=AOvVaw0kQxFxA9T3ctImhZ6bO2-n&ust=1633551299252000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPjLu_iQtfMCFQAAAAAdAAAAABAD
