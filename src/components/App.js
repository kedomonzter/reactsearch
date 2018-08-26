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
        this.getNewLocation = this.getNewLocation.bind(this);
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
    getNewLocation(event){
        event.preventDefault();
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
    }


    // Get search autocomplete cities list
    newLocationChangeHandler(event){
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
                <form onSubmit={this.getNewLocation} className="search" id="search">
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

                    <button className="btn btn__search">Go</button>
                </form>
                <h1>{this.state.heading === "" ? "" : this.state.heading }</h1>
                {this.state.newLocation === "" 
                    ? "" 
                    : <div className=''>{this.state.newLocation.data[0].temp}</div>}
                
            </div>
        )
    }
}

export default App;