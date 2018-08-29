import React from 'react';
import cx from 'classnames';

class App extends React.Component {
    constructor(){
        super();
        this.state = {
            newLocation: "",
            location: "",
            country: "",
            searchAutocomplete: [],
            searchAutocompleteOpen: false,
            searchCityNotFound: false,
            heading: "",
            template: 'less-twenty',
            loading: false
        }
        this.getUserLocation = this.getUserLocation.bind(this);
        this.getNewLocationSubmit = this.getNewLocationSubmit.bind(this);
        this.fetchLocation = this.fetchLocation.bind(this);
        this.newLocationChangeHandler = this.newLocationChangeHandler.bind(this);
        this.updateSearchField = this.updateSearchField.bind(this);
        this.setCookie = this.setCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
    }

    componentDidMount(){
        // Display user location weather details
        this.getUserLocation();
    }

    // Get user location
    getUserLocation(){
        fetch("http://ipinfo.io/json")
            .then((response) =>  response.json())
            .then((response) => {
                if(response.loc) {
                    const coord = response.loc.split(',');
                    const lat = coord[0];
                    const lon = coord[1];

                    this.setState({
                        latitude: lat,
                        longitude: lon, 
                        location: response.city,  
                        country: response.country,
                        heading: response.city + ', ' + response.country,
                        searchCityNotFound: false,
                        loading: true
                    })
                    this.fetchLocation();
                } else {
                    this.setState({
                        searchCityNotFound: true
                    })
                }
                })
            .catch((error) => {
                // If error fetching forecast use instead the latest one fetched
                // const storedForecast = JSON.parse(localStorage.getItem("storedForecast"));
                var storedForecast = this.getCookie('storedForecast');
                if (storedForecast) {
                    this.setState({
                        newLocation: storedForecast, 
                        heading: storedForecast.city_name + ', ' + storedForecast.country_code
                    })
                }
                console.log('error', error)
            });
    }

    // Fetch weather details for a given location
    fetchLocation(){
        fetch(`/api/getweather/${this.state.latitude}/${this.state.longitude}`)
            .then((response) =>  {
                this.setState({
                    loading: true
                })
                return response.json();
            }
            )
            .then((response) =>  {
                // console.log('City weather', response);
                this.setState({
                    newLocation: response,
                    searchCityNotFound: false,
                    loading: false
                });
                const storedData = JSON.stringify(response);
                this.setCookie('storedForecast', storedData,7);
                // localStorage.setItem('storedForecast', JSON.stringify(response));

                // Set template background depending on temperature
                const temperature = response.data[0].temp;
                if (temperature < 0) {
                    this.setState({
                        template:  'negative'
                    });
                } else if (temperature < 10){
                    this.setState({
                        template:  'less-ten'
                    });
                } else if (temperature < 20) {
                    this.setState({
                        template:  'less-twenty'
                    });
                } else {
                    this.setState({
                        template:  'more-twenty'
                    });
                };
            })
            .catch((error) => console.log('error', error));
    }

    // Get new location details (city name and country code)
    getNewLocationSubmit(event){
        event.preventDefault();
            fetch(`/api/details/${this.state.location}`)
                .then(cityDetails => cityDetails.json())
                .then(cityDetails => {
                    this.setState({
                        latitude: cityDetails.geobyteslatitude,
                        longitude: cityDetails.geobyteslongitude,
                        country: cityDetails.geobytesinternet,
                        heading: cityDetails.geobytescity + ', ' + cityDetails.geobytesinternet,
                        location: cityDetails.geobytescity,
                        loading: true
                    })
                    this.fetchLocation();
                })
    }

    // Get search autocomplete cities list
    newLocationChangeHandler(event){
        event.preventDefault();
        if(event.target.value.length > 2) {
            fetch(`/api/geo/${event.target.value}`)
                .then(cities => cities.json())
                .then(cities => {
                    if(cities.length === 1 && cities[0] === "") {
                        this.setState({ 
                            'searchAutocomplete': []
                        })
                    } else {
                        this.setState({ 
                            'searchAutocomplete': cities,
                            'searchAutocompleteOpen': true
                        })
                    }
                })
                .catch(error => console.log('error', error))
        }
       
    }

    // Update search field when click 
    // on autocomplete list item.
    updateSearchField(event){
        document.querySelector('#search__field').value = event.target.textContent;
        this.setState({
            location: event.target.textContent,
            searchAutocompleteOpen: false
        });
    }

