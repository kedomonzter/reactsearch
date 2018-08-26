const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.set('view engine', 'hbs');
app.use('/dist', express.static('dist'));

// Fetch the weather details for the selected city
app.get('/api/getweather/:location/:country', (req, res) => {
    return fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${req.params.location},${req.params.country}&key=401c2835a9eb4996a2c14d01fc33bddd`)
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

app.listen(8080, () => console.log('Listening on port 8080'));

