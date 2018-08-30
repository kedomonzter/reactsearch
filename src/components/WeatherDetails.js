import React from 'react';
function WeatherDetails({newLocation}) {
    return (
        <div className='weather__more-info'>
            {newLocation === "" 
                // Weather details for current day
                ? "" 
                : <div className='weather__details'>
                    <div className='weather__details-item'>Wind speed <strong>{newLocation.data[0].wind_spd}m/s</strong></div>
                    <div className='weather__details-item'>Wind direction <strong>{newLocation.data[0].wind_cdir_full}</strong></div>
                    <div className='weather__details-item'>Max Temp <strong>{newLocation.data[0].max_temp}&#176;</strong></div>
                    <div className='weather__details-item'>Min Temp <strong>{newLocation.data[0].min_temp}&#176;</strong></div>
                    <div className='weather__details-item'>Clouds <strong>{newLocation.data[0].clouds}%</strong></div>
                    <div className='weather__details-item'>Probability of Precipitation <strong>{newLocation.data[0].pop}%</strong></div>
                    <div className='weather__details-item'>Average pressure <strong>{newLocation.data[0].pres}mb</strong></div>
                    <div className='weather__details-item'>Average relative humidity <strong>{newLocation.data[0].rh}%</strong></div>
                </div>
            }
        </div>
    );
}
export default WeatherDetails;