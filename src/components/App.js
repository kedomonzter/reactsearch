import React from 'react';
import SearchForm from './SearchForm';
import Weather from './Weather';
import WeatherDetails from './WeatherDetails';
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
            loading: false,
            days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            months: ['January','February','March','April','May','June','July','August','September','October','November','December']
        }
        this.getUserLocation = this.getUserLocation.bind(this);
        this.getNewLocationSubmit = this.getNewLocationSubmit.bind(this);
        this.fetchLocation = this.fetchLocation.bind(this);
        this.newLocationChangeHandler = this.newLocationChangeHandler.bind(this);
        this.updateSearchField = this.updateSearchField.bind(this);
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
                const storedForecast = JSON.parse(localStorage.getItem("storedForecast"));
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
                localStorage.setItem('storedForecast', JSON.stringify(response));

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
    
    render(){
        return (
            <div className={'weather__app ' + this.state.template}>
                
                <SearchForm 
                    newLocationChangeHandler={this.newLocationChangeHandler} 
                    getNewLocationSubmit={this.getNewLocationSubmit}
                    updateSearchField={this.updateSearchField}
                    searchAutocomplete={this.state.searchAutocomplete}
                    searchAutocompleteOpen={this.state.searchAutocompleteOpen}/>

                <div className='weather'>
                    
                    <Weather 
                        newLocation={this.state.newLocation} 
                        heading={this.state.heading}
                        days={this.state.days} 
                        months={this.state.months}/>
                    
                    <WeatherDetails 
                        newLocation={this.state.newLocation}/>

                    
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
                                                        <div>{this.state.months[new Date(day.valid_date).getMonth()] + " " + new Date(day.valid_date).getDate()}</div>
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