import React from 'react';

class App extends React.Component {
    constructor(){
        super();
        this.state = {
            newLocation: "",
            location: "",
            country: "",
            searchAutocomplete: [],
            searchCityNotFound: false,
            heading: ""
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
                this.setState({ 
                    location: response.city,  
                    country: response.country,
                    heading: response.city + ', ' + response.country
                })
                this.fetchLocation();
            })
            .catch((error) => console.log('error', error));
    }

    // Fetch weather details for a given location
    fetchLocation(){
        fetch(`/api/getweather/${this.state.location}/${this.state.country}`)
            .then((response) =>  response.json())
            .then((response) =>  {
                console.log('City weather', response);
                this.setState({
                    newLocation: response 
                  });
                })
            .catch((error) => console.log('error', error));
    }

    // Get new location details (city name and country code)
    getNewLocationSubmit(event){
        event.preventDefault();
        // document.querySelector('#search').addEventListener('keypress', (event) => {
        //     let code = "";
        //     code = event.key === "Enter" || event.keyCode || event.which;

        // console.log('event.key', event.key)
        // console.log('event.keyCode', event.keyCode)
        // console.log('event.which', event.whichy)
            
        // });
        // if(event.key === "Enter" || event.keyCode || event.which) {
        //     return false;
        // } else {
            fetch(`/api/details/${this.state.location}`)
                .then(cityDetails => cityDetails.json())
                .then(cityDetails => {
                    this.setState({
                        country: cityDetails.geobytesinternet,
                        heading: cityDetails.geobytescity + ', ' + cityDetails.geobytescountry,
                        location: cityDetails.geobytescity
                    })
                    this.fetchLocation();
                })   
        // }
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
                            'searchAutocomplete': [],
                            'searchCityNotFound': true
                        })
                    } else {
                        this.setState({ 'searchAutocomplete': cities})
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
            location: event.target.textContent
        });
    }


    
    render(){
        return (
            <div>
                <form onSubmit={(e) => e.preventDefault()} className="search" id="search">
                    <label className="search__label" htmlFor="search__field">City</label>
                    <input
                        onChange={this.newLocationChangeHandler} 
                        className="search__field" 
                        id="search__field" 
                        name="search__field" 
                        placeholder="Enter city name"
                        autoComplete="off" />

                        <ul className="search__autocomplete" id="search__autocomplete">
                            {
                                this.state.searchAutocomplete.length > 0
                                    ? this.state.searchAutocomplete.map(elem => {
                                        return <li onClick={this.updateSearchField} key={elem}>{elem}</li>
                                    })
                                    :  ""
                            }
                        </ul>

                    <button onClick={(e) => this.getNewLocationSubmit(e)} type="button" className="btn btn__search">Go</button>
                </form>

                
                
                {this.state.newLocation === "" 
                        ? "" 
                        : <div className=''>
                            <img src={`https://www.weatherbit.io/static/img/icons/${this.state.newLocation.data[0].weather.icon}.png`} className="" alt=""/>
                            <div className=''><strong>{this.state.newLocation.data[0].temp}&#176;</strong></div>
                            <h1>{this.state.heading}</h1>
                            <div className=''><strong>{this.state.newLocation.data[0].valid_date}</strong></div>
                            <div className=''><strong>{this.state.newLocation.data[0].weather.description}</strong></div>
                        </div>
                    }

                {this.state.newLocation === "" 
                    ? "" 
                    : <div className=''>
                        <div className=''>Wind speed <strong>{this.state.newLocation.data[0].wind_spd}m/s</strong></div>
                        <div className=''>Wind direction <strong>{this.state.newLocation.data[0].wind_cdir_full}</strong></div>
                        <div className=''>Max Temp <strong>{this.state.newLocation.data[0].max_temp}&#176;</strong></div>
                        <div className=''>Min Temp <strong>{this.state.newLocation.data[0].min_temp}&#176;</strong></div>
                        <div className=''>Clouds <strong>{this.state.newLocation.data[0].clouds}%</strong></div>
                        <div className=''>Probability of Precipitation <strong>{this.state.newLocation.data[0].pop}%</strong></div>
                        <div className=''>Average pressure <strong>{this.state.newLocation.data[0].pres}mb</strong></div>
                        <div className=''>Average relative humidity <strong>{this.state.newLocation.data[0].rh}%</strong></div>
                    </div>
                }

                {this.state.newLocation === "" 
                    ? "" 
                    : this.state.newLocation.data.map((day, index) => {
                        return index > 0 && index < 6 
                            ?  <div className=''>
                                    <div className=''><strong>{day.valid_date}</strong></div>
                                    <img src={`https://www.weatherbit.io/static/img/icons/${day.weather.icon}.png`} className="" alt=""/>
                                    <div className=''>Max Temp <strong>{day.max_temp}&#176;</strong></div>
                                    <div className=''>Min Temp <strong>{day.min_temp}&#176;</strong></div>
                                </div>
                        : null
                    })
                }
                
            </div>
        )
    }
}

export default App;