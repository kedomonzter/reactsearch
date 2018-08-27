const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.set('view engine', 'hbs');


app.use(function (req, res, next){
    if (req.headers['x-forwarded-proto'] === 'https') {
      res.redirect('http://' + req.hostname + req.url);
    } else {
      next();
    }
  });

app.use('/dist', express.static('dist'));

// Fetch the weather details for the selected city
app.get('/api/getweather/:latitude/:longitude', (req, res) => {
    return fetch(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.params.latitude}&lon=${req.params.longitude}&key=401c2835a9eb4996a2c14d01fc33bddd`)
        .then(response => response.json())
        .then((response) => {
            res.json(response);
        })
        .catch((error) => console.log('error', error));
    }
);

// Fetch all results matching the searched city and return the list
app.get('/api/geo/:city', (req, res) => {
        return fetch(`http://gd.geobytes.com/AutoCompleteCity?q=${req.params.city}`)
            .then(cities => cities.json())
            .then((cities) => res.json(cities))
            .catch((error) => console.log('error', error));
    }
);

// Fetch city details (country code, etc)
app.get('/api/details/:city', (req, res) => {
        return fetch(`http://gd.geobytes.com/GetCityDetails?fqcn=${req.params.city}`)
            .then(details => details.json())
            .then((details) => res.json(details))
            .catch((error) => console.log('error', error));
    }
);


app.get('*', (req, res) => {
    res.render("index");
});

// app.listen(8080, () => console.log('Listening on port 8080'));

// Heroku
const port = process.env.PORT || 8080;
app.listen( port, function(){
  console.log(`Listening on port number ${port}`);
});


