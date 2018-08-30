import React from 'react';
function Weather({newLocation, heading, days, months}) {
    return (
        <div>
            {newLocation === "" 
            // Weather details for today header
                ? "" 
                : <div className='weather__header'>
                    <div className='weather__header-temp'><strong>{newLocation.data[0].temp}</strong>&#176;</div>
                    <div className='weather__header-desc'>{newLocation.data[0].weather.description}</div>
                    <div>
                    {days[new Date(newLocation.data[0].valid_date).getDay()] + ", " + new Date(newLocation.data[0].valid_date).getDate() + " " + months[new Date(newLocation.data[0].valid_date).getMonth()]}
                    </div>
                    <div className='weather__header-sub'>
                        <img className='weather__header-img' 
                            src={`https://www.weatherbit.io/static/img/icons/${newLocation.data[0].weather.icon}.png`} 
                            alt={newLocation.data[0].weather.description}/>
                        <h1 className='weather__header-heading'>{heading}</h1>
                    </div>
                </div>
            }
        </div>
    );
}
export default Weather;