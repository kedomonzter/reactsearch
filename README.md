#FT Weather App

Website app that shows the real-time weather for your current location and for a location of your choice.

## Instructions

* Clone this repo. Run `npm install` to get all dependencies.
* Run `npm run nodemon` to get node server running.
* Open localhost:8080 in your browser.
* Alternatively, you can find a working version of the app running at http://ft-weather.herokuapp.com.

## Features

* Stack
  * Node and Express
  * Javascript/React
  * CSS/SASS

* Used APIs
  * http://ipinfo.io/json => Get current location on loading app
  * http://geobytes.com => Fetch city details (country code, city name) to generate the list of available cities.
  * http://weatherbit.io => Used to fetch the weather forecast for the next 16 days using latitude and longitude.

* Stretch goals
  * Be responsive => Although it's mainly a mobile app it works on desktop screens as well thanks to media queries. 
  * Be accessible => I have configured basic accesibility features for screen readers.
  * Be built using Javascript and node.js => The app runs in Node and Express with React on the client side.
  * Be deployed on Heroku => http://ft-weather.herokuapp.com
  * Use​ ​ Origami​ Components => I have used the o-fonts@^3.0.4, o-normalise@^1.6.2 and o-loading@^2.2.2
  * Work offline => I have implemented localStorage for keeping on the browser the latest weather forecast fetched.