    // Cookies management
    setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    
    render(){
        console.log('this.state.newLocation', this.state.newLocation);
        const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return (
            <div className={'weather__app ' + this.state.template}>
                <div className='search'>
                    <form  role="search" onSubmit={(e) => e.preventDefault()} className="search__form" id="search__form">
                        <label style={{display:'none'}} htmlFor="search__field">Get forecast</label>
                        <input
                            onChange={this.newLocationChangeHandler} 
                            className="search__field" 
                            id="search__field" 
                            name="search__field" 
                            placeholder="Enter city name"
                            autoComplete="off"
                            aria-label="Introduce the city you want the forecast for." />

                        <button aria-label="Get forecast of the given" onClick={(e) => this.getNewLocationSubmit(e)} type="button" className="btn btn__search">Get Forecast</button>
                        <ul className={cx('search__autocomplete', {
                                'search__autocomplete-open': this.state.searchAutocompleteOpen
                            })} 
                            id="search__autocomplete">
                            {
                                this.state.searchAutocomplete.length > 0
                                    ? this.state.searchAutocomplete.map(elem => {
                                        return <li onClick={this.updateSearchField} key={elem}>{elem}</li>
                                    })
                                    :  ""
                            }
                        </ul>
                    </form>
                </div>
                <div className='weather'>
                    {this.state.newLocation === "" 
                        // Weather details for today header
                            ? "" 
                            : <div className='weather__header'>
                                <div className='weather__header-temp'><strong>{this.state.newLocation.data[0].temp}</strong>&#176;</div>
                                <div className='weather__header-desc'>{this.state.newLocation.data[0].weather.description}</div>
                                <div>
                                {days[new Date(this.state.newLocation.data[0].valid_date).getDay()] + ", " + new Date(this.state.newLocation.data[0].valid_date).getDate() + " " + months[new Date(this.state.newLocation.data[0].valid_date).getMonth()]}
                                </div>
                                <div className='weather__header-sub'>
                                    <img className='weather__header-img' 
                                        src={`https://www.weatherbit.io/static/img/icons/${this.state.newLocation.data[0].weather.icon}.png`} 
                                        alt={this.state.newLocation.data[0].weather.description}/>
                                    <h1 className='weather__header-heading'>{this.state.heading}</h1>
                                </div>
                            </div>
                        }
                    
                    <div className='weather__more-info'>
                        {this.state.newLocation === "" 
                            // Weather details for today
                            ? "" 
                            : <div className='weather__details'>
                                <div className='weather__details-item'>Wind speed <strong>{this.state.newLocation.data[0].wind_spd}m/s</strong></div>
                                <div className='weather__details-item'>Wind direction <strong>{this.state.newLocation.data[0].wind_cdir_full}</strong></div>
                                <div className='weather__details-item'>Max Temp <strong>{this.state.newLocation.data[0].max_temp}&#176;</strong></div>
                                <div className='weather__details-item'>Min Temp <strong>{this.state.newLocation.data[0].min_temp}&#176;</strong></div>
                                <div className='weather__details-item'>Clouds <strong>{this.state.newLocation.data[0].clouds}%</strong></div>
                                <div className='weather__details-item'>Probability of Precipitation <strong>{this.state.newLocation.data[0].pop}%</strong></div>
                                <div className='weather__details-item'>Average pressure <strong>{this.state.newLocation.data[0].pres}mb</strong></div>
                                <div className='weather__details-item'>Average relative humidity <strong>{this.state.newLocation.data[0].rh}%</strong></div>
                            </div>
                        }
                    </div>

                    
                    <div className={cx('error__no-location', {
                        'error__no-location--visible': this.state.searchCityNotFound
                    })}>
                        <p>Sorry, we can't find your location.</p>
                        <p>Try using the search.</p>
                    </div>
                    
                    
                    <div className={cx('error__no-location', {
                        'error__no-location--visible': !this.state.searchCityNotFound
                    })}>
                        
                            {this.state.newLocation === "" 
                                // Return weather details for five days after today
                                ? "" 
                                :   <div>
                                        <h2 className='weather__subheading'>Next 5 Days</h2>
                                        <div className='weather__next-days'>
                                        {this.state.newLocation.data.map((day, index) => {
                                            return index > 0 && index < 6 
                                                ?  <div key={index} className='weather__next-day'>
                                                        <div>{months[new Date(day.valid_date).getMonth()] + " " + new Date(day.valid_date).getDate()}</div>
                                                        <img className='weather__next-day-image' 
                                                            src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`} 
                                                            alt={day.weather.description}/>
                                                        <div className='weather__next-day-temp'>{day.max_temp}&#176;</div>
                                                    </div>
                                            : null
                                        })}
                                        </div>
                                </div>
                            }
                        
                    </div>
                    
                </div>
                <div className={cx('o-loading o-loading--light o-loading--large', {
                    'o-loading-visible': this.state.loading
                })}></div>
            </div>
        )
    }
}

export default App;